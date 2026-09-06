import { useRef, useState } from 'react';
import Icon from '../components/Icon';
import SimHeaderBand from '../components/SimHeaderBand';
import SimRun from '../components/SimRun';
import { buildRun, type FullRun } from '../sim/full';
import { CATALOG, DEFAULT_DISEASE } from '../sim/catalog';
import { impliedCondition } from '../sim/immune';
import ConditionPicker from '../components/ConditionPicker';

const METH_EXT = /\.(csv|cov|tsv|txt|bedgraph|bed)$/i;
const SAMPLES = [
  { href: `${import.meta.env.BASE_URL}samples/sample1_age64_chronic_kidney_disease.cov`, label: 'Age 64 · Chronic Kidney Disease', age: 64, disease: 'chronic-kidney-disease-ckd-msc-therapy' },
  { href: `${import.meta.env.BASE_URL}samples/sample2_age47_multiple_sclerosis.cov`, label: 'Age 47 · Multiple Sclerosis', age: 47, disease: 'multiple-sclerosis-ahsct' },
];

/**
 * The public Protocol Simulator — the REAL pipeline, run entirely in the browser.
 * (When a local backend is detected, Simulator.tsx renders SimulatorLocal instead.)
 */
export default function SimulatorBrowser() {
  const [text, setText] = useState('');        // methylation file contents (on-device)
  const [fileName, setFileName] = useState('');
  const [disease, setDisease] = useState(DEFAULT_DISEASE.key);
  const [age, setAge] = useState('');
  const [comorbid, setComorbid] = useState<string[]>([]);
  const [run, setRun] = useState<FullRun | null>(null);
  const [error, setError] = useState('');
  const [runKey, setRunKey] = useState(0);     // remount SimRun to replay the animation
  const inputRef = useRef<HTMLInputElement>(null);

  const loadFile = async (f: File | null) => {
    if (!f) return;
    if (!METH_EXT.test(f.name)) { setError('Please choose a .csv / .cov / .tsv / .txt / .bedgraph methylation file.'); return; }
    setError('');
    try { setText(await f.text()); setFileName(f.name); setRun(null); } catch { setError('Could not read that file.'); }
  };

  const loadSample = async (s: typeof SAMPLES[number]) => {
    setError('');
    try {
      const t = await (await fetch(s.href)).text();
      setText(t); setFileName(s.href.split('/').pop() || 'sample.cov'); setDisease(s.disease); setAge(String(s.age)); setRun(null);
    } catch { setError('Could not load the sample file.'); }
  };

  const start = () => {
    if (!text) { setError('Upload a methylation file or pick a sample first.'); return; }
    const dz = CATALOG.find((d) => d.key === disease) || DEFAULT_DISEASE;
    const r = buildRun(text, { disease: dz, sample: fileName.replace(/\.[^.]+$/, ''), chronologicalAge: age ? Number(age) : null, cycles: 1, comorbidities: comorbid });
    if (!r.ok) { setError(r.error || 'Could not run the simulation on that file.'); return; }
    setRun(r); setRunKey((k) => k + 1);
    setTimeout(() => document.getElementById('sim-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink-900">
        <div className="absolute -right-24 top-0 h-96 w-96 rounded-full bg-clay-500/20 blur-3xl" />
        <div className="container-x relative py-12 sm:py-16">
          <span className="chip bg-white/10 text-white"><Icon name="brain" className="h-3.5 w-3.5" /> De novo LLM · real pipeline</span>
          <h1 className="mt-4 font-display text-4xl font-extrabold uppercase leading-[0.95] tracking-tight text-white sm:text-6xl">
            Protocol <span className="text-clay-500">Simulator</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/70">
            Upload your DNA-methylation file and run the real epigenetic-age → reprogramming → tumorigenicity-safety
            pipeline — all seven steps, computed <b className="text-white">entirely in your browser</b>. Your genome never leaves your device.
          </p>
          <div className="mt-8 max-w-3xl"><SimHeaderBand autoplay dark /></div>
        </div>
      </section>

      <section className="container-x py-10">
        <div className="mx-auto max-w-3xl">
          {/* Setup */}
          <div className="card p-6">
            <h2 className="font-display text-lg font-bold text-ink-900">1 · Your DNA-methylation data</h2>
            <label
              className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-ink-900/15 bg-cream-100 px-4 py-8 text-center transition hover:border-clay-400"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); loadFile(e.dataTransfer.files?.[0] ?? null); }}
            >
              <input ref={inputRef} type="file" className="hidden" accept=".csv,.cov,.tsv,.txt,.bedgraph,.bed" onChange={(e) => loadFile(e.target.files?.[0] ?? null)} />
              <span className="icon-tile h-12 w-12"><Icon name="dna" className="h-6 w-6" /></span>
              <span className="mt-3 font-semibold text-ink-900">{fileName || 'Drop your methylation file or browse'}</span>
              <span className="mt-1 text-sm text-ink-700/60">array beta .csv (cg IDs) or bisulfite .cov/bedGraph — nothing is uploaded to a server</span>
            </label>

            <div className="mt-3">
              <span className="text-sm text-ink-700/60">or use a sample:</span>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {SAMPLES.map((s) => (
                  <button key={s.href} onClick={() => loadSample(s)} className="flex items-center gap-2 rounded-xl border border-cream-300 bg-white px-3 py-2 text-left text-sm font-semibold text-ink-800 transition hover:border-clay-400">
                    <Icon name="dna" className="h-4 w-4 shrink-0 text-clay-500" /> {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold text-ink-800">Disease / therapy to develop for</label>
                <select value={disease} onChange={(e) => setDisease(e.target.value)} className="input mt-1 w-full">
                  {CATALOG.map((d) => <option key={d.key} value={d.key}>{d.disease} · {d.department}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-ink-800">Chronological age <span className="font-normal text-ink-700/50">(optional)</span></label>
                <input value={age} onChange={(e) => setAge(e.target.value.replace(/[^0-9]/g, ''))} inputMode="numeric" placeholder="e.g. 47" className="input mt-1 w-full" />
              </div>
            </div>

            {/* Other conditions (Step 8 immune / adverse-event modifiers) */}
            <div className="mt-5">
              <label className="block text-sm font-semibold text-ink-800">Other conditions <span className="font-normal text-ink-700/50">(optional — add as many as apply; sharpens the immune / adverse-event read)</span></label>
              <div className="mt-2">
                <ConditionPicker
                  value={comorbid}
                  onChange={setComorbid}
                  impliedKey={impliedCondition((CATALOG.find((d) => d.key === disease) || DEFAULT_DISEASE).department)}
                />
              </div>
            </div>

            {error && <p className="mt-3 text-sm font-semibold text-red-600">{error}</p>}

            <button onClick={start} disabled={!text} className="btn-primary mt-5 w-full justify-center py-3 disabled:cursor-not-allowed disabled:opacity-40">
              {run ? 'Run again' : 'Run Protocol Simulator'}
            </button>
            <p className="mt-3 text-xs text-ink-700/50">
              Runs the published Horvath (2013) clock and a deterministic reprogramming + tumorigenicity model on your
              device. Research / illustrative — projections are model estimates, not measured outcomes. Not medical advice.
            </p>
          </div>

          {/* Result */}
          {run && (
            <div id="sim-result" className="mt-6">
              <SimRun key={runKey} run={run} />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
