/**
 * Shared state for the persistent signal system.
 * Sections declare `data-signal="<mode>"`; Fx.tsx observes visibility and
 * updates the mode; SignalCanvas reads it every frame.
 */

export type SignalMode =
  | "dormant" // calm sparse field (nav / first paint)
  | "overlap" // communities form, two overlap (hero resolved state)
  | "divide" // field separates toward brand / creator territories
  | "flow" // intelligence process: particles stream through beats
  | "quiet" // near-invisible (work, recognition, ecosystem)
  | "settle"; // calm return (footer)

let mode: SignalMode = "dormant";
const listeners = new Set<(m: SignalMode) => void>();

export function setSignalMode(next: SignalMode) {
  if (next === mode) return;
  mode = next;
  listeners.forEach((fn) => fn(next));
}

export function getSignalMode(): SignalMode {
  return mode;
}

export function onSignalMode(fn: (m: SignalMode) => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
