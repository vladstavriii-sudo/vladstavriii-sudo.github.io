import Lenis from "./lenis.mjs";

export function initPageScroll() {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const lenis = reducedMotion ? null : new Lenis({
    autoRaf: true,
    lerp: 0.2,
    smoothWheel: true,
    syncTouch: false,
    wheelMultiplier: 1,
    allowNestedScroll: true,
  });
  const navigate = (event) => {
    if (lenis) lenis.scrollTo(event.detail);
    else window.scrollTo(0, event.detail);
  };
  window.addEventListener("noma:navigate", navigate);
  return () => {
    window.removeEventListener("noma:navigate", navigate);
    lenis?.destroy();
  };
}
