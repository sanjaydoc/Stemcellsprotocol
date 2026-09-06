import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon, { type IconName } from '../components/Icon';
import { CATEGORIES, PROTOCOLS, type Category, type Protocol } from '../protocols/registry';
import { STANDARDS, DISCLAIMER } from '../protocols/standards';

/**
 * StemCells Protocol — Standard (v0.1): a coded, safety-first protocol registry
 * so cell, stem-cell, regenerative and gene therapies can be administered to one
 * repeatable, documented worldwide standard. Static + on-device; no backend.
 */
export default function Protocols() {
  const [cat, setCat] = useState<Category | 'ALL'>('ALL');
  const [q, setQ] = useState('');

  const list = useMemo(() => {
    const query = q.trim().toLowerCase();
    return PROTOCOLS.filter((p) =>
      (cat === 'ALL' || p.category === cat) &&
      (!query || p.code.toLowerCase().includes(query) || p.name.toLowerCase().includes(query) ||
        p.indication.toLowerCase().includes(query) || (p.aka || '').toLowerCase().includes(query) ||
        (p.regions || '').toLowerCase().includes(query)));
  }, [cat, q]);

  const counts = useMemo(() => {
    const m: Record<string, number> = {};
    for (const p of PROTOCOLS) m[p.category] = (m[p.category] || 0) + 1;
    return m;
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink-900">
        <div className="absolute -right-24 top-0 h-96 w-96 rounded-full bg-clay-500/20 blur-3xl" />
        <div className="container-x relative py-12 sm:py-16">
          <span className="chip bg-white/10 text-white"><Icon name="clipboard" className="h-3.5 w-3.5" /> Standard v0.1 · draft</span>
          <h1 className="mt-4 font-display text-4xl font-extrabold uppercase leading-[0.95] tracking-tight text-white sm:text-6xl">
            The Protocol <span className="text-clay-500">Standard</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/70">
            One repeatable, safety-first, documented standard so clinics, hospitals and institutions worldwide can deliver
            cell, stem-cell, regenerative and gene therapies with the <b className="text-white">same results</b> — every therapy
            coded, every step, dose, interval and consumable documented, every risk pre-screened.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <span key={c.key} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-sm font-semibold text-white">
                <span style={{ color: c.accent }}><Icon name={c.icon as IconName} className="h-4 w-4" /></span>
                {c.key} · {c.name} <span className="text-white/50">({counts[c.key] || 0})</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Safety & standards backbone */}
      <section className="container-x py-10">
        <h2 className="font-display text-2xl font-extrabold text-ink-900">Safety &amp; quality backbone</h2>
        <p className="mt-1 max-w-3xl text-ink-700/70">
          Every coded protocol inherits this cross-cutting layer, grounded in the established frameworks that govern cell &amp; gene therapy.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {STANDARDS.map((g) => (
            <div key={g.key} className="card p-5">
              <div className="flex items-center gap-2">
                <span className="icon-tile h-9 w-9"><Icon name={g.icon as IconName} className="h-5 w-5" /></span>
                <h3 className="font-display text-base font-bold text-ink-900">{g.title}</h3>
              </div>
              <ul className="mt-3 space-y-2">
                {g.items.map((it) => (
                  <li key={it.label} className="text-sm">
                    <span className="font-semibold text-clay-700">{it.label}</span>
                    <span className="text-ink-700/70"> — {it.note}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Registry */}
      <section className="container-x pb-14">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-2xl font-extrabold text-ink-900">Coded protocol registry</h2>
          <input
            value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Search code, therapy, condition…"
            className="input w-full max-w-xs"
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {(['ALL', ...CATEGORIES.map((c) => c.key)] as (Category | 'ALL')[]).map((k) => (
            <button
              key={k} type="button" onClick={() => setCat(k)}
              className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold transition ${cat === k ? 'border-clay-500 bg-clay-500 text-white' : 'border-cream-300 bg-white text-ink-800 hover:border-clay-400'}`}
            >
              {k === 'ALL' ? `All (${PROTOCOLS.length})` : `${k} · ${counts[k] || 0}`}
            </button>
          ))}
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => <ProtocolCard key={p.code} p={p} />)}
        </div>
        {list.length === 0 && <p className="mt-6 text-ink-700/60">No protocols match that search.</p>}

        <p className="mt-8 rounded-2xl border border-cream-300 bg-cream-50 p-4 text-xs italic text-ink-700/60">{DISCLAIMER}</p>
      </section>
    </div>
  );
}

function ProtocolCard({ p }: { p: Protocol }) {
  const c = CATEGORIES.find((x) => x.key === p.category)!;
  return (
    <Link to={`/protocols/${p.code}`} className="card group flex flex-col p-5 transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-center justify-between">
        <span className="rounded-lg px-2 py-0.5 font-mono text-sm font-bold text-white" style={{ background: c.accent }}>{p.code}</span>
        <span className={`chip ${p.status === 'established' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
          {p.status === 'established' ? 'Established' : 'Investigational'}
        </span>
      </div>
      <h3 className="mt-2 font-display text-base font-bold text-ink-900 group-hover:text-clay-700">{p.name}</h3>
      <p className="mt-1 line-clamp-2 text-sm text-ink-700/70">{p.indication}</p>
      {p.regions && <p className="mt-2 text-[11px] font-semibold text-ink-700/45">📍 {p.regions}</p>}
      <div className="mt-3 flex items-center gap-2 text-xs text-ink-700/55">
        <span style={{ color: c.accent }}><Icon name={c.icon as IconName} className="h-4 w-4" /></span>
        {c.name}
        {p.detailed && <span className="ml-auto rounded-full bg-clay-50 px-2 py-0.5 font-semibold text-clay-700">Full protocol ✓</span>}
      </div>
    </Link>
  );
}
