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
    const ov = OVERLAY[key];
    out.push(ov ? { ...base, ...ov } : base);
  }
  for (const [category, name, indication, status, cellSource, route, mechanism] of EXTRA) {
    out.push({
      code: nextCode(category), category, name, indication, status, cellSource, mechanism, route,
      dose: 'Product/indication-specific — see the approved label or trial protocol (validation required).',
      schedule: 'Per approved protocol.',
      steps: ROUTE_STEPS[route] || ROUTE_STEPS['Local injection'],
      consumables: consumablesFor(cellSource.includes('exosome') ? 'Exosome' : cellSource.includes('HSC') || cellSource.includes('HSC') ? 'HSC' : 'MSC', route),
      qcRelease: ['Viability/identity/potency within spec', 'Sterility & endotoxin negative', 'Vector/edit QC where applicable', 'Two-person ISBT-128 verification'],
      monitoring: ['Vitals during administration', 'Early adverse-event check', 'Indication-specific efficacy & safety follow-up', 'Long-term follow-up (extended for gene/edited products)'],
      adverse: ROUTE_ADVERSE[route] || ROUTE_ADVERSE['IV infusion'],
      contraindications: ['Active infection', 'Pregnancy', 'Product-specific exclusions'],
      storage: 'Per product specification with validated cold-chain.',
      governance: ['cGMP / GTP manufacture', category === 'CT' || category === 'GT' ? 'FACT-JACIE / gene-therapy programme accreditation' : 'ISCT / tissue standards', 'ISBT-128 labelling', 'Approved regulator pathway (FDA/EMA/national)'],
      evidence: status === 'established' ? 'Established / approved for this indication in major jurisdictions.' : 'Investigational.',
      detailed: false,
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
