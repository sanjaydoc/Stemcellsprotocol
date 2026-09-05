import { useEffect, useMemo, useRef, useState } from 'react';
import type { FullRun } from '../sim/full';
import { summarizeRun } from '../sim/full';
import { exportSimPdf } from '../sim/pdf';
import { projectRejuvenation, tumorSafety } from '../sim/pipeline';

/* Animated, sci-fi 7-step simulator run rendered inside the chat.
   Plays each step in sequence: scan → reveal, with count-ups and mini-charts. */

const STEPS = [
  { n: '01', tag: 'SAMPLE', title: 'Sample & disease' },
  { n: '02', tag: 'SEQUENCE', title: 'Data ingest' },
  { n: '03', tag: 'ANALYSE', title: 'Epigenetic age' },
  { n: '04', tag: 'REVERSE', title: 'Reprogramming projection' },
  { n: '05', tag: 'VECTOR', title: 'OSK construct' },
  { n: '06', tag: 'AVATAR', title: 'Safety pre-screen' },
  { n: '07', tag: 'SAFETY', title: 'Tumorigenicity envelope' },
];
const SCAN_MS = 780;
const prefersReduced = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

function useCountUp(target: number, active: boolean, ms = 800, decimals = 0) {
  const [v, setV] = useState(active ? target : 0);
  useEffect(() => {
    if (!active) return;
    if (prefersReduced) { setV(target); return; }
    let raf = 0; const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / ms); const e = 1 - Math.pow(1 - p, 3);
      setV(target * e);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, ms]);
  return decimals ? v.toFixed(decimals) : Math.round(v).toString();
}

function Bar({ pct, color, height = 8 }: { pct: number; color: string; height?: number }) {
  return (
    <div style={{ height, background: 'rgba(255,255,255,.08)', borderRadius: 99, overflow: 'hidden' }}>
      <div style={{ width: `${Math.max(2, Math.min(100, pct))}%`, height: '100%', background: color, borderRadius: 99, transition: 'width .9s cubic-bezier(.2,.8,.2,1)' }} />
    </div>
  );
}

function GeneMap({ vector }: { vector: any }) {
  const color = (nm: string) => {
    const s = nm.toLowerCase();
    if (s.includes('itr')) return '#94a3b8';
    if (/promoter|tre|efs|ef1|cmv/.test(s)) return '#4285F4';
    if (/oct4|sox2|klf4|rtta|cds|pou5f1/.test(s)) return '#22c55e';
    if (/p2a|t2a|peptide/.test(s)) return '#f59e0b';
    if (s.includes('polya')) return '#a78bfa';
    if (/kozak|start/.test(s)) return '#2dd4bf';
    if (s.includes('wpre')) return '#60a5fa';
    return '#64748b';
  };
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#9fb4d8', marginBottom: 3 }}>
        <span style={{ fontWeight: 700, color: '#dbe8ff' }}>{vector.name} · {vector.length_bp} bp</span>
        <span style={{ color: vector.fits_aav ? '#4ade80' : '#f87171', fontWeight: 700 }}>{vector.fits_aav ? '✓ fits AAV' : '✗ over limit'}</span>
      </div>
      <div style={{ display: 'flex', height: 16, borderRadius: 5, overflow: 'hidden', boxShadow: '0 0 12px rgba(66,133,244,.4)' }}>
        {vector.features.map((f: any, i: number) => (
          <div key={i} title={f.name} style={{ flex: Math.max(1, f.length), background: color(f.name), borderRight: '1px solid rgba(5,18,46,.6)' }} />
        ))}
      </div>
    </div>
  );
}

function StepCard({ i, run, rej, t, cycles, onStep, active, revealed }: {
  i: number; run: FullRun; rej: any; t: any; cycles: number; onStep: (d: number) => void; active: boolean; revealed: boolean;
}) {
  const s = STEPS[i];
  const ea = run.epigenetic_age;
  const dnam = useCountUp(ea.dnam_age, active && i === 2, 900, 1);
  const cov = useCountUp(run.coverage_pct, active && i === 1, 700);
  const risk = Math.round(t.estimated_risk * 100); // live (updates with the cycles stepper)
  const state = revealed ? 'revealed' : active ? 'scanning' : 'pending';
  const tierColor = t.risk_tier === 'Low' ? '#4ade80' : t.risk_tier === 'High' ? '#f87171' : '#fbbf24';
  const stepBtn = { width: 26, height: 26, borderRadius: 99, border: '1px solid rgba(66,133,244,.5)', background: 'rgba(66,133,244,.12)', color: '#bcd3ff', fontSize: 16, fontWeight: 700, cursor: 'pointer', lineHeight: '22px' } as const;

  return (
    <div style={{
      opacity: state === 'pending' ? 0.28 : 1,
      transform: state === 'revealed' ? 'none' : 'translateY(6px)',
      transition: 'opacity .5s, transform .5s',
      borderLeft: `2px solid ${active ? '#22d3ee' : revealed ? 'rgba(66,133,244,.5)' : 'rgba(255,255,255,.12)'}`,
      padding: '10px 0 14px 14px', position: 'relative',
    }}>
      <div style={{ position: 'absolute', left: -7, top: 10, width: 12, height: 12, borderRadius: 99,
        background: revealed ? '#4285F4' : active ? '#22d3ee' : '#1e2f52',
        boxShadow: active ? '0 0 12px #22d3ee' : 'none', transition: 'all .3s' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: revealed ? 8 : 0 }}>
        <span style={{ fontFamily: 'ui-monospace,monospace', fontSize: 10, letterSpacing: '.18em', color: active ? '#22d3ee' : '#7d93b8' }}>{s.n} · {s.tag}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#eaf1ff' }}>{s.title}</span>
        {active && !revealed && <span className="scp-scan" style={{ marginLeft: 'auto', fontSize: 10, color: '#22d3ee', fontFamily: 'ui-monospace,monospace' }}>scanning…</span>}
      </div>

      {revealed && (
        <div style={{ fontSize: 12.5, color: '#cdd8ee' }}>
          {i === 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {[run.disease.name, run.disease.tissue, `capsid ${run.disease.capsid.toUpperCase()}`, run.disease.route].map((x) => (
                <span key={x} style={{ background: 'rgba(66,133,244,.16)', color: '#bcd3ff', border: '1px solid rgba(66,133,244,.35)', borderRadius: 99, padding: '3px 10px', fontSize: 11.5, fontWeight: 600 }}>{x}</span>
              ))}
            </div>
          )}
          {i === 1 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span>Clock CpGs mapped ({run.epigenetic_age.clock})</span>
                <span style={{ fontWeight: 700, color: '#22d3ee' }}>{ea.n_used}/{ea.n_total} · {cov}%</span>
              </div>
              <Bar pct={run.coverage_pct} color="linear-gradient(90deg,#4285F4,#22d3ee)" />
            </div>
          )}
          {i === 2 && (
            <div>
              <div style={{ display: 'flex', gap: 18, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <div><div style={{ fontSize: 30, fontWeight: 800, color: '#fff', lineHeight: 1 }}>{dnam}<span style={{ fontSize: 13, color: '#9fb4d8' }}> yr</span></div><div style={{ fontSize: 10.5, color: '#9fb4d8', marginTop: 3 }}>BIOLOGICAL (DNAm) AGE</div></div>
                {ea.age_acceleration != null && <div><div style={{ fontSize: 22, fontWeight: 800, color: ea.age_acceleration >= 0 ? '#f87171' : '#4ade80', lineHeight: 1 }}>{ea.age_acceleration >= 0 ? '+' : ''}{ea.age_acceleration}</div><div style={{ fontSize: 10.5, color: '#9fb4d8', marginTop: 3 }}>ACCELERATION (yr)</div></div>}
              </div>
              <div style={{ marginTop: 10 }}>
                <div style={{ position: 'relative', height: 8, background: 'rgba(255,255,255,.08)', borderRadius: 99 }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, height: 8, width: `${ea.dnam_age}%`, background: 'linear-gradient(90deg,#4285F4,#22d3ee)', borderRadius: 99, transition: 'width 1s' }} />
                </div>
              </div>
              <div style={{ marginTop: 8, fontSize: 11, color: '#9fb4d8' }}>Top drivers: {run.targets.slice(0, 5).map((x: any) => x.gene || x.cpg).join(' · ')}</div>
            </div>
          )}
          {i === 3 && (
            <div>
              <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <div><div style={{ fontSize: 24, fontWeight: 800, color: '#4ade80', lineHeight: 1 }}>−{rej.years_reversed} yr</div><div style={{ fontSize: 10.5, color: '#9fb4d8', marginTop: 3 }}>AGE REVERSAL ({rej.cycles} cycle)</div></div>
                <div><div style={{ fontSize: 24, fontWeight: 800, color: '#2dd4bf', lineHeight: 1 }}>{rej.tissue_rejuvenation_index}%</div><div style={{ fontSize: 10.5, color: '#9fb4d8', marginTop: 3 }}>TISSUE REJUVENATION</div></div>
                <div style={{ fontSize: 12, color: '#cdd8ee' }}>{ea.dnam_age} → <b style={{ color: '#fff' }}>{rej.projected_age} yr</b></div>
              </div>
            </div>
          )}
          {i === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontSize: 11, color: '#9fb4d8' }}>{run.construct.strategy} · {run.construct.capsid_desc}</div>
              {run.construct.vectors.map((v: any, k: number) => <GeneMap key={k} vector={v} />)}
            </div>
          )}
          {i === 5 && (
            <div>
              {[['Without avatar', run.safety.projected_success_without, '#7d93b8'], ['With avatar pre-screen', run.safety.projected_success_with, '#4ade80']].map(([lab, pct, col]) => (
                <div key={lab as string} style={{ marginBottom: 6 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 3 }}><span>{lab}</span><span style={{ fontWeight: 700, color: col as string }}>{pct}%</span></div>
                  <Bar pct={pct as number} color={col as string} height={9} />
                </div>
              ))}
            </div>
          )}
          {i === 6 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(66,133,244,.25)', borderRadius: 10, padding: '7px 10px' }}>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: '#dbe8ff' }}>Reprogramming cycles</span>
                <button aria-label="fewer cycles" onClick={() => onStep(-1)} disabled={cycles <= 1} style={{ ...stepBtn, opacity: cycles <= 1 ? 0.4 : 1 }}>−</button>
                <span style={{ minWidth: 18, textAlign: 'center', fontSize: 15, fontWeight: 800, color: '#fff' }}>{cycles}</span>
                <button aria-label="more cycles" onClick={() => onStep(1)} disabled={cycles >= 10} style={{ ...stepBtn, opacity: cycles >= 10 ? 0.4 : 1 }}>+</button>
                <span style={{ fontSize: 10.5, color: '#9fb4d8', marginLeft: 4 }}>step up to watch over-induction risk climb</span>
              </div>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: 8 }}>
                <div><div style={{ fontSize: 22, fontWeight: 800, color: tierColor, lineHeight: 1 }}>{t.risk_tier}</div><div style={{ fontSize: 10, color: '#9fb4d8' }}>RISK TIER</div></div>
                <div><div style={{ fontSize: 22, fontWeight: 800, color: tierColor, lineHeight: 1 }}>{risk}%</div><div style={{ fontSize: 10, color: '#9fb4d8' }}>@ {t.requested_cycles} CYCLE</div></div>
                <div><div style={{ fontSize: 22, fontWeight: 800, color: '#60a5fa', lineHeight: 1 }}>{t.max_safe_cycles}</div><div style={{ fontSize: 10, color: '#9fb4d8' }}>MAX SAFE</div></div>
                <div><div style={{ fontSize: 22, fontWeight: 800, color: '#60a5fa', lineHeight: 1 }}>{t.tissue_proliferation_factor}×</div><div style={{ fontSize: 10, color: '#9fb4d8' }}>{String(t.tissue_key).toUpperCase()}</div></div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 60, borderBottom: '1px solid rgba(255,255,255,.12)', paddingBottom: 2 }}>
                {t.risk_curve.map((c: any) => {
                  const over = c.risk > (t.risk_threshold || 0.15);
                  return (
                    <div key={c.cycles} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                      <span style={{ fontSize: 9, color: '#9fb4d8' }}>{Math.round(c.risk * 100)}%</span>
                      <div style={{ width: '70%', height: `${Math.min(100, c.risk * 100 / 0.6 * 100)}%`, background: c.cycles === t.requested_cycles ? tierColor : over ? 'rgba(248,113,113,.5)' : 'rgba(66,133,244,.5)', borderRadius: '3px 3px 0 0', transition: 'height .8s' }} />
                      <span style={{ fontSize: 9, color: '#7d93b8', marginTop: 2 }}>{c.cycles}</span>
                    </div>
                  );
                })}
              </div>
              <div style={{ fontSize: 10, color: '#7d93b8', marginTop: 4 }}>Green ≤ {Math.round((t.risk_threshold || 0.15) * 100)}% · red &gt; threshold · cycles →</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function SimRun({ run, onExplain, instant, onDone }: { run: FullRun; onExplain?: (summary: string) => void; instant?: boolean; onDone?: () => void }) {
  const skip = prefersReduced || !!instant;
  const [revealed, setRevealed] = useState(skip ? STEPS.length : 0);
  const [active, setActive] = useState(skip ? -1 : 0);
  const [done, setDone] = useState(skip);
  const timers = useRef<number[]>([]);

  // Live cycles stepper (Step 7) — recompute projection + tumour envelope.
  const ea = run.epigenetic_age;
  const tk = run.rejuvenation?.tissue_key || run.tumor?.tissue_key || 'systemic';
  const [cycles, setCycles] = useState<number>(run.rejuvenation?.cycles || 1);
  const rej = useMemo(() => projectRejuvenation(ea.dnam_age, ea.coverage, tk, cycles), [cycles, ea.dnam_age, ea.coverage, tk]);
  const tumor = useMemo(() => tumorSafety({
    dnamAge: ea.dnam_age, ageAcceleration: ea.age_acceleration, coverage: ea.coverage,
    youthSetpoint: rej.youth_setpoint, efficiency: rej.efficiency, tissueKey: tk, cycles,
  }), [cycles, rej, ea, tk]);
  const stepCycles = (d: number) => setCycles((c) => Math.max(1, Math.min(10, c + d)));

  useEffect(() => {
    if (skip) { onDone?.(); return; }
    let i = 0;
    const step = () => {
      if (i >= STEPS.length) { setActive(-1); setDone(true); onDone?.(); return; }
      setActive(i);
      timers.current.push(window.setTimeout(() => {
        setRevealed(i + 1); i += 1;
        timers.current.push(window.setTimeout(step, 420));
      }, SCAN_MS));
    };
    step();
    return () => { timers.current.forEach(clearTimeout); timers.current = []; };
  }, []);

  const pdf = () => {
    exportSimPdf({
      disease: run.disease, sample: run.sample, chronological_age: run.chronological_age,
      epigenetic_age: run.epigenetic_age, targets: run.targets, rejuvenation: rej,
      construct: run.construct, safety: run.safety, tumor,
    }, `StemCells-Simulator-${run.sample}.pdf`);
  };

  return (
    <div style={{
      background: 'radial-gradient(130% 100% at 90% -10%, #12244d 0%, #061229 60%)',
      border: '1px solid rgba(66,133,244,.35)', borderRadius: 14, padding: 14, color: '#eaf1ff',
      boxShadow: '0 0 24px rgba(66,133,244,.25) inset', fontFamily: 'inherit',
    }}>
      <style>{`
        @keyframes scpScan{0%,100%{opacity:.35}50%{opacity:1}}
        .scp-scan{animation:scpScan 1s ease-in-out infinite}
        @keyframes scpPulse{0%,100%{box-shadow:0 0 0 0 rgba(34,211,238,.4)}50%{box-shadow:0 0 0 6px rgba(34,211,238,0)}}
      `}</style>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <span style={{ width: 8, height: 8, borderRadius: 99, background: done ? '#4ade80' : '#22d3ee', animation: done ? 'none' : 'scpPulse 1.4s infinite' }} />
        <span style={{ fontFamily: 'ui-monospace,monospace', fontSize: 11, letterSpacing: '.16em', color: '#9fb4d8' }}>
          {done ? 'RUN COMPLETE' : 'PROTOCOL SIMULATOR · RUNNING'}
        </span>
        <span style={{ marginLeft: 'auto', fontFamily: 'ui-monospace,monospace', fontSize: 11, color: '#22d3ee' }}>{Math.min(revealed, STEPS.length)}/{STEPS.length}</span>
      </div>

      <div>
        {STEPS.map((_, i) => (
          <StepCard key={i} i={i} run={run} rej={rej} t={tumor} cycles={cycles} onStep={stepCycles} active={active === i} revealed={i < revealed} />
        ))}
      </div>

      {done && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,.12)' }}>
          <button onClick={pdf} style={{ background: 'linear-gradient(90deg,#4285F4,#22d3ee)', color: '#04122e', fontWeight: 700, border: 0, borderRadius: 9, padding: '8px 14px', fontSize: 12.5, cursor: 'pointer' }}>⬇ Export PDF</button>
          {onExplain && <button onClick={() => onExplain(summarizeRun({ ...run, rejuvenation: rej, tumor }))} style={{ background: 'transparent', color: '#bcd3ff', border: '1px solid rgba(66,133,244,.45)', borderRadius: 9, padding: '8px 14px', fontSize: 12.5, cursor: 'pointer' }}>💬 Explain in plain language</button>}
        </div>
      )}
      <div style={{ fontSize: 10, color: '#7d93b8', marginTop: 10 }}>Research / illustrative — computed on your device. Not medical advice.</div>
    </div>
  );
}
