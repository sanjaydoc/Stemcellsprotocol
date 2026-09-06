// Compose a complete 7-step run payload (PDF/summary shape) from the browser
// pipeline + construct + safety. Keys are snake_case to match export.py / pdf.ts.
import { predict, parseMethylation, discoverTargets, projectRejuvenation, tumorSafety } from './pipeline';
import { assembleOSK, safetyPrescreen } from './construct';
import { immuneSafety } from './immune';
import type { DiseaseEntry } from './catalog';

export interface FullRun {
  ok: boolean; error?: string;
  disease: { name: string; department: string; tissue: string; capsid: string; route: string };
  sample: string;
  chronological_age: number | null;
  coverage_pct: number;
  tissue_key: string;
  comorbidities: string[];
  epigenetic_age: any;
  targets: any[];
  rejuvenation: any;
  construct: any;
  safety: any;
  tumor: any;
  immune: any;
}

export function buildRun(text: string, opts: {
  disease: DiseaseEntry; sample?: string; chronologicalAge?: number | null; cycles?: number;
  comorbidities?: string[];
}): FullRun {
  const parse = parseMethylation(text);
  const dz = opts.disease;
  if (parse.matched === 0) {
    return { ok: false, error: 'No Horvath clock CpGs found. Use an array beta CSV (Name,<beta> with cg IDs) or a bisulfite .cov/bedGraph.' } as any;
  }
  const cycles = Math.max(1, Math.min(Math.trunc(opts.cycles || 1), 10));
  const age = predict(parse.betas, opts.chronologicalAge ?? null);
  const targets = discoverTargets(age, parse.betas, 12);
  const rej = projectRejuvenation(age.dnamAge, age.coverage, dz.tissue_key, cycles);
  const construct = assembleOSK({ capsid: dz.capsid, tissueKey: dz.tissue_key });
  const safety = safetyPrescreen({ cycles, host: 'mouse', sensitivity: 0.9 });
  const tumor = tumorSafety({
    dnamAge: age.dnamAge, ageAcceleration: age.ageAcceleration, coverage: age.coverage,
    youthSetpoint: rej.youth_setpoint, efficiency: rej.efficiency, tissueKey: dz.tissue_key, cycles,
  });
  const comorbidities = opts.comorbidities || [];
  const immune = immuneSafety({
    tissueKey: dz.tissue_key, department: dz.department, ageAcceleration: age.ageAcceleration,
    coverage: age.coverage, cycles, comorbidities,
  });
  return {
    ok: true,
    disease: { name: dz.disease, department: dz.department, tissue: dz.tissue, capsid: dz.capsid, route: dz.route },
    sample: opts.sample || 'patient',
    chronological_age: opts.chronologicalAge ?? null,
    coverage_pct: Math.round(age.coverage * 100),
    tissue_key: dz.tissue_key,
    comorbidities,
    epigenetic_age: {
      clock: age.clock, dnam_age: Math.round(age.dnamAge * 100) / 100,
      chronological_age: age.chronologicalAge,
      age_acceleration: age.ageAcceleration != null ? Math.round(age.ageAcceleration * 100) / 100 : null,
      n_used: age.nUsed, n_total: age.nTotal, coverage: Math.round(age.coverage * 1000) / 1000,
    },
    targets, rejuvenation: rej, construct, safety, tumor, immune,
  };
}

export function summarizeRun(r: FullRun): string {
  const ea = r.epigenetic_age, rej = r.rejuvenation, t = r.tumor;
  const accel = ea.age_acceleration != null ? `${ea.age_acceleration >= 0 ? '+' : ''}${ea.age_acceleration} yr` : 'not provided';
  return [
    `StemCells Protocol simulator — on-device run for ${r.disease.name} (${r.disease.tissue}). Raw genome NOT uploaded.`,
    `Clock ${ea.clock}, coverage ${ea.n_used}/${ea.n_total} (${r.coverage_pct}%).`,
    `Biological (DNAm) age ${ea.dnam_age} yr; chronological ${ea.chronological_age ?? 'not provided'}; acceleration ${accel}.`,
    `Reprogramming (${rej.cycles} cycle): ${ea.dnam_age} → ${rej.projected_age} yr (−${rej.years_reversed} yr), rejuvenation index ${rej.tissue_rejuvenation_index}%.`,
    `Construct: ${r.construct.strategy}, ${r.construct.capsid_desc}.`,
    `Safety avatar lifts projected success ${r.safety.projected_success_without}% → ${r.safety.projected_success_with}%.`,
    `Tumorigenicity: ${t.risk_tier}, ~${Math.round(t.estimated_risk * 100)}% at ${t.requested_cycles} cycle(s); max safe ${t.max_safe_cycles}; proliferation ${t.tissue_proliferation_factor}× (${t.tissue_key}).`,
    r.immune ? `Immune & adverse-event envelope: overall ${r.immune.overall_tier}${r.immune.classes?.[0] ? `; leading = ${r.immune.classes[0].label} (${r.immune.classes[0].tier})` : ''}${r.immune.comorbidities?.length ? `; comorbidities: ${r.immune.comorbidities.join(', ')}` : ''}. Relative read (not a yes/no); a methylation file can't see HLA/clotting genes or the clinic.` : '',
    `Research/illustrative — projections are model estimates, not measured outcomes; not medical advice.`,
  ].filter(Boolean).join('\n');
}
