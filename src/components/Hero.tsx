import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone } from 'lucide-react';
import { PrenotaButton, PhoneLink } from './Cta';
import { site } from '../config/site';
import { gsap } from '../lib/motion';
import { hasWebGL, prefersReducedMotion, quality } from '../lib/env';
import { heroAnimEnd, heroAnimStart, type HeroAnim } from '../three/heroAnim';
import fallbackImg from '../assets/renders/arcate.webp';

const Hero3D = lazy(() => import('../three/Hero3D'));

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const reduced = prefersReducedMotion();
  const anim = useRef<HeroAnim>(reduced ? heroAnimEnd() : heroAnimStart());
  const pointer = useRef({ x: 0, y: 0 });
  const scroll = useRef(0);
  const [gl] = useState(() => hasWebGL());
  const [layout, setLayout] = useState<'side' | 'stack'>(() => (window.innerWidth >= 1024 ? 'side' : 'stack'));

  useEffect(() => {
    const onResize = () => setLayout(window.innerWidth >= 1024 ? 'side' : 'stack');
    const onScroll = () => {
      const h = root.current?.offsetHeight || 1;
      scroll.current = Math.min(1, Math.max(0, window.scrollY / h));
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const lines = el.querySelectorAll('.hl > span');
    const after = el.querySelectorAll('.h-after');
    if (reduced) return;
    const a = anim.current;
    const ctx = gsap.context(() => {
      gsap.set(lines, { yPercent: 112 });
      gsap.set(after, { autoAlpha: 0, y: 16 });
      const tl = gsap.timeline({ defaults: { ease: 'power3.inOut' } });
      tl.to(a, { line: 1, duration: 0.3, ease: 'power1.out' }, 0)
        .to(a, { draw: 1, duration: 0.9, ease: 'power2.inOut' }, 0.05)
        .to(a, { pull: 1, duration: 1.5 }, 0.55)
        .to(a, { build: 1, duration: 1.2, ease: 'power2.out' }, 0.85)
        .to(a, { gum: 1, duration: 0.45, ease: 'power1.inOut' }, 1.0)
        .to(a, { line: 0, duration: 0.5, ease: 'power1.in' }, 1.15)
        .to(a, { slide: 1, duration: 1.0 }, 1.4)
        .to(lines, { yPercent: 0, duration: 1.0, stagger: 0.12, ease: 'power4.out' }, gl ? 1.85 : 0.1)
        .to(after, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out' }, gl ? 2.15 : 0.4);
      if (!gl) tl.progress(1);
      const at = import.meta.env.DEV ? new URLSearchParams(location.search).get('introAt') : null; // solo test
      if (at) tl.progress(Number(at)).pause();
    }, el);
    return () => ctx.revert();
  }, [gl, reduced]);

  const onPointer = (e: React.PointerEvent) => {
    const r = root.current!.getBoundingClientRect();
    pointer.current.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    pointer.current.y = ((e.clientY - r.top) / r.height) * 2 - 1;
  };

  return (
    <section ref={root} onPointerMove={onPointer} className="relative isolate overflow-hidden" aria-labelledby="hero-title">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(60% 55% at 72% 52%, rgba(221,238,246,0.85), transparent 70%), radial-gradient(40% 40% at 10% 90%, rgba(238,242,242,0.9), transparent 70%)',
        }}
      />
      <div className="absolute inset-0 -z-10">
        {gl ? (
          <Suspense fallback={null}>
            <Hero3D anim={anim} pointer={pointer} scroll={scroll} layout={layout} quality={quality()} />
          </Suspense>
        ) : (
          <img src={fallbackImg} alt="" className="absolute bottom-6 right-0 w-[min(760px,92vw)] object-contain lg:bottom-auto lg:right-[2vw] lg:top-1/2 lg:-translate-y-1/2" />
        )}
      </div>

      <div className="wrap flex min-h-[100svh] flex-col pb-10 pt-[calc(var(--header-h)+28px)] lg:justify-center lg:pb-16 lg:pt-[var(--header-h)]">
        <div className="max-w-[640px] lg:max-w-[min(780px,56vw)]">
          <p className="kicker h-after">Centro Medico Dentistico a Montella (AV)</p>
          <h1 id="hero-title" className="display t-hero mt-4">
            <span className="hl line-mask">
              <span>Abbiamo a cuore</span>
            </span>
            <span className="hl line-mask">
              <span>il tuo sorriso.</span>
            </span>
          </h1>
          <p className="lead h-after mt-6 max-w-[34rem]">Un percorso di cura che mette al centro la persona, dalla prevenzione ai trattamenti odontoiatrici.</p>
          <div className="h-after mt-8 flex flex-wrap gap-3">
            <PrenotaButton size="lg" from="hero" />
            <Link to="/centro" className="btn btn-ghost btn-lg bg-[rgba(250,249,246,0.6)] backdrop-blur">
              Scopri il centro
            </Link>
          </div>
        </div>
        <div className="flex-1 lg:hidden" />
        <div className="h-after mt-10 hidden flex-wrap items-center gap-x-8 gap-y-2 text-[0.95rem] text-[var(--muted)] lg:absolute lg:flex lg:bottom-8 lg:left-0 lg:right-0 lg:mx-auto lg:max-w-[var(--maxw)] lg:px-[var(--gutter)]">
          <span className="inline-flex items-center gap-2">
            <MapPin size={16} className="text-[var(--sky-deep)]" />
            {site.indirizzo.via}, {site.indirizzo.citta}
          </span>
          <span className="inline-flex items-center gap-2">
            <Phone size={16} className="text-[var(--sky-deep)]" />
            <PhoneLink from="hero" />
          </span>
          <span className="hidden lg:inline">Prenotazione online su AlfaDocs</span>
        </div>
      </div>
    </section>
  );
}
