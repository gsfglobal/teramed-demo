import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, CalendarCheck, PhoneCall, MapPin, Clock } from 'lucide-react';
import { Logo } from './Logo';
import { PrenotaButton, WhatsAppIcon, useGiulia, PhoneLink } from './Cta';
import { site, waLink, indirizzoBreve } from '../config/site';
import { track } from '../lib/analytics';
import { gsap, scrollToTop, ScrollTrigger } from '../lib/motion';
import { prefersReducedMotion } from '../lib/env';

const NAV = [
  { to: '/centro', label: 'Il centro' },
  { to: '/trattamenti', label: 'Trattamenti' },
  { to: '/implantologia', label: 'Implantologia' },
  { to: '/team', label: 'Il team' },
  { to: '/contatti', label: 'Contatti' },
];

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const loc = useLocation();
  useEffect(() => setOpen(false), [loc.pathname]);
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      setHidden(y > 320 && y > last + 4 ? true : y < last - 4 ? false : (h) => h);
      last = y;
    };
    // setHidden accetta funzioni: normalizzo
    const handler = () => onScroll();
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);
  // pagine con sfondo scuro in alto: header chiaro finché non si scorre
  const dark = loc.pathname === '/giulia' && !scrolled && !open;

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 transition-[transform,background-color,box-shadow] duration-500"
        style={{
          paddingTop: 'env(safe-area-inset-top, 0px)',
          transform: hidden && !open ? 'translateY(-110%)' : 'none',
          background: scrolled || open ? 'rgba(250,249,246,0.86)' : 'transparent',
          backdropFilter: scrolled ? 'saturate(1.4) blur(14px)' : undefined,
          WebkitBackdropFilter: scrolled ? 'saturate(1.4) blur(14px)' : undefined,
          boxShadow: scrolled ? '0 1px 0 var(--line)' : 'none',
        }}
      >
        <div className="wrap flex h-[var(--header-h)] items-center justify-between gap-6">
          <Link to="/" className="block shrink-0" aria-label="Teramed, torna alla home">
            <Logo className="h-[46px] w-auto md:h-[54px]" tone={dark ? 'dark' : 'light'} />
          </Link>
          <nav aria-label="Principale" className={`hidden lg:block ${dark ? 'text-[var(--on-dark)]' : ''}`}>
            <ul className="flex items-center gap-7 text-[0.97rem]">
              {NAV.map((n) => (
                <li key={n.to}>
                  <NavLink to={n.to} className={({ isActive }) => `tlink ${isActive ? 'text-[var(--sky-deep)]' : ''}`} style={({ isActive }) => (isActive ? { backgroundSize: '100% 1px' } : undefined)}>
                    {n.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <PrenotaButton size="sm" from="header" className={dark ? 'btn-light' : 'btn-primary'} />
            </div>
            <button
              type="button"
              className={`grid h-11 w-11 place-items-center rounded-full border lg:hidden ${dark ? 'border-[var(--line-dark)] text-[var(--on-dark)]' : 'border-[var(--line)]'}`}
              aria-expanded={open}
              aria-controls="menu-mobile"
              aria-label={open ? 'Chiudi il menu' : 'Apri il menu'}
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>
      <div
        id="menu-mobile"
        hidden={!open}
        className="fixed inset-0 z-40 bg-[var(--paper)] lg:hidden"
        style={{ paddingTop: 'calc(var(--header-h) + env(safe-area-inset-top, 0px))' }}
      >
        <nav aria-label="Menu mobile" className="wrap flex h-full flex-col pb-28 pt-6">
          <ul className="grid gap-1">
            <li>
              <NavLink to="/" end className="display block py-2 text-[2.3rem]">Home</NavLink>
            </li>
            {NAV.map((n) => (
              <li key={n.to}>
                <NavLink to={n.to} className={({ isActive }) => `display block py-2 text-[2.3rem] ${isActive ? 'text-[var(--sky-deep)]' : ''}`}>
                  {n.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="mt-auto grid gap-2 text-[var(--muted)]">
            <p>
              Telefono <PhoneLink from="menu" className="tlink text-[var(--ink)]" />
            </p>
            <p>{indirizzoBreve()}</p>
          </div>
        </nav>
      </div>
    </>
  );
}

function MobileActionBar() {
  const { open } = useGiulia();
  const item = 'flex min-h-[52px] flex-1 flex-col items-center justify-center gap-1 rounded-2xl text-[0.78rem] font-medium tracking-[0.01em]';
  return (
    <nav
      aria-label="Azioni rapide"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--line)] bg-[rgba(250,249,246,0.94)] backdrop-blur-xl md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="flex gap-1.5 px-2 py-2">
        <a className={`${item} bg-[var(--ink)] text-white`} href={site.prenotazione.alfadocsUrl} target="_blank" rel="noopener noreferrer" onClick={() => track('cta_prenota', { from: 'barra-mobile' })}>
          <CalendarCheck size={19} strokeWidth={1.7} aria-hidden="true" />
          Prenota
        </a>
        <a className={`${item} border border-[var(--line)] bg-white`} href={waLink()} target="_blank" rel="noopener noreferrer" onClick={() => track('cta_whatsapp', { from: 'barra-mobile' })}>
          <WhatsAppIcon size={19} className="text-[#1faa59]" />
          WhatsApp
        </a>
        <button type="button" className={`${item} border border-[rgba(26,167,230,0.4)] bg-[var(--abyss)] text-white`} onClick={() => open('barra-mobile')}>
          <PhoneCall size={18} strokeWidth={1.7} className="text-[var(--sky)]" aria-hidden="true" />
          Giulia
        </button>
      </div>
    </nav>
  );
}

function WhatsAppFloat() {
  return (
    <a
      href={waLink()}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track('cta_whatsapp', { from: 'flottante' })}
      className="group fixed bottom-6 right-6 z-40 hidden items-center gap-0 overflow-hidden rounded-full border border-[var(--line)] bg-white/95 p-3 text-[var(--ink)] shadow-[0_14px_40px_-18px_rgba(20,33,42,0.45)] backdrop-blur transition-all duration-500 hover:gap-2 hover:pr-5 md:flex"
      aria-label="Scrivici su WhatsApp"
    >
      <WhatsAppIcon size={24} className="text-[#1faa59]" />
      <span className="max-w-0 whitespace-nowrap text-[0.95rem] font-medium opacity-0 transition-all duration-500 group-hover:max-w-[200px] group-hover:opacity-100">Scrivici su WhatsApp</span>
    </a>
  );
}

function Footer() {
  const tbc = site.demo.mostraDaConfermare;
  return (
    <footer className="on-dark relative overflow-hidden pt-20 md:pt-28">
      <div className="wrap">
        <div className="grid gap-12 md:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <Logo tone="dark" className="h-[76px] w-auto" />
            <p className="display mt-8 max-w-[14ch] text-[2.1rem] leading-[1.1]">{site.centro.motto}</p>
          </div>
          <div className="grid content-start gap-3 text-[0.98rem]">
            <p className="kicker">Dove siamo</p>
            <p className="flex gap-2">
              <MapPin size={17} className="mt-1 shrink-0 text-[var(--sky)]" />
              <span>
                {indirizzoBreve()}
                {tbc && !site.indirizzo.civico && <span className="tbc ml-2">civico da confermare</span>}
              </span>
            </p>
            <p>
              Telefono <PhoneLink from="footer" className="tlink" />
            </p>
            <p>
              WhatsApp{' '}
              <a className="tlink" href={waLink()} target="_blank" rel="noopener noreferrer">
                {site.contatti.whatsapp.display}
              </a>
            </p>
            <a className="tlink w-fit" href={site.indirizzo.mapsUrl} target="_blank" rel="noopener noreferrer" onClick={() => track('cta_mappa', { from: 'footer' })}>
              Apri in Google Maps
            </a>
          </div>
          <div className="grid content-start gap-3 text-[0.98rem]">
            <p className="kicker flex items-center gap-2">
              <Clock size={15} /> Orari
            </p>
            <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 tabnum">
              {site.orari.giorni.map((g) => (
                <div key={g.giorno} className="contents">
                  <dt className="text-[var(--on-dark-muted)]">{g.giorno}</dt>
                  <dd>{g.orario}</dd>
                </div>
              ))}
            </dl>
            {tbc && site.orari.daConfermare && <span className="tbc w-fit">orari da confermare</span>}
          </div>
        </div>

        <nav aria-label="Pagine" className="mt-16 flex flex-wrap gap-x-7 gap-y-2 border-t border-[var(--line-dark)] pt-8 text-[0.95rem]">
          <Link className="tlink" to="/">Home</Link>
          {NAV.map((n) => (
            <Link key={n.to} className="tlink" to={n.to}>{n.label}</Link>
          ))}
        </nav>

        <div className="mt-8 grid gap-2 pb-10 text-[0.82rem] leading-relaxed text-[var(--on-dark-muted)]">
          <p>
            {site.centro.ragioneSociale}, {site.centro.tipo}. Direttore sanitario: {site.legale.direttoreSanitario ?? <span className="tbc">da indicare</span>}. P. IVA:{' '}
            {site.legale.piva ?? <span className="tbc">da indicare</span>}. Iscrizione all’Albo: {site.legale.albo ?? <span className="tbc">da indicare</span>}.
          </p>
          <p>Le informazioni di questo sito hanno scopo informativo e non sostituiscono la visita odontoiatrica. Privacy e cookie policy da collegare prima della pubblicazione. Il sito non usa cookie di profilazione.</p>
          <p className="mt-4 text-[var(--on-dark)]">
            {site.demo.label}. Proposta grafica non ancora approvata dal Centro Teramed: dati e immagini da verificare con lo studio.
          </p>
        </div>
      </div>
    </footer>
  );
}

function PageVeil() {
  const loc = useLocation();
  const veil = useRef<HTMLDivElement>(null);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const v = veil.current;
    if (!v || prefersReducedMotion()) {
      scrollToTop();
      ScrollTrigger.refresh();
      return;
    }
    const line = v.querySelector('.veil-line');
    const tl = gsap.timeline();
    tl.set(v, { transformOrigin: 'bottom', scaleY: 1, opacity: 1 })
      .set(line, { scaleX: 0, transformOrigin: 'left' })
      .call(() => scrollToTop())
      .to(line, { scaleX: 1, duration: 0.45, ease: 'power3.inOut' })
      .to(v, { opacity: 0, duration: 0.5, ease: 'power2.out' }, '-=0.05')
      .set(v, { scaleY: 0, opacity: 1 })
      .call(() => ScrollTrigger.refresh());
    const main = document.getElementById('main');
    if (main) gsap.fromTo(main, { y: 18 }, { y: 0, duration: 0.9, ease: 'power3.out', delay: 0.3, clearProps: 'transform' });
    return () => {
      tl.kill();
    };
  }, [loc.pathname]);
  return (
    <div ref={veil} className="page-veil" aria-hidden="true">
      <div className="veil-line" />
    </div>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[90] focus:rounded-full focus:bg-white focus:px-4 focus:py-2">
        Vai al contenuto
      </a>
      <Header />
      <PageVeil />
      <main id="main">{children}</main>
      <Footer />
      <WhatsAppFloat />
      <MobileActionBar />
    </>
  );
}
