import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Camera, Clock, ExternalLink, MapPin, Phone, Star, Navigation, PhoneCall, ShieldCheck } from 'lucide-react';
import { site, team, trattamenti, waLink, indirizzoBreve } from '../config/site';
import { GiuliaButton, PrenotaButton, WhatsAppButton, PhoneLink, WhatsAppIcon } from './Cta';
import { GiuliaVoice } from './GiuliaVoice';
import { track } from '../lib/analytics';
import { prefersReducedMotion } from '../lib/env';

/* -------------------------------------------------- linea del sorriso */
export function SmileRule({ className = '', dark = false }: { className?: string; dark?: boolean }) {
  const ref = useRef<SVGPathElement>(null);
  useEffect(() => {
    const p = ref.current;
    if (!p || prefersReducedMotion() || !('IntersectionObserver' in window)) return;
    const len = p.getTotalLength();
    p.style.strokeDasharray = `${len}`;
    p.style.strokeDashoffset = `${len}`;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          p.style.transition = 'stroke-dashoffset 1.8s cubic-bezier(.2,.7,.1,1)';
          p.style.strokeDashoffset = '0';
          io.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    io.observe(p);
    return () => io.disconnect();
  }, []);
  return (
    <svg className={`smile-rule glow ${className}`} viewBox="0 0 1000 40" preserveAspectRatio="none" aria-hidden="true">
      <path ref={ref} d="M0 6 C 260 6, 330 34, 500 34 S 740 6, 1000 6" style={{ stroke: dark ? 'var(--sky)' : 'var(--sky)', opacity: dark ? 0.9 : 0.75 }} />
    </svg>
  );
}

export function SectionHead({ kicker, title, children, id, dark = false }: { kicker?: string; title: ReactNode; children?: ReactNode; id?: string; dark?: boolean }) {
  return (
    <div className="max-w-[760px]">
      {kicker && <p className="kicker reveal">{kicker}</p>}
      <h2 id={id} className="display t-1 reveal mt-3" style={{ ['--d' as string]: '0.05s' }}>
        {title}
      </h2>
      {children && (
        <div className={`lead reveal mt-5 ${dark ? '' : ''}`} style={{ ['--d' as string]: '0.12s' }}>
          {children}
        </div>
      )}
    </div>
  );
}

export function Tbc({ children = 'da confermare' }: { children?: ReactNode }) {
  if (!site.demo.mostraDaConfermare) return null;
  return <span className="tbc">{children}</span>;
}

/* -------------------------------------------------- trattamenti (lista editoriale) */
export function TreatmentRows() {
  const items = trattamenti.filter((t) => t.confermato);
  return (
    <ul className="hair">
      {items.map((t, i) => (
        <li key={t.id} className="reveal border-b border-[var(--line)]" style={{ ['--d' as string]: `${i * 0.06}s` }}>
          <Link to={`/trattamenti#${t.id}`} className="group grid grid-cols-1 items-baseline gap-2 py-7 md:grid-cols-[1.1fr_1fr_auto] md:gap-10 md:py-9">
            <span className="display text-[clamp(2rem,1.4rem+2.4vw,3.4rem)] leading-none transition-colors duration-500 group-hover:text-[var(--sky-deep)]">{t.nome}</span>
            <span className="muted max-w-[42ch]">{t.sintesi}</span>
            <span className="hidden h-12 w-12 place-items-center rounded-full border border-[var(--line)] transition-all duration-500 group-hover:rotate-45 group-hover:border-[var(--ink)] md:grid" aria-hidden="true">
              <ArrowUpRight size={20} strokeWidth={1.5} />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/* -------------------------------------------------- team (ritratti ad arco) */
export function TeamPortrait({ m, size = 'md' }: { m: (typeof team)[number]; size?: 'md' | 'lg' }) {
  return (
    <figure className="group">
      <div className={`arch-frame reveal-img relative ${size === 'lg' ? 'aspect-[3/4.2]' : 'aspect-[3/4.4]'}`}>
        <img src={m.foto} alt={`${m.titolo} ${m.nome}, ${m.qualifica.toLowerCase()} del Centro Teramed`} loading="lazy" className="h-full w-full object-cover object-top transition-transform duration-[1.2s] ease-[var(--ease)] group-hover:scale-[1.035]" />
      </div>
      <figcaption className="mt-4">
        <p className="display text-[1.55rem] leading-tight">
          {m.titolo} {m.nome}
        </p>
        <p className="muted text-[0.95rem]">{m.qualifica}</p>
      </figcaption>
    </figure>
  );
}

export function TeamStrip() {
  return (
    <div className="-mx-[var(--gutter)] overflow-x-auto px-[var(--gutter)] pb-4 [scrollbar-width:thin]">
      <ul className="grid w-max grid-flow-col gap-5 md:gap-7" style={{ gridAutoColumns: 'clamp(200px, 21vw, 290px)' }}>
        {team.map((m, i) => (
          <li key={m.id} className="reveal" style={{ ['--d' as string]: `${i * 0.07}s`, marginTop: i % 2 ? 'clamp(0px, 4vw, 56px)' : 0 }}>
            <TeamPortrait m={m} />
          </li>
        ))}
      </ul>
    </div>
  );
}

/* -------------------------------------------------- percorso del paziente (sequenza reale) */
const STEPS = [
  { t: 'Prenotazione', d: 'Online su AlfaDocs, al telefono o con un messaggio WhatsApp.' },
  { t: 'Prima visita', d: 'Il dentista ascolta, visita e, se serve, richiede esami diagnostici.' },
  { t: 'Piano di cura', d: 'Ti spieghiamo le possibili soluzioni, i tempi e i costi, prima di iniziare.' },
  { t: 'Trattamento', d: 'Le sedute sono programmate insieme, con indicazioni chiare per ogni fase.' },
  { t: 'Controlli', d: 'Richiami e igiene professionale per mantenere nel tempo il lavoro fatto.' },
];
export function PatientJourney() {
  return (
    <ol className="grid gap-0">
      {STEPS.map((s, i) => (
        <li key={s.t} className="reveal grid grid-cols-[56px_1fr] gap-4 border-t border-[var(--line)] py-6 md:grid-cols-[80px_1fr_1.2fr] md:gap-8 md:py-8" style={{ ['--d' as string]: `${i * 0.06}s` }}>
          <span className="display tabnum text-[2rem] leading-none text-[var(--sky-deep)]">{i + 1}</span>
          <h3 className="display t-3 md:text-[1.9rem]">{s.t}</h3>
          <p className="muted col-start-2 md:col-start-3">{s.d}</p>
        </li>
      ))}
    </ol>
  );
}

/* -------------------------------------------------- gallery con segnaposto */
const SLOTS = [
  { label: 'Ingresso e accoglienza', cls: 'aspect-[4/5] md:aspect-auto md:row-span-2' },
  { label: 'Sala d’attesa', cls: 'aspect-[4/3] md:aspect-auto' },
  { label: 'Studio operativo', cls: 'aspect-[4/3] md:aspect-auto' },
  { label: 'Il team al lavoro', cls: 'aspect-[16/10] md:aspect-auto md:col-span-2' },
];
export function Gallery({ compact = false }: { compact?: boolean }) {
  const slots = compact ? SLOTS.slice(0, 3) : SLOTS;
  return (
    <div className={`grid gap-4 md:gap-5 ${compact ? 'md:grid-cols-3 md:grid-rows-[300px]' : 'md:grid-cols-[1.1fr_1fr_1fr] md:grid-rows-[260px_320px]'}`}>
      {slots.map((s, i) => (
        <figure key={s.label} className={`photo-slot reveal-img ${compact ? 'aspect-[4/3] md:aspect-auto' : s.cls}`} style={{ transitionDelay: `${i * 0.08}s` }}>
          <figcaption className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-3 p-5">
            <span className="display text-[1.35rem] leading-tight">{s.label}</span>
            <span className="tbc shrink-0">
              <Camera size={13} /> foto da inserire
            </span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

/* -------------------------------------------------- recensioni */
export function Reviews({ dark = false }: { dark?: boolean }) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {site.recensioni.map((r, i) => (
        <div key={r.piattaforma} className={`reveal relative overflow-hidden rounded-[28px] p-7 md:p-10 ${dark ? 'bg-[var(--abyss-2)]' : 'bg-white'} border ${dark ? 'border-[var(--line-dark)]' : 'border-[var(--line)]'}`} style={{ ['--d' as string]: `${i * 0.1}s` }}>
          <p className="kicker">Su {r.piattaforma}</p>
          <p className="mt-4 flex items-end gap-3">
            <span className="display tabnum text-[clamp(4.2rem,3rem+5vw,7rem)] leading-[0.85]">{r.valutazione.toLocaleString('it-IT', { minimumFractionDigits: 1 })}</span>
            <span className="muted pb-2 text-[1.1rem]">su {r.scala}</span>
          </p>
          <div className="mt-4 flex gap-1 text-[var(--sky)]" aria-hidden="true">
            {Array.from({ length: 5 }).map((_, k) => (
              <Star key={k} size={18} fill="currentColor" strokeWidth={0} opacity={k < Math.round(r.valutazione) ? 1 : 0.3} />
            ))}
          </div>
          <p className="mt-4 text-[1.05rem]">
            <span className="tabnum font-medium">{r.numero}</span> {r.etichetta}
          </p>
          <p className="muted mt-1 text-[0.9rem]">
            {r.nota} Dato rilevato il {r.rilevatoIl}.
          </p>
          <a className={`btn ${dark ? 'btn-outline-light' : 'btn-ghost'} btn-sm mt-6`} href={r.url} target="_blank" rel="noopener noreferrer" onClick={() => track('cta_recensioni', { piattaforma: r.piattaforma })}>
            Leggi le recensioni <ExternalLink size={15} />
          </a>
        </div>
      ))}
    </div>
  );
}

/* -------------------------------------------------- prenotazione */
export function BookingBlock() {
  return (
    <div className="grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-end">
      <div>
        <p className="kicker reveal">Prenotazione online</p>
        <h2 className="display t-1 reveal mt-3">Scegli tu giorno e orario della visita.</h2>
        <p className="lead reveal mt-5">Il centro usa AlfaDocs per le prenotazioni online: vedi le disponibilità e ricevi la conferma. Se preferisci, chiama o scrivi su WhatsApp.</p>
      </div>
      <div className="reveal grid gap-3">
        <PrenotaButton size="lg" from="blocco-prenotazione" />
        <WhatsAppButton size="lg" from="blocco-prenotazione" />
        <a className="btn btn-ghost btn-lg" href={site.contatti.telefono.href} onClick={() => track('cta_telefono', { from: 'blocco-prenotazione' })}>
          <Phone size={18} strokeWidth={1.6} /> Chiama lo {site.contatti.telefono.display}
        </a>
      </div>
    </div>
  );
}

/* -------------------------------------------------- Giulia */
export function GiuliaSection() {
  return (
    <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.05fr]">
      <div>
        <p className="kicker reveal">Assistente virtuale AI</p>
        <h2 className="display t-1 reveal mt-3">Un nuovo modo di rispondere ai pazienti.</h2>
        <p className="lead reveal mt-5">Scopri come un’assistente virtuale può supportare la gestione delle richieste telefoniche. Giulia è già impostata con orari e servizi del centro: parlale dal browser.</p>
        <ul className="reveal mt-7 grid gap-3 text-[var(--on-dark-muted)]">
          <li className="flex gap-3"><ShieldCheck size={19} className="mt-1 shrink-0 text-[var(--sky)]" /> Si presenta sempre come assistente virtuale.</li>
          <li className="flex gap-3"><ShieldCheck size={19} className="mt-1 shrink-0 text-[var(--sky)]" /> Fissa la visita in un’agenda di prova o lascia la richiesta alla segreteria.</li>
          <li className="flex gap-3"><ShieldCheck size={19} className="mt-1 shrink-0 text-[var(--sky)]" /> Non dà consigli medici e non fa diagnosi.</li>
        </ul>
        <div className="reveal mt-8 flex flex-wrap gap-3">
          <GiuliaButton size="lg" className="btn-giulia" label="Chiama Giulia e provala" from="sezione-giulia" />
          <Link to="/giulia" className="btn btn-outline-light btn-lg">
            Apri la pagina di Giulia
          </Link>
        </div>
        <p className="reveal mt-5 max-w-[46ch] text-[0.85rem] text-[var(--on-dark-muted)]">
          Funzione dimostrativa: Giulia è un servizio aggiuntivo proposto da Dental Go e non è ancora adottato dal Centro Teramed.
        </p>
      </div>

      <div className="reveal relative mx-auto w-full max-w-[460px]">
        <div aria-hidden="true" className="absolute -inset-10 -z-10 rounded-full" style={{ background: 'radial-gradient(closest-side, rgba(26,167,230,.22), transparent)' }} />
        <div className="rounded-[34px] border border-[var(--line-dark)] bg-[linear-gradient(180deg,#152c3a,#0f202b)] p-6 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.7)] md:p-8">
          <div className="mb-4 flex items-center justify-between text-[0.85rem] text-[var(--on-dark-muted)]">
            <span>Prova dal vivo</span>
            <span className="tbc">demo con agenda di prova</span>
          </div>
          {site.giulia.agentId ? (
            <GiuliaVoice variant="panel" />
          ) : (
            <p className="text-[var(--on-dark-muted)]">La prova vocale si attiva quando Dental Go imposta Giulia per il centro.</p>
          )}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------- contatti: mappa stilizzata */
export function MapCard() {
  return (
    <a
      href={site.indirizzo.mapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track('cta_mappa', { from: 'mappa' })}
      className="group relative block overflow-hidden rounded-[28px] border border-[var(--line)] bg-[var(--porcelain)]"
      aria-label="Apri la posizione del centro in Google Maps"
    >
      <svg viewBox="0 0 600 420" className="block h-auto w-full" aria-hidden="true">
        <defs>
          <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M30 0H0V30" fill="none" stroke="rgba(20,33,42,0.06)" />
          </pattern>
        </defs>
        <rect width="600" height="420" fill="url(#grid)" />
        <path d="M-20 300 C 120 260, 200 330, 330 280 S 520 160, 640 190" fill="none" stroke="#fff" strokeWidth="22" strokeLinecap="round" />
        <path d="M-20 300 C 120 260, 200 330, 330 280 S 520 160, 640 190" fill="none" stroke="rgba(20,33,42,0.08)" strokeWidth="1" />
        <path d="M180 -20 C 220 120, 260 180, 300 230 S 330 360, 300 460" fill="none" stroke="#fff" strokeWidth="14" strokeLinecap="round" />
        <path d="M420 -20 C 400 80, 380 140, 330 230" fill="none" stroke="#fff" strokeWidth="10" strokeLinecap="round" />
        <path d="M40 120 C 120 90, 190 110, 250 160" fill="none" stroke="rgba(26,167,230,0.28)" strokeWidth="8" strokeLinecap="round" />
        <circle cx="304" cy="232" r="38" fill="rgba(26,167,230,0.14)" />
        <circle cx="304" cy="232" r="9" fill="#0a6b9a" stroke="#fff" strokeWidth="3" />
      </svg>
      <div className="absolute left-5 top-5 rounded-2xl bg-white/90 px-4 py-3 shadow-sm backdrop-blur">
        <p className="font-medium">{site.centro.nome}</p>
        <p className="muted text-[0.9rem]">{site.indirizzo.via}, {site.indirizzo.citta}</p>
      </div>
      <span className="btn btn-primary btn-sm absolute bottom-5 right-5">
        <Navigation size={15} /> Apri in Google Maps
      </span>
      <span className="absolute bottom-5 left-5 text-[0.75rem] text-[var(--muted)]">Mappa stilizzata</span>
    </a>
  );
}

export function ContactInfo() {
  return (
    <div className="grid gap-8">
      <div className="grid gap-2">
        <p className="kicker flex items-center gap-2"><MapPin size={15} /> Indirizzo</p>
        <p className="text-[1.15rem]">{indirizzoBreve()}</p>
        {!site.indirizzo.civico && <Tbc>civico da confermare: le fonti indicano {site.indirizzo.civiciTrovati.join(' e ')}</Tbc>}
      </div>
      <div className="grid gap-2">
        <p className="kicker flex items-center gap-2"><Phone size={15} /> Telefono e WhatsApp</p>
        <p className="text-[1.15rem]">
          <PhoneLink from="contatti" />
        </p>
        <p className="text-[1.15rem]">
          <a className="tlink inline-flex items-center gap-2" href={waLink()} target="_blank" rel="noopener noreferrer" onClick={() => track('cta_whatsapp', { from: 'contatti-testo' })}>
            <WhatsAppIcon size={17} className="text-[#1faa59]" /> {site.contatti.whatsapp.display}
          </a>
        </p>
      </div>
      <div className="grid gap-2">
        <p className="kicker flex items-center gap-2"><Clock size={15} /> Orari</p>
        <dl className="grid max-w-[340px] grid-cols-[1fr_auto] gap-y-1.5 tabnum">
          {site.orari.giorni.map((g) => (
            <div key={g.giorno} className="contents">
              <dt className="muted">{g.giorno}</dt>
              <dd className={g.orario === 'Chiuso' ? 'muted' : ''}>{g.orario}</dd>
            </div>
          ))}
        </dl>
        {site.orari.nota && <p className="muted text-[0.92rem]">{site.orari.nota}</p>}
        {site.orari.daConfermare && <Tbc>orari da confermare ({site.orari.fonte})</Tbc>}
      </div>
    </div>
  );
}

export function CtaBand() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32" aria-labelledby="cta-title">
      <div className="wrap">
        <SmileRule className="mb-14" />
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr] md:items-end">
          <h2 id="cta-title" className="display t-1 reveal">Il primo passo è una visita.</h2>
          <div className="reveal flex flex-wrap gap-3 md:justify-end">
            <PrenotaButton size="lg" from="cta-finale" />
            <WhatsAppButton size="lg" from="cta-finale" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function PageHero({ kicker, title, lead, children, aside }: { kicker: string; title: ReactNode; lead?: ReactNode; children?: ReactNode; aside?: ReactNode }) {
  return (
    <section className="relative overflow-hidden pb-16 pt-[calc(var(--header-h)+56px)] md:pb-24 md:pt-[calc(var(--header-h)+96px)]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10" style={{ background: 'radial-gradient(50% 60% at 85% 20%, rgba(221,238,246,0.8), transparent 70%)' }} />
      <div className="wrap grid gap-12 lg:grid-cols-[1.25fr_1fr] lg:items-end">
        <div>
          <p className="kicker reveal">{kicker}</p>
          <h1 className="display t-hero reveal mt-4 text-[clamp(2.9rem,1.6rem+5vw,6.4rem)]" style={{ ['--d' as string]: '0.05s' }}>
            {title}
          </h1>
          {lead && (
            <p className="lead reveal mt-6" style={{ ['--d' as string]: '0.12s' }}>
              {lead}
            </p>
          )}
          {children && <div className="reveal mt-8 flex flex-wrap gap-3" style={{ ['--d' as string]: '0.18s' }}>{children}</div>}
        </div>
        {aside && <div className="reveal" style={{ ['--d' as string]: '0.2s' }}>{aside}</div>}
      </div>
    </section>
  );
}
