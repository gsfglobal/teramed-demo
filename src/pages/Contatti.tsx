import { useState, type FormEvent } from 'react';
import { CalendarCheck, Phone, Info, PhoneCall } from 'lucide-react';
import { ContactInfo, MapCard, PageHero, SectionHead } from '../components/Sections';
import { GiuliaButton, PrenotaButton, WhatsAppButton, WhatsAppIcon } from '../components/Cta';
import { site, waLink } from '../config/site';
import { useSeo } from '../lib/seo';
import { track } from '../lib/analytics';

export default function Contatti() {
  useSeo(
    'Contatti e prenotazioni | Teramed, dentista a Montella',
    'Prenota una visita al Centro Medico Dentistico Teramed di Montella (AV): prenotazione online AlfaDocs, telefono 0827 601732, WhatsApp, indirizzo e orari.',
  );
  const [sent, setSent] = useState(false);
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    track('form_demo');
    setSent(true);
  };

  const cards = [
    {
      icon: <CalendarCheck size={24} strokeWidth={1.4} />,
      t: 'Prenotazione online',
      d: 'Scegli giorno, orario e professionista su AlfaDocs, la piattaforma usata dal centro.',
      action: <PrenotaButton from="contatti-card" />,
      dark: true,
    },
    {
      icon: <Phone size={24} strokeWidth={1.4} />,
      t: 'Telefono',
      d: site.contatti.telefono.display,
      action: (
        <a className="btn btn-ghost" href={site.contatti.telefono.href} onClick={() => track('cta_telefono', { from: 'contatti-card' })}>
          <Phone size={17} /> Chiama lo studio
        </a>
      ),
    },
    {
      icon: <WhatsAppIcon size={24} className="text-[#1faa59]" />,
      t: 'WhatsApp',
      d: site.contatti.whatsapp.display,
      action: <WhatsAppButton from="contatti-card" />,
    },
    {
      icon: <PhoneCall size={24} strokeWidth={1.4} className="text-[var(--sky)]" />,
      t: 'Giulia, assistente virtuale',
      d: 'Prova l’assistente virtuale AI. Funzione dimostrativa di Dental Go.',
      action: <GiuliaButton from="contatti-card" />,
    },
  ];

  return (
    <>
      <PageHero kicker="Contatti e prenotazioni" title="Prenota una visita." lead="Online su AlfaDocs in qualsiasi momento, oppure al telefono e su WhatsApp. Per un’emergenza sanitaria chiama il 112." />

      <section className="pb-20 md:pb-28" aria-label="Modi per contattare il centro">
        <div className="wrap grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c, i) => (
            <div
              key={c.t}
              className={`reveal flex flex-col rounded-[26px] border p-6 md:p-7 ${c.dark ? 'on-dark border-transparent' : 'border-[var(--line)] bg-white'}`}
              style={{ ['--d' as string]: `${i * 0.06}s` }}
            >
              <div className={`grid h-12 w-12 place-items-center rounded-full ${c.dark ? 'bg-[rgba(26,167,230,0.14)] text-[var(--sky)]' : 'bg-[var(--porcelain)]'}`}>{c.icon}</div>
              <h2 className="display mt-6 text-[1.7rem] leading-tight">{c.t}</h2>
              <p className={`mt-2 flex-1 ${c.dark ? 'text-[var(--on-dark-muted)]' : 'muted'} ${i === 1 || i === 2 ? 'tabnum select-all text-[1.25rem] text-[var(--ink)]' : ''}`}>{c.d}</p>
              <div className="mt-6 [&_.btn]:w-full">{c.action}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[var(--porcelain)] py-20 md:py-28" aria-labelledby="dove-title">
        <div className="wrap grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:items-start">
          <div>
            <SectionHead kicker="Dove siamo" title="Indirizzo e orari." id="dove-title" />
            <div className="reveal mt-10">
              <ContactInfo />
            </div>
          </div>
          <div className="reveal">
            <MapCard />
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28" aria-labelledby="form-title">
        <div className="wrap grid gap-12 lg:grid-cols-[1fr_1.3fr]">
          <SectionHead kicker="Richiesta di informazioni" title="Scrivici, ti ricontattiamo." id="form-title">
            Per domande generiche. Non inserire informazioni sulla tua salute: ne parlerai con il dentista durante la visita.
          </SectionHead>
          <form onSubmit={onSubmit} className="reveal grid gap-5" noValidate={false}>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="field">
                <label htmlFor="f-nome">Nome e cognome</label>
                <input id="f-nome" name="nome" autoComplete="name" required />
              </div>
              <div className="field">
                <label htmlFor="f-tel">Telefono</label>
                <input id="f-tel" name="telefono" type="tel" autoComplete="tel" inputMode="tel" required />
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="field">
                <label htmlFor="f-email">Email (facoltativa)</label>
                <input id="f-email" name="email" type="email" autoComplete="email" />
              </div>
              <div className="field">
                <label htmlFor="f-fascia">Quando preferisci essere ricontattato</label>
                <select id="f-fascia" name="fascia" defaultValue="mattina">
                  <option value="mattina">Mattina</option>
                  <option value="pomeriggio">Pomeriggio</option>
                  <option value="indifferente">Indifferente</option>
                </select>
              </div>
            </div>
            <div className="field">
              <label htmlFor="f-motivo">Motivo della richiesta</label>
              <select id="f-motivo" name="motivo" defaultValue="prima-visita">
                <option value="prima-visita">Prima visita</option>
                <option value="igiene">Igiene e prevenzione</option>
                <option value="info">Informazioni generali</option>
                <option value="convenzioni">Convenzioni</option>
                <option value="altro">Altro</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="f-msg">Messaggio</label>
              <textarea id="f-msg" name="messaggio" rows={4} placeholder="Scrivi qui la tua domanda, senza dati sanitari." />
            </div>
            <label className="flex items-start gap-3 text-[0.92rem]">
              <input id="f-privacy" type="checkbox" required className="mt-1 h-5 w-5 shrink-0 accent-[var(--sky-deep)]" />
              <span className="muted">Ho letto l’informativa privacy e acconsento a essere ricontattato dal centro per rispondere a questa richiesta. <span className="tbc ml-1">informativa da collegare</span></span>
            </label>
            <div className="flex flex-wrap items-center gap-4">
              <button type="submit" className="btn btn-primary btn-lg">Invia la richiesta</button>
              <a className="tlink text-[0.95rem]" href={waLink()} target="_blank" rel="noopener noreferrer">
                Preferisci WhatsApp?
              </a>
            </div>
            {sent && (
              <div role="status" className="flex items-start gap-3 rounded-2xl border border-dashed border-[rgba(10,107,154,0.45)] bg-[rgba(221,238,246,0.5)] p-4 text-[0.95rem]">
                <Info size={18} className="mt-0.5 shrink-0 text-[var(--sky-deep)]" />
                <p>Modulo dimostrativo: nessun dato è stato inviato. Nella versione online la richiesta arriverà alla segreteria del centro.</p>
              </div>
            )}
          </form>
        </div>
      </section>
    </>
  );
}
