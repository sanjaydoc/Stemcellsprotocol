// Step 8 — Immune & Adverse-Event Safety Envelope.
//
// The r/stemcells reality: most reported harms from MSC / cell therapy are NOT
// tumorigenicity (that's the iPSC/OSK concern of Step 7) — they're inflammatory,
// embolic, immune and procedural events (swelling, pain, infusion reactions,
// IBMIR clotting, disease flares, infection). This module estimates a
// per-patient, per-therapy RELATIVE risk across those classes.
//
// Two-layer model (see the approved table):
//   Layer 1 — clinical:  route/tissue baseline × comorbidity modifiers
//   Layer 2 — epigenetic: age-acceleration (inflammaging proxy) personalizes it
//   × dose/cycles.
//
// HONESTY (hard boundary — mirrored in the UI/PDF): a methylation file is NOT a
// genotype, so this CANNOT see HLA type or clotting variants, and it cannot see
// the product/clinic. It gives a RELATIVE, probabilistic read (never a yes/no
// verdict) plus the tests to ask a clinician for. Not medical advice.
//
// Parity target: simulator-backend/app/scoring/immune.py (identical tables/formula).

// ---- adverse-event classes -------------------------------------------------
export type AEKey = 'local' | 'infusion' | 'embolic' | 'immune' | 'conditioning' | 'procedural';

export const AE_LABEL: Record<AEKey, string> = {
  local: 'Local inflammatory',
  infusion: 'Infusion / systemic reaction',
  embolic: 'Pulmonary embolic / clotting (IBMIR)',
  immune: 'Immune reaction / disease flare',
  conditioning: 'Conditioning toxicity + infection',
  procedural: 'Procedural / access',
};

const AE_SYMPTOMS: Record<AEKey, string[]> = {
  local: ['injection-site pain', 'swelling / effusion', 'stiffness', 'warmth (transient synovitis)'],
  infusion: ['fever / chills', 'fatigue', 'headache', 'nausea', 'flushing'],
  embolic: ['breathlessness / chest tightness', 'clotting activation (IBMIR)', 'rare pulmonary embolism'],
  immune: ['immune reaction', 'flare of the underlying disease', 'allo-sensitization (anti-HLA antibodies)'],
  conditioning: ['cytopenias', 'neutropenic fever', 'mucositis', 'hair loss', 'serious infection'],
  procedural: ['procedure-site pain / bruising', 'transient fever', 'procedural infection'],
};

// Route-specific procedural symptom wording (overrides the generic list above).
const PROCEDURAL_BY_TISSUE: Record<string, string[]> = {
  cns: ['post-lumbar-puncture headache', 'back pain', 'nausea', 'rare arachnoiditis / meningitis'],
  heart: ['access-site bruising / bleeding', 'transient arrhythmia', 'coronary microembolism'],
  pancreas: ['abdominal pain', 'pancreatitis (intra-ductal)', 'procedural infection'],
  joint: ['injection-site pain', 'rare septic arthritis'],
  retina: ['ocular discomfort', 'raised eye pressure', 'rare endophthalmitis'],
};

// ---- Layer 1a: route/tissue baseline weights (0..1) per class --------------
// Keyed by the catalog tissue_key. A higher weight = that class is a leading,
// expected risk for this delivery route. Calibrated so a plain transient
// swelling/flare reads Moderate and a conditioning-heavy aHSCT reads High.
type Weights = Partial<Record<AEKey, number>>;
const TISSUE_BASELINE: Record<string, Weights> = {
  joint:    { local: 0.45, procedural: 0.20, immune: 0.12 },
  skin:     { local: 0.35, procedural: 0.18, immune: 0.10 },
  systemic: { infusion: 0.40, embolic: 0.35, immune: 0.18, procedural: 0.06 },
  liver:    { infusion: 0.38, embolic: 0.34, immune: 0.16, procedural: 0.10 },
  kidney:   { infusion: 0.42, embolic: 0.30, immune: 0.16, procedural: 0.08 },
  pancreas: { infusion: 0.35, embolic: 0.28, procedural: 0.30, immune: 0.16 },
  heart:    { procedural: 0.38, embolic: 0.36, infusion: 0.24, immune: 0.12 },
  lung:     { embolic: 0.42, infusion: 0.30, local: 0.20, procedural: 0.12 },
  cns:      { procedural: 0.42, infusion: 0.24, immune: 0.20, local: 0.16 },
  immune:   { conditioning: 0.60, immune: 0.40, infusion: 0.26, embolic: 0.18 },
  bone:     { local: 0.38, procedural: 0.28, immune: 0.12 },
  muscle:   { infusion: 0.32, embolic: 0.28, local: 0.20, immune: 0.12 },
  gut:      { infusion: 0.32, immune: 0.26, procedural: 0.22, embolic: 0.18 },
  retina:   { procedural: 0.40, local: 0.24, immune: 0.18 },
};

// ---- Layer 1b: comorbidity modifiers (multipliers per class) ---------------
export interface Comorbidity { key: string; label: string; }
export const COMORBIDITIES: Comorbidity[] = [
  { key: 'diabetes', label: 'Diabetes' },
  { key: 'ckd', label: 'Chronic kidney disease' },
  { key: 'copd', label: 'COPD / lung disease' },
  { key: 'cirrhosis', label: 'Liver cirrhosis' },
  { key: 'autoimmune', label: 'Autoimmune disease' },
  { key: 'immunosuppressed', label: 'On immunosuppressants' },
  { key: 'prior_cell_therapy', label: 'Prior cell / stem-cell therapy' },
  { key: 'allogeneic', label: 'Donor (allogeneic) cells' },
  { key: 'thrombophilia', label: 'Known clotting disorder' },
];

const COMORBID_MULT: Record<string, Weights> = {
  diabetes:          { local: 1.4, procedural: 1.5, embolic: 1.2 },
  ckd:               { infusion: 1.5, embolic: 1.2, procedural: 1.2 },
  copd:              { embolic: 1.8, procedural: 1.2, infusion: 1.1 },
  cirrhosis:         { embolic: 1.6, procedural: 1.4, infusion: 1.1 },
  autoimmune:        { immune: 1.8, procedural: 1.2 },
  immunosuppressed:  { procedural: 1.6, conditioning: 1.2, immune: 1.1 },
  prior_cell_therapy:{ immune: 1.5 },
  allogeneic:        { immune: 1.7 },
  thrombophilia:     { embolic: 2.0 },
};

// The indication itself is a comorbidity — map department → an implied condition.
const DEPARTMENT_IMPLIED: Record<string, string> = {
  Diabetes: 'diabetes',
  Nephrology: 'ckd',
  Pulmonology: 'copd',
  Gastroenterology: 'cirrhosis',
  Autoimmune: 'autoimmune',
};

export function impliedComorbidity(department?: string | null): string | null {
  return DEPARTMENT_IMPLIED[(department || '').trim()] || null;
}

// ---- route-specific "tests to ask a clinician for" -------------------------
function testsFor(tissueKey: string, active: Set<string>): string[] {
  const t: string[] = [];
  const w = TISSUE_BASELINE[tissueKey] || TISSUE_BASELINE.systemic;
  if ((w.embolic || 0) >= 0.25 || active.has('thrombophilia'))
    t.push('Thrombophilia screen (e.g. Factor V Leiden) + baseline CRP before IV cells');
  if ((w.local || 0) >= 0.3 || (w.procedural || 0) >= 0.3)
    t.push('Confirm the clinic’s cell-prep sterility & infection precautions');
  if (active.has('allogeneic') || active.has('prior_cell_therapy'))
    t.push('HLA typing / anti-HLA antibody panel (donor-cell or repeat-dose immune risk)');
  if (tissueKey === 'lung' || active.has('copd'))
    t.push('Pulmonary function tests + O₂ saturation (reduced reserve for pulmonary entrapment)');
  if (tissueKey === 'cns')
    t.push('Discuss lumbar-puncture risks (post-LP headache, rare arachnoiditis)');
  if (active.has('cirrhosis'))
    t.push('Coagulation panel + platelets (rebalanced hemostasis)');
  if (active.has('ckd'))
    t.push('Fluid-status / volume review before IV infusion');
  if (active.has('autoimmune'))
    t.push('Disease-activity review — cell therapy can trigger a flare');
  t.push('Ask for the product’s cell source, dose, viability and release testing');
  return t;
}

const CANT_SEE = [
  'HLA type & clotting-gene variants — a methylation file is not a genotype',
  'The product itself: cell source, dose, viability, sterility',
  'The clinic’s technique and infection controls',
  'Delayed effects beyond the modelled window',
];

// ---- scoring ---------------------------------------------------------------
export interface AEClass {
  key: AEKey; label: string; tier: string; index: number; symptoms: string[]; drivers: string[];
}
export interface ImmuneEnvelope {
  overall_tier: string;
  classes: AEClass[];
  drivers: string[];
  modifiable: string[];
  tests_to_ask: string[];
  cant_see: string[];
  comorbidities: string[];
  summary: string;
  disclaimer: string;
}

function tierOf(x: number): string {
  return x < 0.25 ? 'Low' : x < 0.5 ? 'Moderate' : 'High';
}

export function immuneSafety(opts: {
  tissueKey?: string | null;
  department?: string | null;
  ageAcceleration?: number | null;
  coverage?: number;
  cycles?: number;
  comorbidities?: string[];
}): ImmuneEnvelope {
  const tissueKey = (opts.tissueKey || 'systemic').toLowerCase();
  const baseline = TISSUE_BASELINE[tissueKey] || TISSUE_BASELINE.systemic;
  const accel = Math.max(0, opts.ageAcceleration ?? 0);
  const coverage = opts.coverage ?? 1;
  const cycles = Math.max(1, Math.min(Math.trunc(opts.cycles || 1), 10));

  // Merge the indication's implied comorbidity with the user-selected ones.
  const active = new Set<string>((opts.comorbidities || []).map((c) => c.toLowerCase()));
  const implied = impliedComorbidity(opts.department);
  if (implied) active.add(implied);

  // Layer 2: inflammaging personalizer (age-acceleration proxy) — touches the
  // inflammatory/immune/embolic classes only.
  const inflaMult = 1 + Math.min(accel, 20) * 0.02;         // +10 yr -> x1.2
  const doseMult = 1 + (cycles - 1) * 0.08;                 // more doses -> more load
  const INFLAMMATORY: AEKey[] = ['local', 'infusion', 'embolic', 'immune'];

  const classes: AEClass[] = [];
  const allDrivers = new Set<string>();

  (Object.keys(baseline) as AEKey[]).forEach((key) => {
    const base = baseline[key] || 0;
    if (base < 0.1) return; // not a leading class for this route
    let score = base;
    const drivers: string[] = [];

    // comorbidity modifiers
    active.forEach((c) => {
      const m = COMORBID_MULT[c]?.[key];
      if (m && m !== 1) {
        score *= m;
        const label = COMORBIDITIES.find((x) => x.key === c)?.label || c;
        drivers.push(`${label} (×${m})${implied === c ? ' — the indication' : ''}`);
      }
    });
    // inflammaging + dose
    if (INFLAMMATORY.includes(key) && inflaMult > 1.001) {
      score *= inflaMult;
      drivers.push(`epigenetic age-acceleration +${Math.round(accel * 10) / 10} yr (×${Math.round(inflaMult * 100) / 100})`);
    }
    if ((key === 'embolic' || key === 'local' || key === 'infusion') && doseMult > 1.001) {
      score *= doseMult;
      drivers.push(`${cycles} dose(s) (×${Math.round(doseMult * 100) / 100})`);
    }

    const index = Math.min(0.98, Math.round(score * 1000) / 1000);
    const symptoms = key === 'procedural' && PROCEDURAL_BY_TISSUE[tissueKey]
      ? PROCEDURAL_BY_TISSUE[tissueKey] : AE_SYMPTOMS[key];
    classes.push({ key, label: AE_LABEL[key], tier: tierOf(index), index, symptoms, drivers });
    drivers.forEach((d) => allDrivers.add(d));
  });

  classes.sort((a, b) => b.index - a.index);
  const order = ['Low', 'Moderate', 'High'];
  const overall = classes.reduce((mx, c) => (order.indexOf(c.tier) > order.indexOf(mx) ? c.tier : mx), 'Low');

  const modifiable: string[] = [];
  if (accel >= 5) modifiable.push(`Elevated inflammatory baseline (age-acceleration +${Math.round(accel * 10) / 10} yr) is partly reversible — reduce it and re-test before therapy.`);
  if (active.has('autoimmune')) modifiable.push('Treat to low disease activity before cell therapy to lower flare risk.');
  if (active.has('ckd')) modifiable.push('Optimise fluid status before an IV infusion.');
  if (coverage < 0.8) modifiable.push(`CpG coverage ${Math.round(coverage * 100)}% — lower confidence; treat this as provisional.`);

  const comorbNames = Array.from(active).map((c) => COMORBIDITIES.find((x) => x.key === c)?.label || c);
  const lead = classes[0];
  const summary = lead
    ? `Leading risk for this route is ${lead.label.toLowerCase()} (${lead.tier}). Overall relative adverse-event risk: ${overall}. This is a relative, probabilistic read from your epigenetic profile + history — not a yes/no verdict.`
    : `Overall relative adverse-event risk: ${overall}.`;

  return {
    overall_tier: overall,
    classes,
    drivers: Array.from(allDrivers),
    modifiable,
    tests_to_ask: testsFor(tissueKey, active),
    cant_see: CANT_SEE,
    comorbidities: comorbNames,
    summary,
    disclaimer: 'Illustrative, RELATIVE immune / adverse-event risk stratification — not a diagnosis or a yes/no prediction. '
      + 'A methylation file is not a genotype: it cannot read HLA type or clotting variants, and it cannot see the product or clinic. '
      + 'It informs the conversation with your clinician; it does not replace it. Not medical advice.',
  };
}
