export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let webgl: boolean | null = null;
export function hasWebGL() {
  if (webgl !== null) return webgl;
  if (/[?&]nogl\b/.test(location.search)) return (webgl = false); // solo per test
  try {
    const c = document.createElement('canvas');
    webgl = !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    webgl = false;
  }
  return webgl;
}

export function quality(): 'high' | 'low' {
  if (typeof window === 'undefined') return 'low';
  const small = window.innerWidth < 768;
  const cores = navigator.hardwareConcurrency || 4;
  return small || cores <= 4 ? 'low' : 'high';
}

export const isMobile = () => typeof window !== 'undefined' && window.innerWidth < 768;
