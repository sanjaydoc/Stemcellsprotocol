import { useEffect, useState } from 'react';
import SimulatorLocal from './SimulatorLocal';
import SimulatorBrowser from './SimulatorBrowser';
import { checkBackend } from '../api/simulator';

/**
 * Protocol Simulator entry point.
 *  - If a local research backend is running (developer laptop), use the full
 *    server-driven simulator (SimulatorLocal).
 *  - Otherwise (the public site) run the REAL 7-step pipeline entirely in the
 *    browser (SimulatorBrowser) — no backend, genome stays on the device.
 */
export default function Simulator() {
  const [backendReady, setBackendReady] = useState<boolean | null>(null);

  useEffect(() => {
    let alive = true;
    checkBackend().then((ok) => alive && setBackendReady(ok)).catch(() => alive && setBackendReady(false));
    return () => { alive = false; };
  }, []);

  if (backendReady) return <SimulatorLocal />;
  return <SimulatorBrowser />;
}
