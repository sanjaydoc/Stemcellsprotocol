// StemCells Protocol — coded protocol registry (v0.2, draft).
//
// Every therapy on the site gets a coded protocol page with a step-by-step
// administration procedure + the products/consumables needed. Administration
// steps, consumables and dose ranges are derived from the delivery ROUTE and
// cell type (the standard, route-based SOP) — accurate and generic, marked
// validation-required — with 4 fully bespoke exemplars going deeper. Nothing
// here is a fixed instruction or medical advice; see standards.ts.
//
// Coding by primary modality:
//   CT  — Cell Therapies (immune reset / effector / transplant cells)
//   ST  — Stem-cell Therapies (organ/tissue regeneration & replacement)
//   RMT — Regenerative Medicine Therapies (acellular: exosomes, PRP, SVF, scaffolds)
//   GT  — Gene & Epigenetic Therapies (gene replacement/edit, OSK reprogramming, RNAi)

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
  code: string; category: Category; name: string; aka?: string;
  therapyKey?: string;     // slug(make + model) — links a site therapy to its protocol
  indication: string; status: Status; cellSource: string; mechanism: string;
  route?: string; dose?: string; schedule?: string; identity?: string;
  preScreen?: string[]; steps?: string[]; consumables?: Consumable[]; qcRelease?: string[];
  monitoring?: string[]; adverse?: string[]; contraindications?: string[]; storage?: string;
  governance?: string[]; evidence?: string; references?: Ref[]; detailed: boolean;
}

export const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// ── source therapy list (mirrors the site catalogue): [make, model, cellCat, source, route] ──
type Row = [string, string, string, string, string];
const THERAPIES: Row[] = [
  ['Age Rejuvenation', 'Persona Reversal Epigenetic Reprogramming', 'iPSC', 'Autologous', 'IV infusion'],
  ['Age Rejuvenation', 'Systemic MSC Infusion', 'MSC', 'Allogeneic', 'IV infusion'],
  ['Age Rejuvenation', 'Exosome IV Longevity', 'Exosome', 'Allogeneic', 'IV infusion'],
  ['Age Rejuvenation', 'NK Cell Immune Boost', 'Immune cell', 'Allogeneic', 'IV infusion'],
  ['Age Rejuvenation', 'Immune (Thymic) Rejuvenation', 'Immune cell', 'Autologous', 'IV infusion'],
  ['Age Rejuvenation', 'Senolytic + MSC Program', 'MSC', 'Allogeneic', 'IV infusion'],
  ['Diabetes', 'Type 1 Diabetes', 'iPSC', 'Allogeneic', 'IV infusion'],
  ['Diabetes', 'Type 2 Diabetes', 'MSC', 'Allogeneic', 'IV infusion'],
  ['HIV', 'CCR5-Δ32 Stem-Cell Transplant', 'HSC', 'Allogeneic', 'IV infusion'],
  ['HIV', 'Cord-Blood CCR5-Δ32 Transplant', 'HSC', 'Allogeneic', 'IV infusion'],
  ['HIV', 'CCR5 Gene-Edited HSC Therapy', 'HSC', 'Autologous', 'IV infusion'],
  ['HIV', 'Anti-HIV Gene Therapy in HSCs', 'HSC', 'Autologous', 'IV infusion'],
  ['HIV', 'CCR5-Disrupted CD4 T-cell Therapy', 'Immune cell', 'Autologous', 'IV infusion'],
  ['Autoimmune', 'Ankylosing Spondylitis', 'MSC', 'Allogeneic', 'IV infusion'],
  ['Autoimmune', 'Rheumatoid Arthritis', 'MSC', 'Allogeneic', 'IV infusion'],
  ['Autoimmune', 'Systemic Lupus Erythematosus (SLE)', 'MSC', 'Allogeneic', 'IV infusion'],
  ['Autoimmune', 'Psoriasis & Psoriatic Arthritis', 'MSC', 'Allogeneic', 'IV infusion'],
  ['Autoimmune', 'Systemic Sclerosis (Scleroderma)', 'HSC', 'Autologous', 'IV infusion'],
  ['Autoimmune', 'Sjögren’s Syndrome', 'MSC', 'Allogeneic', 'IV infusion'],
  ['Autoimmune', 'Hashimoto’s Thyroiditis', 'MSC', 'Allogeneic', 'IV infusion'],
  ['Autoimmune', 'Graves’ Disease', 'MSC', 'Allogeneic', 'IV infusion'],
  ['Autoimmune', 'Myasthenia Gravis', 'MSC', 'Allogeneic', 'IV infusion'],
  ['Autoimmune', 'Autoimmune Hepatitis', 'MSC', 'Allogeneic', 'IV infusion'],
  ['Autoimmune', 'Vasculitis', 'MSC', 'Allogeneic', 'IV infusion'],
  ['Autoimmune', 'Vitiligo', 'Exosome', 'Allogeneic', 'Local injection'],
  ['Autoimmune', 'Alopecia Areata', 'Exosome', 'Autologous', 'Local injection'],
  ['Autoimmune', 'Polymyositis & Dermatomyositis', 'MSC', 'Allogeneic', 'IV infusion'],
  ['Autoimmune', 'Behçet’s Disease', 'MSC', 'Allogeneic', 'IV infusion'],
  ['Dental', 'Dental Pulp Regeneration', 'MSC', 'Autologous', 'Local injection'],
  ['Dental', 'Periodontal Ligament Repair', 'MSC', 'Autologous', 'Local injection'],
  ['Dental', 'Alveolar Bone Regeneration', 'MSC', 'Autologous', 'Surgical implant'],
  ['Dental', 'Whole-Tooth Bioengineering', 'iPSC', 'Allogeneic', 'Surgical implant'],
  ['Orthopedics', 'Knee Osteoarthritis MSC Therapy', 'MSC', 'Autologous', 'Intra-articular'],
  ['Orthopedics', 'Cartilage Repair', 'MSC', 'Autologous', 'Intra-articular'],
  ['Orthopedics', 'Non-union Fracture Repair', 'MSC', 'Autologous', 'Surgical implant'],
  ['Orthopedics', 'Intervertebral Disc Regeneration', 'MSC', 'Autologous', 'Local injection'],
  ['Orthopedics', 'Tendon & Ligament PRP-MSC', 'PRP', 'Autologous', 'Local injection'],
  ['Cardiology', 'Post-MI Cardiac Repair', 'MSC', 'Autologous', 'Intracoronary'],
  ['Cardiology', 'Heart Failure MSC Therapy', 'MSC', 'Allogeneic', 'Intramyocardial'],
  ['Cardiology', 'Cardiosphere-derived Cell Therapy', 'MSC', 'Allogeneic', 'Intracoronary'],
  ['Cardiology', 'Critical Limb Ischaemia', 'HSC', 'Autologous', 'Intramuscular'],
  ['Gastroenterology', 'Crohn’s Perianal Fistula', 'MSC', 'Allogeneic', 'Local injection'],
  ['Gastroenterology', 'Gut GvHD MSC Therapy', 'MSC', 'Allogeneic', 'IV infusion'],
  ['Gastroenterology', 'Liver Cirrhosis MSC Therapy', 'MSC', 'Allogeneic', 'IV infusion'],
  ['Gastroenterology', 'Ulcerative Colitis MSC', 'MSC', 'Allogeneic', 'IV infusion'],
  ['Neurology', 'Multiple Sclerosis aHSCT', 'HSC', 'Autologous', 'IV infusion'],
  ['Neurology', 'Spinal Cord Injury NSC', 'iPSC', 'Allogeneic', 'Intrathecal'],
  ['Neurology', 'Stroke Recovery MSC', 'MSC', 'Allogeneic', 'IV infusion'],
  ['Neurology', 'Parkinson’s iPSC Dopaminergic', 'iPSC', 'Allogeneic', 'Surgical implant'],
  ['Neurology', 'ALS / MND MSC Therapy', 'MSC', 'Autologous', 'Intrathecal'],
  ['Neurology', 'Muscular Dystrophy', 'MSC', 'Allogeneic', 'IV infusion'],
  ['Neurology', 'FSHD (Facioscapulohumeral Dystrophy)', 'iPSC', 'Autologous', 'IV infusion'],
  ['Pulmonology', 'COPD MSC Therapy', 'MSC', 'Allogeneic', 'IV infusion'],
  ['Pulmonology', 'Pulmonary Fibrosis (IPF) MSC', 'MSC', 'Allogeneic', 'IV infusion'],
  ['Pulmonology', 'ARDS MSC Therapy', 'MSC', 'Allogeneic', 'IV infusion'],
  ['Pulmonology', 'Airway Epithelial Regeneration', 'iPSC', 'Autologous', 'Surgical implant'],
  ['Cosmetic', 'Facial Fat Grafting + SVF', 'MSC', 'Autologous', 'Local injection'],
  ['Cosmetic', 'Hair Restoration Exosome', 'Exosome', 'Autologous', 'Local injection'],
  ['Cosmetic', 'Skin Rejuvenation Exosomes', 'Exosome', 'Allogeneic', 'Topical'],
  ['Cosmetic', 'Scar & Wound MSC Therapy', 'MSC', 'Autologous', 'Local injection'],
  ['Nephrology', 'Chronic Kidney Disease (CKD) MSC Therapy', 'MSC', 'Allogeneic', 'IV infusion'],
  ['Nephrology', 'Acute Kidney Injury (AKI) MSC Therapy', 'MSC', 'Allogeneic', 'IV infusion'],
  ['Nephrology', 'Diabetic Kidney Disease Exosome Therapy', 'Exosome', 'Allogeneic', 'IV infusion'],
  ['Nephrology', 'Persona Reversal Renal Epigenetic Reprogramming', 'iPSC', 'Autologous', 'IV infusion'],
];

// ── missing therapies practised worldwide (not in the site catalogue) ──
// [category, name, indication, status, cellSource, route, mechanism]
type Extra = [Category, string, string, Status, string, string, string];
const EXTRA: Extra[] = [
  ['CT', 'CAR-T — B-cell Malignancy', 'Relapsed/refractory CD19⁺ B-cell leukaemia/lymphoma.', 'established', 'Autologous CD19-CAR T-cells', 'IV infusion', 'Gene-modified T-cells targeting CD19 for cytotoxic tumour clearance.'],
  ['CT', 'CAR-T — Multiple Myeloma (BCMA)', 'Relapsed/refractory multiple myeloma.', 'established', 'Autologous BCMA-CAR T-cells', 'IV infusion', 'BCMA-directed cytotoxic T-cell therapy.'],
  ['CT', 'Allogeneic HSCT — Leukaemia', 'Acute/chronic leukaemia & marrow-failure syndromes.', 'established', 'Allogeneic (matched) HSC', 'IV infusion', 'Replace the diseased marrow with a healthy donor immune/haematopoietic system.'],
  ['CT', 'Tumour-Infiltrating Lymphocyte (TIL) Therapy', 'Advanced melanoma & selected solid tumours.', 'established', 'Autologous expanded TILs', 'IV infusion', 'Expanded tumour-reactive T-cells re-infused after lymphodepletion.'],
  ['CT', 'Regulatory T-cell (Treg) Therapy', 'Autoimmune disease / transplant tolerance.', 'investigational', 'Autologous expanded Tregs', 'IV infusion', 'Restore immune tolerance.'],
  ['CT', 'Steroid-refractory acute GvHD — MSC', 'Acute graft-versus-host disease refractory to steroids.', 'established', 'Allogeneic BM-MSC', 'IV infusion', 'Immunosuppressive paracrine modulation.'],
  ['ST', 'Corneal Limbal Stem-Cell Therapy', 'Limbal stem-cell deficiency (ocular surface).', 'established', 'Autologous limbal epithelial stem cells', 'Surgical implant', 'Restore the corneal epithelium (e.g. Holoclar-class).'],
  ['ST', 'iPSC/ESC RPE — Macular Degeneration', 'Age-related macular degeneration / Stargardt.', 'investigational', 'iPSC/ESC-derived retinal pigment epithelium', 'Surgical implant', 'Replace degenerated RPE to preserve photoreceptors.'],
  ['ST', 'Islet Transplantation', 'Brittle type 1 diabetes with hypo-unawareness.', 'established', 'Donor pancreatic islets', 'Portal infusion', 'Restore endogenous insulin secretion.'],
  ['ST', 'Hepatocyte Transplantation', 'Metabolic liver disease / acute liver failure bridge.', 'investigational', 'Donor/iPSC-derived hepatocytes', 'Portal infusion', 'Provide functional hepatocyte mass.'],
  ['ST', 'Osteoarthritis — Hip / other joints MSC', 'Symptomatic osteoarthritis of the hip & other joints.', 'established', 'Autologous / allogeneic MSC', 'Intra-articular', 'Paracrine immunomodulation & chondroprotection.'],
  ['RMT', 'Cultured Epithelial Autograft — Burns', 'Extensive full-thickness burns.', 'established', 'Autologous cultured keratinocytes', 'Surgical implant', 'Restore epidermal barrier over burn wounds.'],
  ['RMT', 'Amniotic Membrane / Placental Therapy', 'Chronic wounds, ocular surface, tissue repair.', 'established', 'Amniotic membrane / placental allograft', 'Local application', 'Barrier + growth-factor-rich regenerative matrix.'],
  ['RMT', 'Diabetic Foot Ulcer — Cell/Exosome/GF', 'Non-healing diabetic foot ulcers.', 'investigational', 'MSC / exosome / growth factors', 'Topical / local', 'Pro-angiogenic, anti-inflammatory wound repair.'],
  ['RMT', 'Endometrial / Ovarian PRP Regeneration', 'Thin endometrium / diminished ovarian reserve (fertility).', 'investigational', 'Autologous platelet-rich plasma', 'Local injection', 'Growth-factor-driven tissue rejuvenation.'],
  ['GT', 'CRISPR Gene Therapy — Sickle Cell / β-Thalassaemia', 'Transfusion-dependent sickle cell disease / β-thalassaemia.', 'established', 'Autologous CRISPR-edited HSC', 'IV infusion', 'Edit BCL11A to reactivate fetal haemoglobin (e.g. exa-cel class).'],
  ['GT', 'Lentiviral Gene Therapy — β-Thalassaemia', 'Transfusion-dependent β-thalassaemia.', 'established', 'Autologous gene-added HSC', 'IV infusion', 'Add a functional β-globin gene (e.g. beti-cel class).'],
  ['GT', 'AAV Gene Therapy — SMA', 'Spinal muscular atrophy (paediatric).', 'established', 'AAV9-SMN1', 'IV infusion', 'Deliver a functional SMN1 gene (e.g. onasemnogene class).'],
  ['GT', 'AAV Gene Therapy — Inherited Retinal Dystrophy', 'RPE65-mediated inherited retinal dystrophy.', 'established', 'AAV2-RPE65', 'Subretinal', 'Restore the RPE65 gene in retinal cells (e.g. voretigene class).'],
  ['GT', 'AAV Gene Therapy — Haemophilia', 'Haemophilia A/B.', 'established', 'AAV factor VIII / IX', 'IV infusion', 'Deliver a clotting-factor gene for endogenous production.'],
  ['GT', 'Micro-dystrophin AAV — Muscular Dystrophy', 'Duchenne muscular dystrophy.', 'investigational', 'AAV micro-dystrophin', 'IV infusion', 'Deliver a functional shortened dystrophin gene.'],
];

// ── modality assignment for the site therapies ──
function assign(make: string, model: string, cat: string): Category {
  const m = model.toLowerCase();
  if (/persona reversal|epigenetic reprogramming/.test(m)) return 'GT';
  if (/gene-edited|gene therapy|gene-disrupted|ccr5-disrupted|fshd|dux4/.test(m)) return 'GT';
  if (cat === 'Exosome' || cat === 'PRP' || /\bsvf\b|fat grafting/.test(m)) return 'RMT';
  if (cat === 'HSC' || cat === 'Immune cell' || /transplant|ahsct|hsct/.test(m)) return 'CT';
  if (make === 'Autoimmune' || /crohn|colitis|gvhd|graft-versus/.test(m)) return 'CT';
  return 'ST';
}

const ESTABLISHED = /knee osteoarthritis|cartilage|non-union|critical limb|crohn|gvhd|multiple sclerosis ahsct|systemic sclerosis|dental pulp|alveolar bone|fat grafting|hair restoration|skin rejuvenation|tendon|transplant/i;

// ── route-based administration SOPs, consumables, dose ranges ──
const ROUTE_STEPS: Record<string, string[]> = {
  'IV infusion': [
    'Establish patent IV access and run a compatible carrier line (e.g. normal saline).',
    'Premedicate per protocol (e.g. antihistamine ± antipyretic) to reduce infusion reactions.',
    'Prepare/thaw the product per SOP; if cryopreserved, wash or dilute to remove DMSO where required and confirm post-thaw viability.',
    'Two-person product ↔ patient verification against the ISBT-128 label.',
    'Infuse slowly at first with continuous vitals; titrate rate to tolerance (cell products run without an in-line depth filter).',
    'Flush the line; observe for infusion, embolic or hypersensitivity reactions during and after.',
  ],
  'Local injection': [
    'Aseptic prep & drape of the target site; use imaging guidance where it improves accuracy.',
    'Reconstitute the product to the target concentration and volume.',
    'Inject into the correct tissue plane; aspirate to confirm no intravascular placement.',
    'Dress the site; short observation; give site-care instructions.',
  ],
  'Intra-articular': [
    'Aseptic prep & drape; optional ultrasound guidance to confirm intra-articular placement.',
    'Aspirate any joint effusion before injection.',
    'Inject the cell suspension into the joint space; avoid intravascular placement.',
    'Relative offloading 24–48 h; avoid NSAIDs per protocol; begin structured rehabilitation.',
  ],
  'Intrathecal': [
    'Consent covering post-LP headache and rare neurological risks; position and aseptic prep.',
    'Lumbar puncture at L3–L5; confirm free CSF flow.',
    'Instil the product slowly; remove the needle; flat bed-rest per protocol.',
    'Monitor for headache, meningism and any neurological change.',
  ],
  'Intracoronary': [
    'Cardiac catheterisation lab; arterial access and anticoagulation per protocol.',
    'Position the delivery catheter at the target coronary segment.',
    'Deliver the cell suspension in controlled boluses with coronary-flow monitoring.',
    'Achieve access-site haemostasis; cardiac-monitor for arrhythmia or microembolism.',
  ],
  'Intramyocardial': [
    'Electroanatomic-mapping-guided catheter (or surgical) delivery under imaging.',
    'Multiple small-volume injections into viable peri-infarct myocardium.',
    'Continuous rhythm monitoring; access-site care.',
  ],
  'Intramuscular': [
    'Aseptic prep of the target muscle group / ischaemic limb.',
    'Multiple depot injections distributed across the target tissue.',
    'Apply compression/dressing; monitor the sites.',
  ],
  'Surgical implant': [
    'Operating theatre, aseptic technique; prepare the defect / implant bed.',
    'Seat the cell (± scaffold) construct precisely into the prepared site.',
    'Closure; immobilisation / graduated-loading protocol; wound care.',
  ],
  'Topical': [
    'Cleanse and prep the treatment surface.',
    'Create controlled micro-channels if device-assisted (microneedling / fractional laser).',
    'Apply the product to the treated surface immediately.',
    'Post-care: barrier protection; avoid actives for 24–72 h.',
  ],
  'Portal infusion': [
    'Interventional-radiology / surgical portal-vein access under imaging.',
    'Infuse the cell preparation slowly with portal-pressure monitoring.',
    'Haemostasis at the access site; monitor for portal thrombosis.',
  ],
  'Subretinal': [
    'Theatre vitreoretinal setting under microscope; pars-plana vitrectomy as needed.',
    'Create a controlled subretinal bleb and deliver the product beneath the retina.',
    'Post-op positioning; intra-ocular pressure and retinal monitoring.',
  ],
  'Local application': [
    'Cleanse/debride the wound or surface as indicated.',
    'Apply the membrane/graft to the prepared bed; secure and dress.',
    'Scheduled dressing changes and wound review.',
  ],
};

const ROUTE_ADVERSE: Record<string, string[]> = {
  'IV infusion': ['Infusion reaction (fever/chills/flushing)', 'Pulmonary embolic / IBMIR clotting (dose-dependent)', 'Immune reaction / allo-sensitisation'],
  'Local injection': ['Injection-site pain/swelling', 'Local inflammatory flare', 'Rare local infection'],
  'Intra-articular': ['Transient joint pain/swelling/synovitis', 'Rare septic arthritis', 'Allo-sensitisation on repeat dosing'],
  'Intrathecal': ['Post-LP headache, back pain', 'Rare arachnoiditis / meningitis', 'Transient fever'],
  'Intracoronary': ['Arrhythmia during delivery', 'Coronary microembolism / troponin rise', 'Access-site bleeding'],
  'Intramyocardial': ['Arrhythmia', 'Myocardial injection injury', 'Access-site complications'],
  'Intramuscular': ['Injection-site pain/bruising', 'Local inflammation', 'Rare infection'],
  'Surgical implant': ['Surgical/anaesthetic risk', 'Graft failure / non-integration', 'Wound infection'],
  'Topical': ['Transient erythema/swelling', 'Rare hypersensitivity/infection'],
  'Portal infusion': ['Portal-vein thrombosis', 'Bleeding', 'Transient portal hypertension'],
  'Subretinal': ['Retinal detachment/tear', 'Endophthalmitis (rare)', 'Raised intra-ocular pressure'],
  'Local application': ['Local irritation', 'Rare hypersensitivity/infection'],
};

function doseFor(cat: string, route: string): string {
  if (cat === 'HSC') return 'Graft target ≥2 ×10⁶ CD34⁺ cells/kg (typical 2–8 ×10⁶/kg).';
  if (cat === 'Exosome') return 'Vendor-defined particle count per treatment (typ. ~10⁹–10¹¹ particles). No clinical consensus dose.';
  if (cat === 'PRP') return '~3–6 mL activated platelet-rich plasma per site.';
  if (cat === 'iPSC') return 'Product-specific differentiated-cell number per graft/dose (protocol-defined).';
  if (cat === 'Immune cell') return 'Product-specific effector-cell dose (e.g. per-kg or fixed) per protocol.';
  // MSC
  if (route === 'IV infusion') return 'Typical 1–2 ×10⁶ MSC/kg per infusion (published range 0.5–5 ×10⁶/kg).';
  if (route === 'Intra-articular' || route === 'Local injection') return 'Typical 1 ×10⁷ – 1 ×10⁸ MSC per site.';
  if (route === 'Intrathecal') return 'Typical 1 ×10⁶ – 1 ×10⁸ MSC per dose.';
  return 'Protocol-defined cell dose (typical published range) — validation required.';
}

function consumablesFor(cat: string, route: string): Consumable[] {
  const base: Consumable[] = [];
  if (route === 'IV infusion' || route === 'Portal infusion' || route === 'Intracoronary') {
    base.push({ item: 'IV/arterial access & carrier fluid', examples: 'Cannula/sheath, normal saline, non-filtered administration set' });
    base.push({ item: 'Premedication', examples: 'Antihistamine ± antipyretic per protocol' });
  }
  if (/injection|articular|intramuscular|intrathecal|subretinal|local/i.test(route)) {
    base.push({ item: 'Aseptic injection set', examples: 'Sterile drape, chlorhexidine/iodine prep, syringes & needles' });
  }
  if (route === 'Intra-articular' || route === 'Intramyocardial' || route === 'Subretinal') {
    base.push({ item: 'Image guidance', examples: 'Ultrasound / fluoroscopy / electroanatomic mapping / operating microscope' });
  }
  if (route === 'Surgical implant') base.push({ item: 'Theatre & surgical set', examples: 'Sterile field, implantation instruments, ± scaffold' });
  if (route === 'Topical') base.push({ item: 'Delivery device', examples: 'Microneedling pen / fractional laser, sterile tips' });
  if (cat === 'HSC') base.push({ item: 'Collection & cryostorage', examples: 'Apheresis kit (ACD-A), DMSO, EVA cryobags, controlled-rate freezer, vapour-phase LN₂' });
  if (cat === 'Exosome') base.push({ item: 'EV product', examples: 'GMP-characterised exosome vial + reconstitution diluent' });
  base.push({ item: 'Cell/gene product', examples: `${cat} product, GMP batch with release certificate` });
  return base;
}

function mechanismFor(category: Category, cat: string): string {
  if (category === 'CT') return 'Immune modulation / immune reset (or effector-cell targeting) via cellular therapy.';
  if (category === 'GT') return 'Genetic / epigenetic modification of target cells.';
  if (category === 'RMT') return 'Acellular regenerative signalling — paracrine, pro-repair and anti-inflammatory.';
  if (cat === 'iPSC') return 'iPSC-derived cell replacement / regeneration of the target tissue.';
  return 'Stem/progenitor-cell–mediated tissue regeneration and paracrine repair.';
}

// ── bespoke exemplar overlays (keyed by therapyKey) ──
const OVERLAY: Record<string, Partial<Protocol>> = {
  [slug('Neurology Multiple Sclerosis aHSCT')]: {
    aka: 'aHSCT / AHSCT', detailed: true, status: 'established',
    mechanism: 'Immunoablative conditioning removes the autoreactive immune repertoire; reinfused HPCs reconstitute a naïve, self-tolerant immune system ("immune reset").',
    dose: 'Graft target ≥2 ×10⁶ CD34⁺/kg (≥5 ×10⁶/kg preferred). Typical 2–8 ×10⁶ CD34⁺/kg.',
    schedule: 'Single episode: mobilisation → apheresis → conditioning (~5–7 days) → reinfusion (day 0) → engraftment (~10–14 days).',
    preScreen: ['Neurology + transplant MDT confirmation of highly-active MS and DMT failure.', 'Cardiac/pulmonary/renal/hepatic assessment; infection screen (HIV/HBV/HCV/CMV/EBV).', 'Fertility counselling — conditioning is gonadotoxic.'],
    steps: ['Mobilise: cyclophosphamide ~2 g/m² + G-CSF until apheresis.', 'Leukapheresis; enumerate CD34⁺; cryopreserve to target.', 'Condition (e.g. Cy 200 mg/kg + ATG, or BEAM+ATG) per programme.', 'Reinfuse the thawed autograft IV (day 0) with premedication.', 'Supportive care through aplasia; confirm engraftment; discharge on follow-up.'],
    monitoring: ['Daily CBC/vitals through aplasia', 'Infection & mucositis surveillance', 'EDSS/MRI at 6–12 months then annually', 'Long-term follow-up ≥5 years'],
    evidence: 'Established for highly-active RRMS — RCT (MIST) + large EBMT registry series.',
    references: [{ label: 'MIST RCT (JAMA 2019)', note: 'aHSCT vs DMT in relapsing MS.' }, { label: 'EBMT / FACT-JACIE', note: 'Programme accreditation & administration.' }],
  },
  [slug('Orthopedics Knee Osteoarthritis MSC Therapy')]: {
    aka: 'IA-MSC', detailed: true, status: 'established',
    mechanism: 'Paracrine immunomodulation + trophic support: reduces synovial inflammation and supports chondral maintenance (chondroprotective).',
    dose: 'Typical 1 ×10⁷ – 1 ×10⁸ cells per knee (commonly ~2.5–5 ×10⁷).',
    schedule: 'Single injection; some protocols repeat at 6–12 months. Assess at 6 & 12 months.',
    monitoring: ['Post-injection flare check at 24–72 h', 'VAS/WOMAC/KOOS at 6 & 12 months', 'Imaging at 12 months if indicated'],
    evidence: 'Widely practised; multiple RCTs show symptom/function benefit — structural disease-modification unproven.',
    references: [{ label: 'ISCT MSC criteria', note: 'Identity.' }, { label: 'IA-MSC RCTs / meta-analyses', note: 'Outcomes & dose ranges.' }],
  },
  [slug('Cosmetic Skin Rejuvenation Exosomes')]: {
    aka: 'EV skin therapy', detailed: true,
    mechanism: 'Cell-free paracrine signalling: pro-angiogenic, anti-inflammatory and matrix-remodelling cargo delivered in extracellular vesicles.',
    schedule: 'Course of ~3 sessions at 2–4 week intervals is commonly used; evidence base is early.',
    identity: 'EV characterisation: size (NTA), tetraspanins (CD9/CD63/CD81), particle count, purity, sterility & endotoxin.',
    evidence: 'Investigational / early evidence; commonly offered cosmetically — clinical efficacy not established.',
    references: [{ label: 'MISEV EV guidelines', note: 'EV characterisation standard.' }],
  },
  [slug('Age Rejuvenation Persona Reversal Epigenetic Reprogramming')]: {
    aka: 'Partial reprogramming', detailed: true,
    mechanism: 'Brief, controlled partial reprogramming (transient OSK) resets age-associated epigenetic marks toward a younger state without loss of cell identity — pulsed, never continuous.',
    dose: 'Research-stage — no established human dose. Modelled as pulsed cycles with a per-patient tumorigenicity safety envelope (see Simulator).',
    schedule: 'Transient "dox-on" pulses (e.g. 3–5 days) with washout and re-measurement; stop at the youth setpoint.',
    steps: ['Run the Protocol Simulator for a per-patient safe dosing envelope.', 'Avatar pre-screen before any patient dosing.', 'Administer one transient, inducible pulse.', 'Re-methylate & re-run the clock; assess safety markers before any further pulse.', 'Escalate only within the modelled envelope; abort via kill-switch on any danger signal.'],
    monitoring: ['Serum AFP / tumour markers pre & post each pulse', 'Imaging on a fixed schedule', 'Loss-of-identity marker surveillance', 'Long-term (years) oncologic follow-up'],
    evidence: 'Investigational / pre-clinical. Tumorigenicity remains the central unsolved barrier — figures are model estimates, not measured outcomes.',
    references: [{ label: 'Partial-reprogramming literature (OSK)', note: 'In-vivo partial reprogramming & epigenetic-age reversal — research stage.' }],
  },
};

// ── per-therapy disease-specific layer (indication, mechanism, screening,
//    monitoring, evidence, references) so every protocol reads as complete.
//    Screening/monitoring use disease-standard clinical measures (real domain
//    knowledge, not invented drug absolutes). Keyed by slug(model/name). ──
const R_ISCT: Ref = { label: 'ISCT MSC criteria', note: 'Cell identity & potency standard.' };
const R_FACT: Ref = { label: 'FACT-JACIE', note: 'Cellular-therapy programme standards.' };
const d = (indication: string, mechanism: string, preScreen: string[], monitoring: string[], evidence: string, references: Ref[] = [R_ISCT]): Partial<Protocol> =>
  ({ indication, mechanism, preScreen, monitoring, evidence, references, detailed: true });

// autoimmune MSC immunomodulation share a screening/monitoring pattern
const auto = (name: string, dx: string, index: string, refractory = 'standard immunosuppression', refs: Ref[] = [R_ISCT]): Partial<Protocol> =>
  d(
    `${name} refractory to ${refractory} — immunomodulatory cell therapy adjunct.`,
    `Paracrine immunomodulation and regulatory-cell shift to dampen the autoimmune process in ${dx}.`,
    [`Confirm diagnosis & activity (${index}); document refractoriness to ${refractory}.`, 'Immunosuppressant washout per protocol; infection screen (HIV/HBV/HCV/TB).', 'Baseline organ-function panel & the disease-specific activity index.'],
    [`${index} at 3, 6 & 12 months`, 'Flare & infection surveillance', 'Durability / re-dosing assessment; anti-HLA on repeat allogeneic dosing'],
    'Investigational — clinical studies ongoing; used within research/expanded-access settings.',
    refs,
  );

const DETAILS: Record<string, Partial<Protocol>> = {
  // Age Rejuvenation
  [slug('Systemic MSC Infusion')]: d('Age-related decline / systemic wellness (investigational).', 'Systemic anti-inflammatory & trophic paracrine support ("inflammaging" modulation).', ['Comprehensive health & comorbidity review; exclude active malignancy/infection.', 'Baseline inflammatory & metabolic panel; consider epigenetic-age (Simulator).', 'Informed consent on investigational status.'], ['Inflammatory markers & functional measures at 3–6 months', 'Infusion-reaction & embolic surveillance', 'Epigenetic-age re-test at follow-up'], 'Investigational / wellness-adjacent; systemic efficacy not established.'),
  [slug('Exosome IV Longevity')]: d('Systemic longevity / anti-inflammatory support (investigational).', 'Cell-free regenerative EV cargo — anti-inflammatory, pro-repair paracrine signalling.', ['Health review; exclude active infection/malignancy.', 'Baseline inflammatory panel.', 'Consent on investigational, non-approved status.'], ['Symptom/biomarker review at 4–12 weeks', 'Hypersensitivity/infusion-reaction watch'], 'Investigational; systemic clinical benefit unproven.', [{ label: 'MISEV EV guidelines', note: 'EV characterisation.' }]),
  [slug('NK Cell Immune Boost')]: d('Immune support / selected malignancy adjunct (investigational).', 'Innate NK-cell cytotoxicity — MHC-independent targeting of stressed/abnormal cells.', ['Confirm indication & prior therapy; infection & CMV screen.', 'HLA/KIR considerations for allogeneic NK.', 'Baseline haematology.'], ['CBC & cytokine-release watch', 'Response assessment per indication', 'Infection surveillance'], 'Investigational for most non-oncology uses; oncology use within trials.', [R_FACT]),
  [slug('Immune (Thymic) Rejuvenation')]: d('Immunosenescence / age-related immune decline (investigational).', 'Restore naïve T-cell output / thymic function to counter immunosenescence.', ['Immune-age assessment (naïve/memory T-cell subsets).', 'Exclude active infection/malignancy.', 'Baseline immunophenotyping.'], ['T-cell repertoire / naïve-cell fraction at follow-up', 'Vaccine-response as functional readout', 'Autoimmunity surveillance'], 'Investigational / early research.'),
  [slug('Senolytic + MSC Program')]: d('Age-related decline with senescent-cell burden (investigational).', 'Senolytic clearance of senescent cells + MSC paracrine tissue support.', ['Comorbidity review; exclude active malignancy/infection.', 'Baseline senescence-associated & inflammatory markers where available.', 'Medication-interaction review for the senolytic.'], ['Inflammatory/senescence markers at follow-up', 'Senolytic-specific tolerability (transient GI/fatigue)', 'Functional measures'], 'Investigational; senolytic + MSC combinations are in early study.'),
  // Diabetes
  [slug('Type 1 Diabetes')]: d('Insulin-dependent type 1 diabetes — β-cell replacement (investigational).', 'iPSC-derived islet/β-cells restore regulated insulin secretion.', ['Confirm T1D (C-peptide low, autoantibodies); assess hypo-unawareness.', 'Immunosuppression plan (or encapsulation strategy); infection screen.', 'Baseline HbA1c, C-peptide, CGM.'], ['HbA1c, C-peptide & insulin requirement', 'CGM time-in-range', 'Graft function & immunosuppression tolerance'], 'Investigational — iPSC-islet programmes in early clinical trials.', [{ label: 'iPSC-islet trials', note: 'Early-phase β-cell replacement.' }]),
  [slug('Type 2 Diabetes')]: d('Poorly-controlled type 2 diabetes — metabolic/immunomodulatory adjunct.', 'MSC paracrine effects: improved insulin sensitivity, β-cell support, anti-inflammatory.', ['Confirm T2D control status (HbA1c) & complications.', 'Exclude active infection; renal/cardiac review before IV.', 'Baseline HbA1c, C-peptide, lipid & inflammatory panel.'], ['HbA1c & fasting glucose at 3, 6 months', 'Insulin/oral-agent requirement', 'Renal & inflammatory markers'], 'Investigational — MSC studies show variable metabolic benefit.'),
  // HIV
  [slug('CCR5-Δ32 Stem-Cell Transplant')]: d('HIV with a haematologic malignancy requiring transplant.', 'CCR5-Δ32 donor graft reconstitutes an HIV-resistant immune system.', ['Transplant indication (malignancy) + HIV control (viral load/CD4).', 'Donor CCR5-Δ32 homozygosity & HLA match; conditioning workup.', 'Infection & organ-reserve screen.'], ['Chimerism & CD4 recovery', 'HIV reservoir/viral-load monitoring', 'GvHD & infection surveillance'], 'Established as transplant; HIV-cure benefit is exceptional/selected cases.', [R_FACT]),
  [slug('Cord-Blood CCR5-Δ32 Transplant')]: d('HIV with malignancy — cord-blood CCR5-Δ32 source.', 'Cord-blood CCR5-Δ32 graft gives HIV-resistant reconstitution with lower HLA-match stringency.', ['Transplant indication + HIV status.', 'Cord unit selection (CCR5-Δ32, cell dose, HLA).', 'Conditioning & infection workup.'], ['Engraftment & chimerism', 'HIV reservoir monitoring', 'GvHD/infection surveillance'], 'Established as transplant; cure cases reported.', [R_FACT]),
  [slug('CCR5 Gene-Edited HSC Therapy')]: d('HIV — durable resistance via autologous gene editing.', 'Ex-vivo CCR5 disruption in autologous HSC removes the HIV co-receptor.', ['HIV control & CD4; mobilisation feasibility.', 'Editing QC (on/off-target, disruption efficiency).', 'Conditioning workup.'], ['Edited-cell persistence & chimerism', 'HIV reservoir / analytical treatment interruption per trial', 'Off-target surveillance'], 'Investigational — gene-edited HSC trials ongoing.', [R_FACT]),
  [slug('Anti-HIV Gene Therapy in HSCs')]: d('HIV — HSC-delivered anti-HIV genetic strategy.', 'Add anti-HIV genetic elements to autologous HSC for a protected immune system.', ['HIV & haematology workup.', 'Vector/construct QC.', 'Conditioning workup.'], ['Gene-marking persistence', 'HIV control markers', 'Vector-safety surveillance'], 'Investigational.', [R_FACT]),
  [slug('CCR5-Disrupted CD4 T-cell Therapy')]: d('HIV — CCR5-disrupted autologous CD4 T-cells.', 'Gene-edit CD4 T-cells to resist HIV entry, expanding a protected T-cell pool.', ['HIV control & CD4 count.', 'Editing QC.', 'Leukapheresis feasibility.'], ['Edited CD4 persistence', 'Viral-load control', 'Off-target surveillance'], 'Investigational.'),
  // Autoimmune (MSC immunomodulation)
  [slug('Ankylosing Spondylitis')]: auto('Ankylosing spondylitis', 'axial spondyloarthritis', 'BASDAI / ASDAS', 'NSAIDs + biologics'),
  [slug('Rheumatoid Arthritis')]: auto('Rheumatoid arthritis', 'RA', 'DAS28 (+ RF/anti-CCP)', 'DMARDs/biologics'),
  [slug('Systemic Lupus Erythematosus (SLE)')]: auto('SLE', 'SLE', 'SLEDAI (+ dsDNA/complement)', 'standard immunosuppression'),
  [slug('Psoriasis & Psoriatic Arthritis')]: auto('Psoriasis / psoriatic arthritis', 'psoriatic disease', 'PASI / DAPSA', 'systemics/biologics'),
  [slug('Systemic Sclerosis (Scleroderma)')]: d('Severe progressive systemic sclerosis.', 'Autologous HSCT immune reset halts fibrotic autoimmune progression.', ['Confirm rapidly-progressive dcSSc; cardiac/pulmonary screen (critical for eligibility).', 'mRSS, PFTs (FVC/DLCO), ECHO/RHC; infection screen.', 'Transplant MDT + fertility counselling.'], ['mRSS & skin score', 'PFTs (FVC/DLCO) & cardiac function', 'Long-term follow-up ≥5 years'], 'Established for selected severe dcSSc (ASTIS/SCOT RCTs).', [R_FACT, { label: 'ASTIS / SCOT RCTs', note: 'aHSCT in systemic sclerosis.' }]),
  [slug('Sjögren’s Syndrome')]: auto('Sjögren’s syndrome', 'Sjögren’s', 'ESSDAI (+ Schirmer)'),
  [slug('Hashimoto’s Thyroiditis')]: auto('Hashimoto’s thyroiditis', 'autoimmune hypothyroidism', 'TSH / anti-TPO'),
  [slug('Graves’ Disease')]: auto('Graves’ disease', 'autoimmune hyperthyroidism', 'TSH / TRAb'),
  [slug('Myasthenia Gravis')]: auto('Myasthenia gravis', 'MG', 'QMG score (+ AChR-Ab)'),
  [slug('Autoimmune Hepatitis')]: auto('Autoimmune hepatitis', 'AIH', 'LFTs / IgG / autoantibodies'),
  [slug('Vasculitis')]: auto('Systemic vasculitis', 'vasculitis', 'BVAS (+ ANCA/CRP)'),
  [slug('Polymyositis & Dermatomyositis')]: auto('Polymyositis / dermatomyositis', 'idiopathic inflammatory myopathy', 'CK / MMT-8'),
  [slug('Behçet’s Disease')]: auto('Behçet’s disease', 'Behçet’s', 'disease-activity form (BDCAF)'),
  [slug('Vitiligo')]: d('Vitiligo — repigmentation adjunct (investigational).', 'Exosome paracrine signalling supports melanocyte survival/repigmentation.', ['Confirm stability/activity of vitiligo.', 'Exclude active skin infection at site.', 'Baseline photography / VASI.'], ['VASI / repigmentation photography at 4–12 weeks', 'Local reaction watch'], 'Investigational.', [{ label: 'EV dermatology studies', note: 'Early evidence.' }]),
  [slug('Alopecia Areata')]: d('Alopecia areata — hair-regrowth adjunct (investigational).', 'Exosome follicular signalling + immunomodulation to support regrowth.', ['Confirm AA extent (SALT).', 'Exclude scalp infection.', 'Baseline photography.'], ['SALT / regrowth photography', 'Local reaction watch'], 'Investigational.'),
  // Dental
  [slug('Dental Pulp Regeneration')]: d('Necrotic/immature pulp — regenerative endodontics.', 'Dental-pulp MSC support odontogenic pulp regeneration.', ['Confirm pulp status & apical anatomy; radiograph.', 'Disinfect the canal per regenerative-endodontics protocol.', 'Vitality baseline.'], ['Radiographic root development & apical healing', 'Pulp-vitality response', 'Symptom resolution'], 'Established regenerative-endodontics approaches exist; cell-based is emerging.'),
  [slug('Periodontal Ligament Repair')]: d('Periodontal defects — PDL regeneration.', 'PDL/gingival MSC support periodontal attachment regeneration.', ['Periodontal charting & radiograph; control active periodontitis.', 'Site preparation & infection control.', 'Baseline attachment level.'], ['Clinical attachment level & pocket depth', 'Radiographic bone fill', 'Maintenance review'], 'Investigational / emerging.'),
  [slug('Alveolar Bone Regeneration')]: d('Alveolar bone defects / augmentation.', 'MSC ± scaffold osteogenic support for bone regeneration.', ['CBCT defect assessment; infection control.', 'Graft/scaffold selection.', 'Occlusal/loading plan.'], ['Radiographic bone fill (CBCT)', 'Implant stability if placed', 'Wound healing'], 'Established grafting; cell-augmented is emerging.'),
  [slug('Whole-Tooth Bioengineering')]: d('Tooth loss — bioengineered whole-tooth (research).', 'iPSC-derived tooth germ / bioengineered tooth organ (pre-clinical).', ['Site & anatomy assessment.', 'Research-protocol eligibility.', 'Baseline imaging.'], ['Eruption/integration imaging', 'Function & occlusion', 'Long-term follow-up'], 'Pre-clinical / research stage.'),
  // Orthopedics
  [slug('Cartilage Repair')]: d('Focal chondral / osteochondral defects.', 'MSC / chondrocytes support hyaline-like cartilage repair.', ['MRI defect grading (ICRS); exclude malalignment/instability.', 'Address mechanical factors first.', 'Baseline KOOS/IKDC.'], ['MRI cartilage fill (MOCART) at 12 months', 'KOOS/IKDC function', 'Return-to-activity milestones'], 'Established (ACI/MACI-class); MSC approaches practised.', [R_ISCT, { label: 'ACI/MACI evidence', note: 'Cartilage repair outcomes.' }]),
  [slug('Non-union Fracture Repair')]: d('Fracture non-union / bone defect.', 'BM-MSC ± scaffold provide osteogenic bridging.', ['Confirm non-union (imaging); assess stability/vascularity.', 'Ensure mechanical fixation adequate.', 'Rule out infection (infected non-union).'], ['Radiographic union', 'Weight-bearing progression', 'Functional recovery'], 'Established adjunct in orthopaedics.'),
  [slug('Intervertebral Disc Regeneration')]: d('Discogenic low-back pain / early disc degeneration.', 'MSC paracrine support of the nucleus pulposus matrix.', ['Confirm discogenic source (MRI Pfirrmann; exclude instability/herniation needing surgery).', 'Baseline pain/ODI.', 'Image-guided approach planning.'], ['Pain (VAS) & ODI at 6–12 months', 'MRI disc-signal changes', 'Function'], 'Investigational.'),
  [slug('Tendon & Ligament PRP-MSC')]: d('Tendinopathy / ligament injury.', 'Platelet-rich plasma growth factors (± MSC) drive tendon/ligament repair.', ['Confirm lesion (ultrasound/MRI); exclude complete tear needing surgery.', 'Aseptic, image-guided injection planning; NSAID washout per protocol.', 'Baseline pain/function (VISA).'], ['Pain & function (VISA) at 6–12 weeks', 'Ultrasound tendon structure', 'Return-to-activity milestones'], 'Practised; PRP evidence variable by indication.', [{ label: 'PRP tendinopathy trials', note: 'Variable outcomes by site.' }]),
  [slug('Diabetic Kidney Disease Exosome Therapy')]: d('Diabetic kidney disease — regenerative adjunct.', 'MSC-derived exosome anti-fibrotic, anti-inflammatory renal paracrine support (cell-free).', ['Confirm DKD (eGFR/ACR) & glycaemic control; exclude non-diabetic cause.', 'Fluid-status review before IV.', 'Baseline eGFR, albuminuria, HbA1c.'], ['eGFR slope & albuminuria', 'Glycaemic & BP control', 'Progression / dialysis-free interval'], 'Investigational — early exosome renal studies.', [{ label: 'MISEV EV guidelines', note: 'EV characterisation.' }]),
  // Cardiology
  [slug('Post-MI Cardiac Repair')]: d('Ischaemic injury after myocardial infarction.', 'Paracrine pro-angiogenic & anti-remodelling support of peri-infarct myocardium.', ['Confirm territory & viability (ECHO/MRI); optimise guideline medical therapy.', 'Cath-lab readiness; anticoagulation plan.', 'Baseline LVEF & NT-proBNP.'], ['LVEF & remodelling (ECHO/MRI)', 'NT-proBNP & 6-minute walk', 'Arrhythmia surveillance'], 'Investigational — mixed RCT results.', [{ label: 'Cardiac cell-therapy RCTs', note: 'Variable LVEF effect.' }]),
  [slug('Heart Failure MSC Therapy')]: d('Chronic heart failure with reduced ejection fraction.', 'MSC reduce fibrosis and support microvasculature (paracrine).', ['Confirm HFrEF on optimal therapy; viability assessment.', 'Delivery planning (intramyocardial mapping).', 'Baseline LVEF, NT-proBNP, 6MWT.'], ['LVEF, NT-proBNP, 6MWT', 'NYHA class & HF events', 'Arrhythmia surveillance'], 'Investigational (e.g. DREAM-HF-class studies).'),
  [slug('Cardiosphere-derived Cell Therapy')]: d('Ischaemic / non-ischaemic cardiomyopathy.', 'Cardiosphere-derived cells exert paracrine reparative/immunomodulatory effects.', ['Confirm indication & viability.', 'Intracoronary delivery planning.', 'Baseline cardiac function.'], ['Cardiac MRI scar/function', 'NT-proBNP & symptoms', 'Arrhythmia watch'], 'Investigational.'),
  [slug('Critical Limb Ischaemia')]: d('No-option critical limb ischaemia.', 'Autologous BM-MNC/EPC drive therapeutic angiogenesis in the ischaemic limb.', ['Confirm CLI (ABI/TBI, imaging); exclude proliferative retinopathy (angiogenesis caution).', 'Wound/infection assessment.', 'Baseline pain, TcPO₂, ulcer status.'], ['Amputation-free survival', 'ABI/TcPO₂ & wound healing', 'Rest-pain relief'], 'Established adjunct in no-option CLI.'),
  // Gastroenterology
  [slug('Crohn’s Perianal Fistula')]: d('Complex perianal fistulising Crohn’s disease.', 'Local MSC immunomodulation promotes fistula-tract healing.', ['MRI fistula mapping; control luminal Crohn’s & sepsis (seton/drainage first).', 'Exam under anaesthesia planning.', 'Baseline PDAI / fistula count.'], ['Fistula closure (clinical + MRI) at 24 & 52 weeks', 'Sepsis/abscess surveillance', 'Recurrence review'], 'Established (darvadstrocel-class approval).', [{ label: 'ADMIRE-CD RCT', note: 'MSC for perianal Crohn’s fistula.' }]),
  [slug('Gut GvHD MSC Therapy')]: d('Steroid-refractory gastrointestinal acute GvHD.', 'MSC immunosuppressive paracrine modulation of alloreactive T-cells.', ['Confirm GvHD grade & GI involvement (biopsy).', 'Infection screen (immunosuppressed host).', 'Baseline GI symptom/stool volume.'], ['GvHD grade & GI response', 'Infection surveillance', 'Steroid taper'], 'Established use in steroid-refractory GvHD.', [R_FACT]),
  [slug('Liver Cirrhosis MSC Therapy')]: d('Decompensated / progressive liver cirrhosis.', 'MSC anti-fibrotic & hepatocyte-supportive paracrine signalling.', ['Confirm cirrhosis & MELD/Child-Pugh; exclude HCC (imaging/AFP).', 'Assess portal hypertension / coagulopathy.', 'Baseline LFTs, MELD.'], ['LFTs & MELD/Child-Pugh', 'Ascites / decompensation events', 'HCC surveillance'], 'Investigational — variable benefit signals.'),
  [slug('Ulcerative Colitis MSC')]: auto('Ulcerative colitis', 'UC', 'Mayo score / faecal calprotectin', '5-ASA/biologics'),
  // Neurology
  [slug('Spinal Cord Injury NSC')]: d('Traumatic spinal cord injury.', 'Neural stem cells support relay/repair and a pro-regenerative environment.', ['Confirm level & completeness (ASIA); imaging.', 'Timing window & surgical planning.', 'Baseline ASIA & function.'], ['ASIA motor/sensory & function', 'Imaging (graft/lesion)', 'Long-term safety follow-up'], 'Investigational.'),
  [slug('Stroke Recovery MSC')]: d('Post-stroke neurological deficit (recovery phase).', 'Neuroprotective, pro-plasticity & anti-inflammatory paracrine support.', ['Confirm stroke type/territory; recovery-phase timing.', 'Exclude haemorrhagic contraindication for the approach.', 'Baseline NIHSS / mRS.'], ['NIHSS & modified Rankin Scale', 'Functional rehab milestones', 'Imaging as indicated'], 'Investigational.'),
  [slug('Parkinson’s iPSC Dopaminergic')]: d('Parkinson’s disease.', 'iPSC-derived dopaminergic progenitors replace lost neurons.', ['Confirm PD diagnosis & levodopa responsiveness; exclude atypical parkinsonism.', 'Stereotactic implantation planning; immunosuppression plan.', 'Baseline UPDRS & imaging.'], ['UPDRS (on/off) & levodopa-equivalent dose', 'Graft survival imaging (DAT/PET)', 'Dyskinesia & long-term surveillance'], 'Investigational — iPSC dopaminergic trials ongoing.', [{ label: 'iPSC-DA trials', note: 'Cell replacement in PD.' }]),
  [slug('ALS / MND MSC Therapy')]: d('Amyotrophic lateral sclerosis / motor-neuron disease.', 'MSC (± neurotrophic-factor-secreting) neuroprotective, anti-neuroinflammatory support.', ['Confirm ALS diagnosis (El Escorial); respiratory assessment.', 'Intrathecal delivery planning.', 'Baseline ALSFRS-R & FVC.'], ['ALSFRS-R & FVC slope', 'Survival / milestone endpoints', 'Procedure tolerability'], 'Investigational (e.g. NurOwn-class studies).'),
  [slug('Muscular Dystrophy')]: d('Muscular dystrophy — supportive cell therapy.', 'MSC anti-inflammatory/trophic support (not gene correction — see GT for gene therapy).', ['Confirm dystrophy type/genotype; cardiac/pulmonary assessment.', 'Function baseline.', 'Consider mutation-specific gene therapy (GT) pathway.'], ['Functional & respiratory measures', 'Cardiac surveillance', 'Symptom review'], 'Investigational; mutation-specific gene therapy is the mechanism-correct route.'),
  [slug('FSHD (Facioscapulohumeral Dystrophy)')]: d('Facioscapulohumeral muscular dystrophy.', 'FSHD is epigenetic (D4Z4 de-repression of toxic DUX4); the mechanism-correct approach silences DUX4 (see GT).', ['Confirm FSHD genotype (D4Z4/DUX4).', 'Baseline functional & MRI muscle assessment.', 'Research-protocol eligibility.'], ['Functional muscle measures', 'MRI muscle involvement', 'DUX4-target biomarkers where available'], 'Investigational / research (DUX4-silencing).'),
  // Pulmonology
  [slug('COPD MSC Therapy')]: d('Chronic obstructive pulmonary disease.', 'MSC anti-inflammatory airway/alveolar paracrine support.', ['Confirm COPD (spirometry GOLD stage); exclude active infection.', 'Assess pulmonary reserve (embolic caution for IV).', 'Baseline FEV₁, 6MWT, exacerbation history.'], ['FEV₁ & 6MWT', 'Exacerbation frequency', 'Infusion tolerability (reduced reserve)'], 'Investigational — safety shown, efficacy modest.'),
  [slug('Pulmonary Fibrosis (IPF) MSC')]: d('Idiopathic pulmonary fibrosis.', 'MSC anti-fibrotic paracrine modulation.', ['Confirm IPF (HRCT/MDT); baseline FVC/DLCO.', 'Exclude infection; pulmonary-reserve assessment.', 'Consider concurrent antifibrotics.'], ['FVC & DLCO slope', '6MWT & oxygen need', 'Safety (acute exacerbation watch)'], 'Investigational — early safety studies.'),
  [slug('ARDS MSC Therapy')]: d('Acute respiratory distress syndrome.', 'MSC immunomodulation & alveolar-repair support in acute lung injury.', ['Confirm ARDS (Berlin criteria); ICU setting.', 'Haemodynamic & ventilation status.', 'Baseline PaO₂/FiO₂.'], ['PaO₂/FiO₂ & ventilator-free days', 'Inflammatory markers', 'Mortality/ICU endpoints'], 'Investigational (e.g. sepsis/ARDS MSC trials).'),
  [slug('Airway Epithelial Regeneration')]: d('Airway epithelial damage / regeneration (research).', 'iPSC-derived airway epithelium for tissue repair (pre-clinical/early).', ['Indication & anatomy assessment.', 'Research-protocol eligibility.', 'Baseline function.'], ['Airway function & imaging', 'Graft integration', 'Long-term safety'], 'Pre-clinical / early research.'),
  // Cosmetic
  [slug('Facial Fat Grafting + SVF')]: d('Facial volume loss / dermal rejuvenation.', 'Autologous fat graft enriched with regenerative stromal vascular fraction (SVF).', ['Assess donor & recipient sites; photography.', 'Exclude active infection at sites.', 'Standard aesthetic consent.'], ['Graft retention & aesthetic outcome (photography)', 'Contour/symmetry review', 'Complication (nodule/infection) watch'], 'Established aesthetic procedure; SVF enrichment practised.'),
  [slug('Hair Restoration Exosome')]: d('Androgenetic alopecia / hair thinning.', 'Exosome follicular signalling (anti-inflammatory, pro-growth) as an adjunct.', ['Confirm pattern & extent; exclude scarring alopecia.', 'Scalp condition assessment.', 'Baseline photography / hair count.'], ['Hair density/photography at 3–6 months', 'Scalp reaction watch', 'Maintenance schedule'], 'Practised cosmetically; clinical evidence early.'),
  [slug('Scar & Wound MSC Therapy')]: d('Scars / soft-tissue wound repair.', 'MSC pro-angiogenic, anti-fibrotic wound-remodelling support.', ['Wound/scar assessment; infection control.', 'Baseline photography / scar scale.', 'Consent.'], ['Wound closure / scar scale (POSAS)', 'Infection surveillance', 'Aesthetic/functional outcome'], 'Investigational / adjunctive.'),
  // Nephrology
  [slug('Chronic Kidney Disease (CKD) MSC Therapy')]: d('Progressive chronic kidney disease.', 'MSC anti-fibrotic, anti-inflammatory renal paracrine support.', ['Confirm CKD stage (eGFR/ACR); exclude reversible causes.', 'Fluid-status review (IV volume caution).', 'Baseline eGFR, proteinuria, BP.'], ['eGFR slope & proteinuria', 'BP & fluid status', 'Progression / dialysis-free interval'], 'Investigational — early renal MSC studies.'),
  [slug('Acute Kidney Injury (AKI) MSC Therapy')]: d('Acute kidney injury / recovery support.', 'MSC tubular-repair support and immunomodulation.', ['Confirm AKI stage (KDIGO); identify/treat cause.', 'Haemodynamic & fluid status.', 'Baseline creatinine/urine output.'], ['Creatinine & urine output recovery', 'Dialysis need/duration', 'Renal-recovery follow-up'], 'Investigational.'),
  [slug('Persona Reversal Renal Epigenetic Reprogramming')]: d('Kidney-targeted epigenetic reprogramming (research).', 'Transient, targeted partial OSK reprogramming of renal tissue (pre-clinical).', ['Epigenetic-age & renal-function baseline (Simulator + eGFR).', 'Tumour-marker & imaging baseline; exclude malignancy.', 'Research-protocol eligibility.'], ['Renal function (eGFR) & safety markers', 'Tumour-marker/imaging surveillance', 'Long-term oncologic follow-up'], 'Investigational / pre-clinical — tumorigenicity is the key barrier.'),
  // Extras (worldwide)
  [slug('CAR-T — B-cell Malignancy')]: d('Relapsed/refractory CD19⁺ B-cell leukaemia/lymphoma.', 'Autologous CD19-CAR T-cells mediate targeted cytotoxic tumour clearance.', ['Confirm CD19⁺ disease & prior lines; disease burden assessment.', 'Organ function & CNS status; lymphodepletion plan.', 'Baseline for CRS/ICANS risk.'], ['CRS & ICANS grading (first weeks)', 'Disease response (PET/marrow)', 'B-cell aplasia & long-term follow-up'], 'Established / approved for defined indications.', [R_FACT]),
  [slug('CAR-T — Multiple Myeloma (BCMA)')]: d('Relapsed/refractory multiple myeloma.', 'BCMA-directed CAR T-cells target myeloma plasma cells.', ['Confirm RRMM & prior therapy lines; disease burden.', 'Organ function; lymphodepletion plan.', 'CRS/ICANS risk baseline.'], ['CRS/ICANS grading', 'Myeloma response (IMWG)', 'Long-term follow-up'], 'Established / approved.', [R_FACT]),
  [slug('Allogeneic HSCT — Leukaemia')]: d('Acute/chronic leukaemia & marrow-failure syndromes.', 'Donor HSCT replaces the diseased marrow and delivers a graft-versus-leukaemia effect.', ['Disease/remission status & transplant indication; HLA-matched donor.', 'Conditioning-fitness (comorbidity index) & organ reserve.', 'Infection screen (donor & recipient).'], ['Engraftment & chimerism', 'GvHD grading & prophylaxis', 'Relapse & infection surveillance; long-term follow-up'], 'Established standard of care for defined haematologic diseases.', [R_FACT]),
  [slug('Tumour-Infiltrating Lymphocyte (TIL) Therapy')]: d('Advanced melanoma & selected solid tumours.', 'Expanded tumour-reactive T-cells re-infused after lymphodepletion (± IL-2).', ['Resectable tumour for TIL harvest; performance status.', 'Lymphodepletion & IL-2 tolerance assessment.', 'Organ-function baseline.'], ['Tumour response (RECIST)', 'IL-2 toxicity & capillary-leak watch', 'Durability follow-up'], 'Established/approved for advanced melanoma.', [R_FACT]),
  [slug('Regulatory T-cell (Treg) Therapy')]: d('Autoimmune disease / transplant tolerance.', 'Autologous expanded Tregs restore immune tolerance.', ['Indication & immune-activity baseline.', 'Treg manufacturing feasibility/purity.', 'Infection screen.'], ['Treg persistence & phenotype', 'Disease-activity / rejection markers', 'Safety surveillance'], 'Investigational.'),
  [slug('Steroid-refractory acute GvHD — MSC')]: d('Steroid-refractory acute graft-versus-host disease.', 'MSC immunosuppressive paracrine modulation of alloreactive T-cells.', ['Confirm GvHD grade/organ involvement.', 'Infection screen (immunosuppressed).', 'Baseline organ scoring.'], ['GvHD organ response', 'Infection surveillance', 'Steroid taper'], 'Established use in steroid-refractory GvHD.', [R_FACT]),
  [slug('Corneal Limbal Stem-Cell Therapy')]: d('Limbal stem-cell deficiency (ocular surface).', 'Autologous limbal epithelial stem cells restore the corneal epithelium.', ['Confirm LSCD; assess ocular surface & fellow eye donor.', 'Control inflammation/infection first.', 'Baseline visual acuity & surface.'], ['Ocular-surface stability & re-epithelialisation', 'Visual acuity', 'Graft survival'], 'Established (Holoclar-class approval).', [{ label: 'Holoclar / LSCD evidence', note: 'Limbal stem-cell grafts.' }]),
  [slug('iPSC/ESC RPE — Macular Degeneration')]: d('Age-related macular degeneration / Stargardt.', 'iPSC/ESC-derived RPE replaces degenerated RPE to preserve photoreceptors.', ['Confirm diagnosis & candidacy (imaging/OCT); immunosuppression plan.', 'Surgical (subretinal) planning.', 'Baseline visual acuity & OCT.'], ['Visual acuity & OCT/structural measures', 'Graft integration & safety', 'Long-term follow-up'], 'Investigational — early clinical trials.'),
  [slug('Islet Transplantation')]: d('Brittle type 1 diabetes with hypoglycaemia unawareness.', 'Donor pancreatic islets restore regulated endogenous insulin secretion.', ['Confirm brittle T1D & severe hypos; immunosuppression eligibility.', 'Portal-access & bleeding-risk assessment.', 'Baseline HbA1c, C-peptide.'], ['Insulin independence & HbA1c', 'C-peptide & hypo frequency', 'Immunosuppression tolerance'], 'Established in selected centres.'),
  [slug('Hepatocyte Transplantation')]: d('Metabolic liver disease / acute liver failure bridge.', 'Donor/iPSC-derived hepatocytes provide functional hepatocyte mass.', ['Confirm indication; portal-access assessment.', 'Immunosuppression plan.', 'Baseline liver-function/metabolic markers.'], ['Target metabolic correction', 'Liver function', 'Graft durability'], 'Investigational / niche established uses.'),
  [slug('Osteoarthritis — Hip / other joints MSC')]: d('Symptomatic osteoarthritis of the hip & other joints.', 'MSC paracrine immunomodulation & chondroprotection.', ['Confirm OA grade & exclude surgical-stage disease.', 'Aseptic intra-articular approach (image-guided for hip).', 'Baseline VAS/HOOS.'], ['VAS/HOOS at 6 & 12 months', 'Flare check 24–72 h', 'Imaging as indicated'], 'Practised; evidence strongest for knee, growing for other joints.'),
  [slug('Cultured Epithelial Autograft — Burns')]: d('Extensive full-thickness burns.', 'Autologous cultured keratinocyte sheets restore the epidermal barrier.', ['Assess burn extent/depth (TBSA); wound-bed preparation.', 'Biopsy for keratinocyte culture; timing plan.', 'Infection control.'], ['Graft take & epithelialisation', 'Infection surveillance', 'Scar/functional outcome'], 'Established for major burns.'),
  [slug('Amniotic Membrane / Placental Therapy')]: d('Chronic wounds, ocular surface & tissue repair.', 'Amniotic/placental allograft provides a growth-factor-rich regenerative matrix + barrier.', ['Wound/surface assessment; debridement/infection control.', 'Product selection (dehydrated/cryopreserved).', 'Baseline wound measurement.'], ['Wound-area reduction / healing', 'Infection surveillance', 'Repeat-application schedule'], 'Established for selected wound & ocular indications.'),
  [slug('Diabetic Foot Ulcer — Cell/Exosome/GF')]: d('Non-healing diabetic foot ulcers.', 'MSC/exosome/growth-factor pro-angiogenic, anti-inflammatory wound repair.', ['Assess ulcer grade (Wagner/UT), perfusion & infection; offloading & glycaemic control.', 'Debridement & wound-bed prep.', 'Baseline ulcer area.'], ['Wound-area reduction & closure rate', 'Infection/perfusion surveillance', 'Recurrence review'], 'Investigational / adjunctive to standard wound care.'),
  [slug('Endometrial / Ovarian PRP Regeneration')]: d('Thin endometrium / diminished ovarian reserve (fertility).', 'Autologous PRP growth factors support endometrial/ovarian tissue rejuvenation.', ['Fertility work-up; confirm indication (thin lining / low reserve).', 'Rule out infection/pathology; timing to cycle.', 'Baseline endometrial thickness / AMH-AFC.'], ['Endometrial thickness / AMH-AFC', 'Cycle & pregnancy outcomes', 'Procedure tolerability'], 'Investigational — early fertility studies.'),
  [slug('CRISPR Gene Therapy — Sickle Cell / β-Thalassaemia')]: d('Transfusion-dependent sickle cell disease / β-thalassaemia.', 'Autologous CRISPR-edited HSC reactivate fetal haemoglobin (BCL11A) to correct the phenotype.', ['Confirm diagnosis & transfusion/crisis history; mobilisation feasibility.', 'Editing QC (efficiency, on/off-target); conditioning workup.', 'Fertility counselling (myeloablation).'], ['HbF induction & transfusion independence', 'Vaso-occlusive-crisis frequency', 'Engraftment & long-term (15-yr) follow-up'], 'Established / approved (exa-cel-class).', [R_FACT, { label: 'exa-cel programme', note: 'CRISPR HbF reactivation.' }]),
  [slug('Lentiviral Gene Therapy — β-Thalassaemia')]: d('Transfusion-dependent β-thalassaemia.', 'Autologous HSC with an added functional β-globin gene restore haemoglobin.', ['Confirm genotype & transfusion dependence; mobilisation.', 'Vector QC & conditioning workup.', 'Fertility counselling.'], ['Transfusion independence & Hb', 'Vector copy number / integration safety', 'Long-term follow-up'], 'Established / approved (beti-cel-class).', [R_FACT]),
  [slug('AAV Gene Therapy — SMA')]: d('Spinal muscular atrophy (paediatric).', 'AAV9 delivers a functional SMN1 gene to motor neurons.', ['Confirm SMN1 genotype & phenotype; anti-AAV9 antibody titre.', 'Weight-based dosing & liver-function baseline.', 'Steroid prophylaxis plan.'], ['Motor-milestone gain (CHOP-INTEND)', 'Liver enzymes & platelets (post-dose)', 'Long-term follow-up'], 'Established / approved (onasemnogene-class).'),
  [slug('AAV Gene Therapy — Inherited Retinal Dystrophy')]: d('RPE65-mediated inherited retinal dystrophy.', 'Subretinal AAV2 restores the RPE65 gene in retinal cells.', ['Confirm biallelic RPE65 mutation & viable retinal cells.', 'Surgical (subretinal) planning; steroid cover.', 'Baseline vision (functional-vision/navigation).'], ['Functional vision & light sensitivity', 'Retinal structure (OCT)', 'Ocular safety & durability'], 'Established / approved (voretigene-class).'),
  [slug('AAV Gene Therapy — Haemophilia')]: d('Haemophilia A/B.', 'AAV delivers a clotting-factor (VIII/IX) gene for endogenous production.', ['Confirm severity & inhibitor status; anti-AAV antibody titre.', 'Liver-health assessment (baseline LFTs).', 'Steroid-management plan for transaminitis.'], ['Factor level & bleed rate (ABR)', 'Liver enzymes (post-dose)', 'Durability & long-term follow-up'], 'Established / approved for defined indications.'),
  [slug('Micro-dystrophin AAV — Muscular Dystrophy')]: d('Duchenne muscular dystrophy.', 'AAV delivers a functional shortened (micro-)dystrophin gene to muscle.', ['Confirm DMD genotype & eligibility; anti-AAV titre.', 'Cardiac/pulmonary & immune assessment.', 'Baseline functional (NSAA) measures.'], ['Micro-dystrophin expression & function (NSAA)', 'Immune/complement & liver safety', 'Long-term follow-up'], 'Investigational / conditional approvals in some regions.'),
};

// ── generate the registry ──
const counters: Record<Category, number> = { CT: 0, ST: 0, RMT: 0, GT: 0 };
const nextCode = (c: Category) => `${c}-${String(++counters[c]).padStart(2, '0')}`;

function build(): Protocol[] {
  const out: Protocol[] = [];
  for (const [make, model, cat, source, route] of THERAPIES) {
    const category = assign(make, model, cat);
    const key = slug(`${make} ${model}`);
    const base: Protocol = {
      code: nextCode(category), category, name: model, therapyKey: key,
      indication: `${category === 'RMT' ? 'Regenerative' : category === 'GT' ? 'Gene/epigenetic' : 'Cell'} therapy for ${model} (${make}).`,
      status: ESTABLISHED.test(model) ? 'established' : 'investigational',
      cellSource: `${source} ${cat}`,
      mechanism: mechanismFor(category, cat),
      route,
      dose: doseFor(cat, route),
      schedule: 'Single dose (some protocols repeat); assess response at defined intervals — validation required.',
      identity: cat === 'MSC' ? 'ISCT MSC criteria (CD73/CD90/CD105⁺; negative markers; tri-lineage) + viability, sterility & endotoxin.' : 'Product-specific identity/potency + viability, sterility & endotoxin release testing.',
      steps: ROUTE_STEPS[route] || ROUTE_STEPS['Local injection'],
      consumables: consumablesFor(cat, route),
      qcRelease: ['Viability within spec', 'Sterility (culture) & endotoxin (LAL) negative', 'Identity/potency within spec', 'Two-person ISBT-128 verification'],
      monitoring: ['Vitals during administration', 'Early adverse-event check (24–72 h)', 'Response assessment at protocol-defined intervals', 'Structured long-term follow-up'],
      adverse: ROUTE_ADVERSE[route] || ROUTE_ADVERSE['Local injection'],
      contraindications: ['Active systemic/local infection', 'Active malignancy (for proliferative products)', 'Pregnancy', 'Uncontrolled comorbidity or product-specific exclusion'],
      storage: cat === 'HSC' || cat === 'iPSC' ? 'Cryopreserved in vapour-phase LN₂ with continuous monitoring; validated cold-chain to bedside thaw.' : 'Per product specification (fresh within validated window, or cryopreserved & thawed/washed) with validated cold-chain.',
      governance: ['cGMP / GTP (21 CFR 1271) manufacture', cat === 'HSC' || category === 'CT' ? 'FACT-JACIE accredited programme' : 'ISCT identity criteria', 'ISBT-128 labelling', 'IRB/ethics + national regulator (ATMP/IND) per jurisdiction'],
      evidence: ESTABLISHED.test(model) ? 'Established / routinely practised in accredited programmes for this indication.' : 'Investigational — offered within clinical research; efficacy not fully established.',
      detailed: false,
    };
    const det = DETAILS[slug(model)];
    const ov = OVERLAY[key];
    out.push({ ...base, ...(det || {}), ...(ov || {}) });
  }
  for (const [category, name, indication, status, cellSource, route, mechanism] of EXTRA) {
    const det = DETAILS[slug(name)];
    const exoOrHsc = cellSource.toLowerCase().includes('exosome') ? 'Exosome' : /hsc|haematopoietic/i.test(cellSource) ? 'HSC' : 'MSC';
    out.push({
      code: nextCode(category), category, name, indication, status, cellSource, mechanism, route,
      dose: 'Product/indication-specific — see the approved label or trial protocol (validation required).',
      schedule: 'Per approved protocol.',
      steps: ROUTE_STEPS[route] || ROUTE_STEPS['Local injection'],
      consumables: consumablesFor(exoOrHsc, route),
      qcRelease: ['Viability/identity/potency within spec', 'Sterility & endotoxin negative', 'Vector/edit QC where applicable', 'Two-person ISBT-128 verification'],
      monitoring: ['Vitals during administration', 'Early adverse-event check', 'Indication-specific efficacy & safety follow-up', 'Long-term follow-up (extended for gene/edited products)'],
      adverse: ROUTE_ADVERSE[route] || ROUTE_ADVERSE['IV infusion'],
      contraindications: ['Active infection', 'Pregnancy', 'Product-specific exclusions'],
      storage: 'Per product specification with validated cold-chain.',
      governance: ['cGMP / GTP manufacture', category === 'CT' || category === 'GT' ? 'FACT-JACIE / gene-therapy programme accreditation' : 'ISCT / tissue standards', 'ISBT-128 labelling', 'Approved regulator pathway (FDA/EMA/national)'],
      evidence: status === 'established' ? 'Established / approved for this indication in major jurisdictions.' : 'Investigational.',
      detailed: false,
      ...(det || {}),
    });
  }
  return out;
}

export const PROTOCOLS: Protocol[] = build().sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true }));
export const byCategory = (c: Category) => PROTOCOLS.filter((p) => p.category === c);
export const byCode = (code: string) => PROTOCOLS.find((p) => p.code.toLowerCase() === code.toLowerCase());
export const byTherapy = (make: string, model: string) => {
  const k = slug(`${make} ${model}`);
  return PROTOCOLS.find((p) => p.therapyKey === k);
};
