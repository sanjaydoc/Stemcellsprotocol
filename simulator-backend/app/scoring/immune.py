"""Step 8 — Immune & Adverse-Event Safety Envelope (offline parity).

Mirrors client/src/sim/immune.ts EXACTLY (same tables, same formula) so the
local simulator, the /simulator web page and the De-Novo chat all agree.

The r/stemcells reality: most reported harms from MSC / cell therapy are NOT
tumorigenicity (Step 7's iPSC/OSK concern) — they're inflammatory, embolic,
immune and procedural events. This estimates a per-patient, per-therapy RELATIVE
risk across those classes, two-layer:

    Layer 1 — clinical:   route/tissue baseline x comorbidity modifiers
    Layer 2 — epigenetic: age-acceleration (inflammaging proxy) x dose/cycles

HONESTY (hard boundary): a methylation file is NOT a genotype, so this cannot
see HLA type or clotting variants, nor the product/clinic. Relative, probabilistic
read — never a yes/no verdict. Not medical advice.
"""
from __future__ import annotations

AE_LABEL = {
    "local": "Local inflammatory",
    "infusion": "Infusion / systemic reaction",
    "embolic": "Pulmonary embolic / clotting (IBMIR)",
    "immune": "Immune reaction / disease flare",
    "conditioning": "Conditioning toxicity + infection",
    "procedural": "Procedural / access",
}

_AE_SYMPTOMS = {
    "local": ["injection-site pain", "swelling / effusion", "stiffness", "warmth (transient synovitis)"],
    "infusion": ["fever / chills", "fatigue", "headache", "nausea", "flushing"],
    "embolic": ["breathlessness / chest tightness", "clotting activation (IBMIR)", "rare pulmonary embolism"],
    "immune": ["immune reaction", "flare of the underlying disease", "allo-sensitization (anti-HLA antibodies)"],
    "conditioning": ["cytopenias", "neutropenic fever", "mucositis", "hair loss", "serious infection"],
    "procedural": ["procedure-site pain / bruising", "transient fever", "procedural infection"],
}

_PROCEDURAL_BY_TISSUE = {
    "cns": ["post-lumbar-puncture headache", "back pain", "nausea", "rare arachnoiditis / meningitis"],
    "heart": ["access-site bruising / bleeding", "transient arrhythmia", "coronary microembolism"],
    "pancreas": ["abdominal pain", "pancreatitis (intra-ductal)", "procedural infection"],
    "joint": ["injection-site pain", "rare septic arthritis"],
    "retina": ["ocular discomfort", "raised eye pressure", "rare endophthalmitis"],
}

# Layer 1a: route/tissue baseline weights (0..1) per class — keyed by tissue_key.
_TISSUE_BASELINE = {
    "joint":    {"local": 0.45, "procedural": 0.20, "immune": 0.12},
    "skin":     {"local": 0.35, "procedural": 0.18, "immune": 0.10},
    "systemic": {"infusion": 0.40, "embolic": 0.35, "immune": 0.18, "procedural": 0.06},
    "liver":    {"infusion": 0.38, "embolic": 0.34, "immune": 0.16, "procedural": 0.10},
    "kidney":   {"infusion": 0.42, "embolic": 0.30, "immune": 0.16, "procedural": 0.08},
    "pancreas": {"infusion": 0.35, "embolic": 0.28, "procedural": 0.30, "immune": 0.16},
    "heart":    {"procedural": 0.38, "embolic": 0.36, "infusion": 0.24, "immune": 0.12},
    "lung":     {"embolic": 0.42, "infusion": 0.30, "local": 0.20, "procedural": 0.12},
    "cns":      {"procedural": 0.42, "infusion": 0.24, "immune": 0.20, "local": 0.16},
    "immune":   {"conditioning": 0.60, "immune": 0.40, "infusion": 0.26, "embolic": 0.18},
    "bone":     {"local": 0.38, "procedural": 0.28, "immune": 0.12},
    "muscle":   {"infusion": 0.32, "embolic": 0.28, "local": 0.20, "immune": 0.12},
    "gut":      {"infusion": 0.32, "immune": 0.26, "procedural": 0.22, "embolic": 0.18},
    "retina":   {"procedural": 0.40, "local": 0.24, "immune": 0.18},
}

# Layer 1b: comorbidity modifiers (multipliers per class).
COMORBIDITIES = [
    {"key": "diabetes", "label": "Diabetes"},
    {"key": "ckd", "label": "Chronic kidney disease"},
    {"key": "copd", "label": "COPD / lung disease"},
    {"key": "cirrhosis", "label": "Liver cirrhosis"},
    {"key": "autoimmune", "label": "Autoimmune disease"},
    {"key": "immunosuppressed", "label": "On immunosuppressants"},
    {"key": "prior_cell_therapy", "label": "Prior cell / stem-cell therapy"},
    {"key": "allogeneic", "label": "Donor (allogeneic) cells"},
    {"key": "thrombophilia", "label": "Known clotting disorder"},
]
_COMORBID_LABEL = {c["key"]: c["label"] for c in COMORBIDITIES}

_COMORBID_MULT = {
    "diabetes":           {"local": 1.4, "procedural": 1.5, "embolic": 1.2},
    "ckd":                {"infusion": 1.5, "embolic": 1.2, "procedural": 1.2},
    "copd":               {"embolic": 1.8, "procedural": 1.2, "infusion": 1.1},
    "cirrhosis":          {"embolic": 1.6, "procedural": 1.4, "infusion": 1.1},
    "autoimmune":         {"immune": 1.8, "procedural": 1.2},
    "immunosuppressed":   {"procedural": 1.6, "conditioning": 1.2, "immune": 1.1},
    "prior_cell_therapy": {"immune": 1.5},
    "allogeneic":         {"immune": 1.7},
    "thrombophilia":      {"embolic": 2.0},
}

_DEPARTMENT_IMPLIED = {
    "Diabetes": "diabetes",
    "Nephrology": "ckd",
    "Pulmonology": "copd",
    "Gastroenterology": "cirrhosis",
    "Autoimmune": "autoimmune",
}

_CANT_SEE = [
    "HLA type & clotting-gene variants — a methylation file is not a genotype",
    "The product itself: cell source, dose, viability, sterility",
    "The clinic's technique and infection controls",
    "Delayed effects beyond the modelled window",
]

_INFLAMMATORY = ("local", "infusion", "embolic", "immune")


def implied_comorbidity(department: str | None) -> str | None:
    return _DEPARTMENT_IMPLIED.get((department or "").strip())


def _tests_for(tissue_key: str, active: set[str]) -> list[str]:
    t: list[str] = []
    w = _TISSUE_BASELINE.get(tissue_key, _TISSUE_BASELINE["systemic"])
    if w.get("embolic", 0) >= 0.25 or "thrombophilia" in active:
        t.append("Thrombophilia screen (e.g. Factor V Leiden) + baseline CRP before IV cells")
    if w.get("local", 0) >= 0.3 or w.get("procedural", 0) >= 0.3:
        t.append("Confirm the clinic's cell-prep sterility & infection precautions")
    if "allogeneic" in active or "prior_cell_therapy" in active:
        t.append("HLA typing / anti-HLA antibody panel (donor-cell or repeat-dose immune risk)")
    if tissue_key == "lung" or "copd" in active:
        t.append("Pulmonary function tests + O2 saturation (reduced reserve for pulmonary entrapment)")
    if tissue_key == "cns":
        t.append("Discuss lumbar-puncture risks (post-LP headache, rare arachnoiditis)")
    if "cirrhosis" in active:
        t.append("Coagulation panel + platelets (rebalanced hemostasis)")
    if "ckd" in active:
        t.append("Fluid-status / volume review before IV infusion")
    if "autoimmune" in active:
        t.append("Disease-activity review — cell therapy can trigger a flare")
    t.append("Ask for the product's cell source, dose, viability and release testing")
    return t


def _tier_of(x: float) -> str:
    return "Low" if x < 0.25 else "Moderate" if x < 0.5 else "High"


def immune_safety(
    tissue_key: str | None = None,
    department: str | None = None,
    age_acceleration: float | None = None,
    coverage: float = 1.0,
    cycles: int = 1,
    comorbidities: list[str] | None = None,
) -> dict:
    tissue_key = (tissue_key or "systemic").lower()
    baseline = _TISSUE_BASELINE.get(tissue_key, _TISSUE_BASELINE["systemic"])
    accel = max(0.0, age_acceleration or 0.0)
    coverage = coverage if coverage is not None else 1.0
    cycles = max(1, min(int(cycles or 1), 10))

    active = {c.lower() for c in (comorbidities or [])}
    implied = implied_comorbidity(department)
    if implied:
        active.add(implied)

    infla_mult = 1 + min(accel, 20.0) * 0.02
    dose_mult = 1 + (cycles - 1) * 0.08

    classes: list[dict] = []
    all_drivers: list[str] = []

    for key, base in baseline.items():
        if base < 0.1:
            continue
        score = base
        drivers: list[str] = []
        for c in active:
            m = _COMORBID_MULT.get(c, {}).get(key)
            if m and m != 1:
                score *= m
                label = _COMORBID_LABEL.get(c, c)
                drivers.append(f"{label} (x{m})" + (" — the indication" if implied == c else ""))
        if key in _INFLAMMATORY and infla_mult > 1.001:
            score *= infla_mult
            drivers.append(f"epigenetic age-acceleration +{round(accel, 1)} yr (x{round(infla_mult, 2)})")
        if key in ("embolic", "local", "infusion") and dose_mult > 1.001:
            score *= dose_mult
            drivers.append(f"{cycles} dose(s) (x{round(dose_mult, 2)})")

        index = min(0.98, round(score, 3))
        symptoms = (_PROCEDURAL_BY_TISSUE.get(tissue_key) if key == "procedural" and tissue_key in _PROCEDURAL_BY_TISSUE
                    else _AE_SYMPTOMS[key])
        classes.append({"key": key, "label": AE_LABEL[key], "tier": _tier_of(index),
                        "index": index, "symptoms": symptoms, "drivers": drivers})
        all_drivers.extend(drivers)

    classes.sort(key=lambda c: c["index"], reverse=True)
    order = ["Low", "Moderate", "High"]
    overall = "Low"
    for c in classes:
        if order.index(c["tier"]) > order.index(overall):
            overall = c["tier"]

    modifiable: list[str] = []
    if accel >= 5:
        modifiable.append(f"Elevated inflammatory baseline (age-acceleration +{round(accel, 1)} yr) is partly "
                          "reversible — reduce it and re-test before therapy.")
    if "autoimmune" in active:
        modifiable.append("Treat to low disease activity before cell therapy to lower flare risk.")
    if "ckd" in active:
        modifiable.append("Optimise fluid status before an IV infusion.")
    if coverage < 0.8:
        modifiable.append(f"CpG coverage {int(coverage * 100)}% — lower confidence; treat this as provisional.")

    comorb_names = [_COMORBID_LABEL.get(c, c) for c in active]
    lead = classes[0] if classes else None
    if lead:
        summary = (f"Leading risk for this route is {lead['label'].lower()} ({lead['tier']}). "
                   f"Overall relative adverse-event risk: {overall}. This is a relative, probabilistic read "
                   "from your epigenetic profile + history — not a yes/no verdict.")
    else:
        summary = f"Overall relative adverse-event risk: {overall}."

    return {
        "overall_tier": overall,
        "classes": classes,
        "drivers": list(dict.fromkeys(all_drivers)),
        "modifiable": modifiable,
        "tests_to_ask": _tests_for(tissue_key, active),
        "cant_see": _CANT_SEE,
        "comorbidities": comorb_names,
        "summary": summary,
        "disclaimer": "Illustrative, RELATIVE immune / adverse-event risk stratification — not a diagnosis or a "
        "yes/no prediction. A methylation file is not a genotype: it cannot read HLA type or clotting variants, "
        "and it cannot see the product or clinic. It informs the conversation with your clinician; it does not "
        "replace it. Not medical advice.",
    }
