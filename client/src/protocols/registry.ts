// StemCells Protocol — coded protocol registry (v0.1, draft).
//
// Four categories, each therapy carries a code. Category is assigned by PRIMARY
// modality/intent (not disease), so a therapy is coded once and cross-referenced
// where it spans modalities:
//   CT  — Cell Therapies: immune / effector / transplant cells and cells used
//         primarily for immune reset or haematologic reconstitution (HSCT, aHSCT,
//         CAR-T, NK, Treg, and MSC used for immunomodulation in autoimmune/GvHD).
//   ST  — Stem-cell Therapies: stem/progenitor cells for ORGAN / TISSUE
//         regeneration or replacement (MSC, HSC/EPC, iPSC-derived, NSC).
//   RMT — Regenerative Medicine Therapies: acellular / local tissue-repair
//         products (exosomes/EVs, PRP, secretome, growth factors, scaffolds, SVF).
//   GT  — Gene & Epigenetic Therapies: in-vivo / ex-vivo genetic or epigenetic
//         modification (AAV gene replacement, gene editing, OSK reprogramming, RNAi).
//
// Doses/intervals/consumables are TYPICAL PUBLISHED RANGES or representative
// CATEGORIES — validation-required, never fixed instructions. See standards.ts.

export type Category = 'CT' | 'ST' | 'RMT' | 'GT';
export type Status = 'established' | 'investigational';

export interface CategoryDef { key: Category; name: string; blurb: string; icon: string; accent: string; }
export const CATEGORIES: CategoryDef[] = [
  { key: 'CT',  name: 'Cell Therapies',                 blurb: 'Immune / effector / transplant cells & immune-reset therapies (HSCT, aHSCT, CAR-T, NK, Treg, immunomodulatory MSC).', icon: 'clinician', accent: '#4285F4' },
  { key: 'ST',  name: 'Stem-cell Therapies',            blurb: 'Stem / progenitor cells for organ & tissue regeneration or replacement (MSC, HSC/EPC, iPSC-derived, NSC).',            icon: 'dna',       accent: '#22c55e' },
  { key: 'RMT', name: 'Regenerative Medicine Therapies', blurb: 'Acellular & local tissue-repair — exosomes/EVs, PRP, secretome, growth factors, scaffolds, SVF.',                     icon: 'heart',     accent: '#a855f7' },
  { key: 'GT',  name: 'Gene & Epigenetic Therapies',     blurb: 'In-vivo / ex-vivo genetic & epigenetic modification — gene replacement, gene editing, OSK reprogramming, RNAi.',       icon: 'brain',     accent: '#f59e0b' },
];

export interface Consumable { item: string; examples?: string; }
export interface Ref { label: string; note: string; }
export interface Protocol {
  code: string;            // e.g. 'CT-01'
  category: Category;
  name: string;
  aka?: string;
  indication: string;
  status: Status;
  cellSource: string;      // product & source
  mechanism: string;
  route?: string;
  dose?: string;           // typical published range — validation required
  schedule?: string;       // doses / intervals
  identity?: string;       // identity / potency / release
  preScreen?: string[];
  steps?: string[];
  consumables?: Consumable[];
  qcRelease?: string[];
  monitoring?: string[];
  adverse?: string[];
  contraindications?: string[];
  storage?: string;
  governance?: string[];
  evidence?: string;
  references?: Ref[];
  detailed: boolean;       // true = fully worked exemplar
}

// ── Fully-worked exemplars (one per category) ───────────────────────────────
const EXEMPLARS: Protocol[] = [
  {
    code: 'CT-01', category: 'CT', name: 'Autologous HSCT for Multiple Sclerosis', aka: 'aHSCT / AHSCT',
    indication: 'Highly-active relapsing-remitting MS failing standard disease-modifying therapy.',
    status: 'established',
    cellSource: 'Autologous CD34⁺ haematopoietic progenitor cells (peripheral-blood, G-CSF ± cyclophosphamide mobilised).',
    mechanism: 'Immunoablative conditioning removes the autoreactive immune repertoire; reinfused HPCs reconstitute a naïve, self-tolerant immune system ("immune reset").',
    route: 'IV infusion of the graft after conditioning.',
    dose: 'Graft target ≥2 ×10⁶ CD34⁺ cells/kg (≥5 ×10⁶/kg preferred for robust engraftment). Typical published range 2–8 ×10⁶ CD34⁺/kg.',
    schedule: 'Single transplant episode: mobilisation → apheresis → conditioning (~5–7 days) → reinfusion (day 0) → engraftment (~10–14 days).',
    identity: 'CD34⁺ enumeration + viability (7-AAD) by flow; ISBT-128 labelled; sterility & endotoxin on the cryopreserved product.',
    preScreen: [
      'Neurology + transplant MDT confirmation of highly-active MS and DMT failure.',
      'Cardiac (ECG/ECHO), pulmonary (PFTs), renal & hepatic function; infection screen (HIV/HBV/HCV/CMV/EBV).',
      'Cryopreserve fertility counselling (conditioning is gonadotoxic).',
    ],
    steps: [
      'Mobilise: cyclophosphamide ~2 g/m² + G-CSF ~5–10 µg/kg/day until apheresis.',
      'Collect by leukapheresis; enumerate CD34⁺; cryopreserve to target dose.',
      'Condition: intermediate-intensity regimen (e.g. cyclophosphamide 200 mg/kg + ATG, or BEAM+ATG) per programme.',
      'Reinfuse thawed autograft IV (day 0) with standard premedication.',
      'Supportive care through aplasia: neutropenic precautions, transfusion support, antimicrobial prophylaxis.',
      'Confirm engraftment (neutrophils >0.5 ×10⁹/L ×3 days); discharge on the follow-up schedule.',
    ],
    consumables: [
      { item: 'Apheresis kit & anticoagulant (ACD-A)', examples: 'Spectra Optia / COBE-class separators' },
      { item: 'Closed cell-processing / volume reduction', examples: 'Sepax, CliniMACS Prodigy class' },
      { item: 'Cryopreservation', examples: 'DMSO cryoprotectant, EVA cryobags, controlled-rate freezer, vapour-phase LN₂' },
      { item: 'Infusion set', examples: 'Non-filtered blood administration set, warmed saline' },
    ],
    qcRelease: ['CD34⁺ viability within spec', 'Sterility (14-day) & endotoxin (LAL) negative', 'ISBT-128 identity verified two-person'],
    monitoring: ['Daily CBC/vitals through aplasia', 'Infection & mucositis surveillance', 'EDSS/MRI at 6–12 months then annually', 'Long-term follow-up ≥5 years'],
    adverse: ['Conditioning toxicity (cytopenias, mucositis, febrile neutropenia, infection)', 'Engraftment syndrome', 'Infertility', 'Secondary autoimmunity/malignancy (rare, long-term)'],
    contraindications: ['Active infection', 'Inadequate cardiac/pulmonary/renal reserve', 'Pregnancy', 'Progressive MS without inflammatory activity (poor response)'],
    storage: 'Cryopreserved in vapour-phase LN₂ with continuous temperature monitoring; validated cold-chain to bedside thaw.',
    governance: ['FACT-JACIE accredited programme', 'cGMP / GTP processing', 'ISBT-128 labelling', 'IRB/ethics + regulator per jurisdiction'],
    evidence: 'Established for highly-active RRMS — supported by RCT (MIST) and large EBMT registry series.',
    references: [
      { label: 'EBMT / FACT-JACIE Standards', note: 'Programme accreditation & administration standards for HCT.' },
      { label: 'MIST randomised trial (JAMA 2019)', note: 'aHSCT vs DMT in relapsing MS.' },
      { label: 'ISBT 128', note: 'Product identity & traceability.' },
    ],
    detailed: true,
  },
  {
    code: 'ST-14', category: 'ST', name: 'Knee Osteoarthritis — MSC (intra-articular)', aka: 'IA-MSC',
    indication: 'Symptomatic knee osteoarthritis (Kellgren-Lawrence II–III) inadequately controlled by conservative care.',
    status: 'established',
    cellSource: 'Autologous or allogeneic MSCs — bone-marrow, adipose (AD-MSC) or umbilical-cord derived.',
    mechanism: 'Paracrine immunomodulation + trophic support: reduces synovial inflammation and supports chondral maintenance (chondroprotective, not proven regrowth).',
    route: 'Single intra-articular injection under aseptic technique (± ultrasound guidance).',
    dose: 'Typical published range 1 ×10⁷ – 1 ×10⁸ cells per knee (commonly ~2.5–5 ×10⁷). Dose-finding still evolving.',
    schedule: 'Single injection; some protocols repeat at 6–12 months. Assess response at 6 & 12 months.',
    identity: 'ISCT MSC criteria (CD73/CD90/CD105⁺, negative markers, tri-lineage); viability ≥ release spec; sterility & endotoxin negative.',
    preScreen: [
      'Confirm OA grade on weight-bearing X-ray/MRI; exclude mechanical derangement needing surgery.',
      'Exclude active joint infection and intra-articular steroid within the washout window.',
      'Baseline pain/function scores (VAS, WOMAC/KOOS).',
    ],
    steps: [
      'Aseptic prep & drape; optional ultrasound guidance to confirm intra-articular placement.',
      'If effusion present, aspirate before injection.',
      'Inject the MSC suspension into the joint space; avoid intravascular placement.',
      'Short rest; relative offloading 24–48 h; avoid NSAIDs per protocol (may blunt paracrine effect).',
      'Structured rehabilitation / physiotherapy from ~week 1.',
    ],
    consumables: [
      { item: 'Aseptic injection set', examples: 'Sterile drape, chlorhexidine/iodine prep, 18–22 G needle, syringe' },
      { item: 'Ultrasound (optional)', examples: 'Portable MSK ultrasound with sterile probe cover' },
      { item: 'Cell product carrier', examples: 'Saline / Ringer’s vehicle; on-label MSC product or GMP batch' },
    ],
    qcRelease: ['ISCT identity & viability within spec', 'Sterility & endotoxin negative', 'Two-person ID/label check'],
    monitoring: ['Post-injection flare check at 24–72 h', 'VAS/WOMAC/KOOS at 6 & 12 months', 'Imaging at 12 months if indicated'],
    adverse: ['Transient injection-site pain / swelling / synovitis (common, self-limiting)', 'Rare septic arthritis (procedural)', 'Allo-sensitisation with allogeneic repeat dosing'],
    contraindications: ['Active joint or systemic infection', 'Uncontrolled coagulopathy', 'Pregnancy', 'End-stage OA better served by arthroplasty'],
    storage: 'Fresh product used within its validated window, or cryopreserved and thawed/washed to remove DMSO before injection.',
    governance: ['cGMP / GTP product', 'ISCT identity criteria', 'Local regulator (autologous minimal-manipulation vs ATMP) determination', 'IRB where investigational'],
    evidence: 'Widely practised; multiple RCTs show symptom/function benefit — structural disease-modification remains unproven.',
    references: [
      { label: 'ISCT MSC position statement', note: 'Minimal identity criteria.' },
      { label: 'OA IA-MSC RCTs / meta-analyses', note: 'Symptom & function outcomes, dose ranges.' },
    ],
    detailed: true,
  },
  {
    code: 'RMT-01', category: 'RMT', name: 'Skin Rejuvenation — MSC Exosomes', aka: 'EV skin therapy',
    indication: 'Cosmetic skin ageing, post-procedure recovery, dermal quality (investigational; cosmetic-adjacent).',
    status: 'investigational',
    cellSource: 'Acellular MSC-derived exosomes / extracellular vesicles (30–150 nm) — regenerative miRNA + growth-factor cargo.',
    mechanism: 'Paracrine signalling: pro-angiogenic, anti-inflammatory and matrix-remodelling cargo delivered without living cells (cell-free).',
    route: 'Topical after fractional laser / microneedling, or intradermal micro-injection per protocol.',
    dose: 'Vendor-defined particle count per treatment (typ. ~10⁹–10¹¹ particles); no consensus clinical dose — validation required.',
    schedule: 'Course of ~3 sessions at 2–4 week intervals is commonly used; evidence base is early.',
    identity: 'EV characterisation: size distribution (NTA), tetraspanin markers (CD9/CD63/CD81), particle count, purity, sterility & endotoxin.',
    preScreen: ['Exclude active skin infection/dermatitis at the site.', 'Patch/allergy consideration for the vehicle.', 'Document baseline photography.'],
    steps: [
      'Cleanse & prep the treatment area.',
      'Create controlled micro-channels (microneedling / fractional laser) per device protocol.',
      'Apply/inject the reconstituted exosome product immediately.',
      'Post-care: sun protection, gentle skincare, avoid actives for 24–72 h.',
    ],
    consumables: [
      { item: 'Delivery device', examples: 'Microneedling pen / fractional laser, sterile tips' },
      { item: 'EV product', examples: 'GMP-characterised MSC-exosome vial + reconstitution diluent' },
      { item: 'Aseptic supplies', examples: 'Sterile gloves, prep, gauze' },
    ],
    qcRelease: ['EV size/marker/purity within spec', 'Sterility & endotoxin negative', 'Cold-chain integrity confirmed'],
    monitoring: ['Immediate skin reaction check', 'Photographic follow-up at 4–12 weeks'],
    adverse: ['Transient erythema / swelling', 'Rare infection or hypersensitivity to the vehicle'],
    contraindications: ['Active infection at site', 'Known hypersensitivity', 'Unrealistic expectation / medical-claim misuse'],
    storage: 'Frozen per manufacturer (often −20 to −80 °C); single-use after reconstitution.',
    governance: ['Cosmetic vs medical claim boundary is jurisdiction-specific — do not market unproven medical benefit', 'GMP characterisation', 'Ethics where investigational'],
    evidence: 'Investigational / early evidence; commonly offered cosmetically — clinical efficacy not established.',
    references: [{ label: 'MISEV EV guidelines', note: 'Minimal information for studies of extracellular vesicles (characterisation).' }],
    detailed: true,
  },
  {
    code: 'GT-01', category: 'GT', name: 'Persona Reversal — Systemic OSK Epigenetic Reprogramming', aka: 'Partial reprogramming',
    indication: 'Systemic biological-age reversal (flagship research programme; NOT an approved therapy).',
    status: 'investigational',
    cellSource: 'In-vivo transient OCT4·SOX2·KLF4 (OSK) expression — inducible (Tet-On) dual-AAV or IV exosome-mRNA delivery.',
    mechanism: 'Brief, controlled partial reprogramming resets age-associated epigenetic marks toward a younger state WITHOUT loss of cell identity — pulsed, never continuous.',
    route: 'IV infusion (systemic); dose-controlled inducible expression.',
    dose: 'Research-stage — no established human dose. Modelled as pulsed cycles with a per-patient tumorigenicity safety envelope (see Simulator).',
    schedule: 'Transient "dox-on" pulses (e.g. 3–5 days) with washout and re-measurement between pulses; stop at the youth setpoint.',
    identity: 'Vector identity, copy number, insertion-site profile; inducibility & off-state leakiness; kill-switch functionality.',
    preScreen: ['Epigenetic-age + immune / adverse-event pre-screen via the Simulator.', 'Tumour-marker & imaging baseline.', 'Exclude active/prior malignancy.'],
    steps: [
      'Run the Protocol Simulator for a per-patient safe dosing envelope (max safe cycles).',
      'Avatar pre-screen (patient-derived graft) before any patient dosing.',
      'Administer one transient pulse; keep expression inducible and time-limited.',
      'Re-methylate & re-run the clock; assess safety markers before any further pulse.',
      'Escalate only within the modelled envelope; abort via kill-switch on any danger signal.',
    ],
    consumables: [
      { item: 'Vector / carrier', examples: 'Dual-AAV (Tet-On split) or IV OSK-mRNA exosomes' },
      { item: 'Inducer & kill-switch reagents', examples: 'Doxycycline (dox) inducer; HSV-TK/ganciclovir safety switch' },
    ],
    qcRelease: ['Vector identity/potency/copy number within spec', 'Sterility & endotoxin negative', 'Inducibility + kill-switch verified'],
    monitoring: ['Serum AFP / tumour markers pre & post each pulse', 'Imaging on a fixed schedule', 'Loss-of-identity marker surveillance', 'Long-term (years) oncologic follow-up'],
    adverse: ['Over-induction / tumorigenicity (the key unsolved barrier)', 'Loss of cell identity', 'Immune response to vector/cells', 'Systemic infusion reaction'],
    contraindications: ['Active or prior malignancy', 'Pregnancy', 'Any use outside an approved research protocol'],
    storage: 'Per vector/exosome specification with validated cold-chain.',
    governance: ['Pre-clinical only until IND/CTA approved', 'cGMP vector manufacture', 'Extended long-term follow-up mandated for reprogramming', 'IRB/ethics + regulator'],
    evidence: 'Investigational / pre-clinical. Tumorigenicity remains the central unsolved barrier for in-vivo reprogramming — figures are model estimates, not measured outcomes.',
    references: [{ label: 'Partial-reprogramming literature (OSK)', note: 'In-vivo partial reprogramming & epigenetic-age reversal — research stage.' }],
    detailed: true,
  },
];

// ── Coded catalogue (concise entries; detailed docs rolled out over time) ────
const S = (
  code: string, category: Category, name: string, indication: string,
  status: Status, cellSource: string, route: string, mechanism: string, aka?: string,
): Protocol => ({ code, category, name, indication, status, cellSource, route, mechanism, aka, detailed: false });

const CATALOGUE: Protocol[] = [
  // CT — Cell Therapies (immune reset / effector / transplant)
  S('CT-02', 'CT', 'Autologous HSCT — Systemic Sclerosis', 'Severe progressive systemic sclerosis (scleroderma).', 'established', 'Autologous CD34⁺ HPC', 'IV after conditioning', 'Immune reset via immunoablation + autologous reconstitution.'),
  S('CT-03', 'CT', 'MSC Immunomodulation — Rheumatoid Arthritis', 'Refractory rheumatoid arthritis.', 'investigational', 'Allogeneic/autologous MSC', 'IV infusion', 'Paracrine immunomodulation / T-reg shift.'),
  S('CT-04', 'CT', 'MSC Immunomodulation — Systemic Lupus (SLE)', 'Refractory SLE.', 'investigational', 'Umbilical-cord / BM MSC', 'IV infusion', 'Immunomodulation, regulatory-cell induction.'),
  S('CT-05', 'CT', 'MSC — Crohn’s Perianal Fistula', 'Complex perianal fistulising Crohn’s disease.', 'established', 'Allogeneic adipose MSC', 'Local injection', 'Local immunomodulation & fistula-tract healing.', 'darvadstrocel-class'),
  S('CT-06', 'CT', 'MSC — Steroid-refractory acute GvHD', 'Acute graft-versus-host disease refractory to steroids.', 'established', 'Allogeneic BM-MSC', 'IV infusion', 'Immunosuppressive paracrine modulation.'),
  S('CT-07', 'CT', 'CAR-T — B-cell malignancy', 'Relapsed/refractory CD19⁺ B-cell malignancies.', 'established', 'Autologous gene-modified T-cells', 'IV infusion', 'CD19-directed cytotoxic T-cell targeting.'),
  S('CT-08', 'CT', 'NK-cell Therapy', 'Selected malignancies / immune support.', 'investigational', 'Allogeneic/expanded NK cells', 'IV infusion', 'Innate cytotoxicity, MHC-independent killing.'),
  S('CT-09', 'CT', 'Regulatory T-cell (Treg) Therapy', 'Autoimmune tolerance / transplant.', 'investigational', 'Autologous expanded Tregs', 'IV infusion', 'Restore immune tolerance.'),
  S('CT-10', 'CT', 'Immune (Thymic) Rejuvenation', 'Immunosenescence / age-related immune decline.', 'investigational', 'Thymic/immune progenitor approach', 'IV infusion', 'Restore naïve T-cell output.'),
  S('CT-11', 'CT', 'MSC — Ankylosing Spondylitis', 'Refractory ankylosing spondylitis.', 'investigational', 'Allogeneic MSC', 'IV infusion', 'Immunomodulation of axial inflammation.'),
  S('CT-12', 'CT', 'aHSCT — Cord-blood CCR5-Δ32 (HIV)', 'HIV with haematologic malignancy needing transplant.', 'established', 'CCR5-Δ32 cord-blood/HSC', 'IV after conditioning', 'HIV-resistant immune reconstitution.'),

  // ST — Stem-cell Therapies (organ/tissue regeneration)
  S('ST-01', 'ST', 'Type 1 Diabetes — iPSC islet', 'Insulin-dependent type 1 diabetes.', 'investigational', 'iPSC-derived pancreatic islet cells', 'Portal / encapsulated implant', 'Replace β-cell mass; restore insulin secretion.'),
  S('ST-02', 'ST', 'Type 2 Diabetes — MSC', 'Poorly-controlled type 2 diabetes.', 'investigational', 'Umbilical-cord / BM MSC', 'IV infusion', 'Improve insulin sensitivity, β-cell support, anti-inflammatory.'),
  S('ST-03', 'ST', 'Chronic Kidney Disease — MSC', 'Progressive chronic kidney disease.', 'investigational', 'Allogeneic/autologous MSC', 'IV infusion', 'Anti-fibrotic, anti-inflammatory renal support.'),
  S('ST-04', 'ST', 'Acute Kidney Injury — MSC', 'Acute kidney injury / recovery support.', 'investigational', 'BM/UC MSC', 'IV infusion', 'Tubular repair support, immunomodulation.'),
  S('ST-05', 'ST', 'Liver Cirrhosis — MSC', 'Decompensated / progressive cirrhosis.', 'investigational', 'BM/UC MSC', 'IV / hepatic-artery', 'Anti-fibrotic, hepatocyte-support paracrine signalling.'),
  S('ST-06', 'ST', 'COPD / Lung — MSC', 'Chronic obstructive pulmonary disease.', 'investigational', 'Allogeneic MSC', 'IV / inhaled', 'Anti-inflammatory airway/alveolar support.'),
  S('ST-07', 'ST', 'Pulmonary Fibrosis (IPF) — MSC', 'Idiopathic pulmonary fibrosis.', 'investigational', 'BM/UC MSC', 'IV infusion', 'Anti-fibrotic paracrine modulation.'),
  S('ST-08', 'ST', 'Post-MI Cardiac Repair — MSC', 'Ischaemic cardiac injury after MI.', 'investigational', 'BM/cardiosphere-derived cells', 'Intracoronary / intramyocardial', 'Paracrine pro-angiogenic & anti-remodelling support.'),
  S('ST-09', 'ST', 'Heart Failure — MSC', 'Chronic heart failure (reduced EF).', 'investigational', 'Allogeneic MSC', 'Intramyocardial', 'Reduce fibrosis, support microvasculature.'),
  S('ST-10', 'ST', 'Stroke Recovery — MSC / NSC', 'Post-stroke neurological deficit.', 'investigational', 'MSC or neural stem cells', 'IV / intrathecal', 'Neuroprotection, plasticity, anti-inflammatory support.'),
  S('ST-11', 'ST', 'Spinal Cord Injury — NSC', 'Traumatic spinal cord injury.', 'investigational', 'iPSC/foetal-derived NSC', 'Intrathecal / intralesional', 'Neural relay/repair support.'),
  S('ST-12', 'ST', 'Parkinson’s — iPSC Dopaminergic', 'Parkinson’s disease.', 'investigational', 'iPSC-derived dopaminergic progenitors', 'Intraputaminal implant', 'Replace dopaminergic neurons.'),
  S('ST-13', 'ST', 'ALS / MND — MSC', 'Amyotrophic lateral sclerosis.', 'investigational', 'Autologous MSC (± NTF-secreting)', 'Intrathecal / IM', 'Neurotrophic support, neuroinflammation modulation.'),
  S('ST-15', 'ST', 'Cartilage Repair — MSC', 'Focal chondral / osteochondral defects.', 'established', 'Autologous MSC / chondrocytes', 'Surgical implant / IA', 'Support cartilage matrix repair.'),
  S('ST-16', 'ST', 'Bone / Non-union — MSC', 'Non-union fracture / bone defect.', 'established', 'Autologous BM-MSC ± scaffold', 'Local implant', 'Osteogenic support & bridging.'),
  S('ST-17', 'ST', 'Dental Pulp / Periodontal — MSC', 'Pulp regeneration / periodontal defects.', 'investigational', 'Dental-pulp / PDL MSC', 'Local implant', 'Odontogenic / periodontal regeneration.'),
  S('ST-18', 'ST', 'Critical Limb Ischaemia — HSC/EPC', 'No-option critical limb ischaemia.', 'established', 'Autologous BM mononuclear / EPC', 'Intramuscular', 'Therapeutic angiogenesis.'),
  S('ST-19', 'ST', 'Systemic MSC Infusion — Longevity', 'Age-related decline / wellness (investigational).', 'investigational', 'Allogeneic MSC', 'IV infusion', 'Systemic anti-inflammatory / trophic support.'),

  // RMT — Regenerative Medicine Therapies (acellular / local repair)
  S('RMT-02', 'RMT', 'Hair Restoration — Exosomes', 'Androgenetic alopecia / hair thinning.', 'investigational', 'MSC-derived exosomes', 'Intradermal scalp', 'Follicular signalling / anti-inflammatory support.'),
  S('RMT-03', 'RMT', 'Wound Healing — MSC / Exosome / GF', 'Chronic or non-healing wounds, diabetic foot ulcers.', 'investigational', 'MSC, exosomes, growth factors', 'Topical / local', 'Pro-angiogenic, anti-inflammatory tissue repair.'),
  S('RMT-04', 'RMT', 'Liver Regeneration — Exosome', 'Liver-support / regeneration adjunct.', 'investigational', 'MSC-derived exosomes', 'IV infusion', 'Hepatocyte-support paracrine cargo.'),
  S('RMT-05', 'RMT', 'Tendon / Ligament — PRP-MSC', 'Tendinopathy / ligament injury.', 'established', 'Platelet-rich plasma ± MSC', 'Local injection', 'Growth-factor-driven repair.'),
  S('RMT-06', 'RMT', 'Diabetic Kidney — Exosome', 'Diabetic kidney disease adjunct.', 'investigational', 'MSC-derived exosomes', 'IV infusion', 'Anti-fibrotic renal paracrine support.'),
  S('RMT-07', 'RMT', 'Facial Fat Grafting + SVF', 'Volume restoration / dermal regeneration.', 'established', 'Autologous fat + stromal vascular fraction', 'Local injection', 'Adipose graft + regenerative SVF support.'),
  S('RMT-08', 'RMT', 'Scaffold / Tissue Engineering', 'Structural tissue defects.', 'investigational', 'Biomaterial scaffold ± cells', 'Surgical implant', 'Structural template for guided regeneration.'),

  // GT — Gene & Epigenetic Therapies
  S('GT-02', 'GT', 'Persona Reversal — Renal OSK', 'Kidney-targeted epigenetic reprogramming (research).', 'investigational', 'AAV/exosome OSK, renal-targeted', 'IV infusion', 'Transient partial reprogramming of renal tissue.'),
  S('GT-03', 'GT', 'CCR5-Δ32 Gene-edited HSC (HIV)', 'HIV — durable resistance.', 'investigational', 'Gene-edited autologous HSC', 'IV after conditioning', 'Disrupt CCR5 co-receptor → HIV-resistant immune cells.'),
  S('GT-04', 'GT', 'Micro-dystrophin AAV — Muscular Dystrophy', 'Duchenne/Becker muscular dystrophy.', 'investigational', 'AAV micro-dystrophin', 'IV infusion', 'Deliver a functional shortened dystrophin gene.'),
  S('GT-05', 'GT', 'DUX4 RNAi Silencing — FSHD', 'Facioscapulohumeral muscular dystrophy.', 'investigational', 'AAV-RNAi', 'IV / IM', 'Silence the toxic DUX4 gene (mechanism-correct).'),
  S('GT-06', 'GT', 'Alzheimer’s — Neural Reprogramming', 'Alzheimer’s disease (research).', 'investigational', 'In-vivo neural reprogramming', 'Intrathecal / systemic', 'Reprogram/support neuronal populations (research stage).'),
];

export const PROTOCOLS: Protocol[] = [...EXEMPLARS, ...CATALOGUE].sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true }));

export const byCategory = (c: Category) => PROTOCOLS.filter((p) => p.category === c);
export const byCode = (code: string) => PROTOCOLS.find((p) => p.code.toLowerCase() === code.toLowerCase());
