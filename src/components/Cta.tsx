import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { CalendarCheck, Phone, X, PhoneCall, Info, Copy, Check } from 'lucide-react';
import { site, waLink } from '../config/site';
import { GiuliaVoice } from './GiuliaVoice';
import { track } from '../lib/analytics';

export function WhatsAppIcon({ size = 18, className = '' }: { size?: number; className?: string }) {
  return (
    <svg className={`wa ${className}`} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.08.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35M12.05 21.79h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.9-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.89 9.88m8.41-18.3A11.81 11.81 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.31-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.9 0-3.18-1.24-6.16-3.49-8.41" />
    </svg>
  );
}

type BtnProps = { className?: string; size?: 'sm' | 'md' | 'lg'; label?: string; from?: string };
const sizeClass = (s?: string) => (s === 'sm' ? 'btn-sm' : s === 'lg' ? 'btn-lg' : '');

export function PrenotaButton({ className = 'btn-primary', size, label = 'Prenota una visita', from = '' }: BtnProps) {
  return (
    <a
      className={`btn ${className} ${sizeClass(size)}`}
      href={site.prenotazione.alfadocsUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track('cta_prenota', { from })}
    >
      <CalendarCheck size={18} strokeWidth={1.6} aria-hidden="true" />
      {label}
      <span className="sr-only"> (si apre AlfaDocs in una nuova scheda)</span>
    </a>
  );
}

export function WhatsAppButton({ className = 'btn-wa', size, label = 'Scrivici su WhatsApp', from = '' }: BtnProps) {
  return (
    <a
      className={`btn ${className} ${sizeClass(size)}`}
      href={waLink()}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track('cta_whatsapp', { from })}
    >
      <WhatsAppIcon />
      {label}
    </a>
  );
}

export function PhoneLink({ className = 'tlink', from = '' }: { className?: string; from?: string }) {
  return (
    <a className={className} href={site.contatti.telefono.href} onClick={() => track('cta_telefono', { from })}>
      {site.contatti.telefono.display}
    </a>
  );
}

/* ------------------------------------------------------------------ Giulia */

const GiuliaCtx = createContext<{ open: (from: string) => void }>({ open: () => {} });
export const useGiulia = () => useContext(GiuliaCtx);

export function GiuliaButton({ className = 'btn-giulia', size, label = 'Chiama Giulia', from = '' }: BtnProps) {
  const { open } = useGiulia();
  return (
    <button type="button" className={`btn ${className} ${sizeClass(size)}`} onClick={() => open(from)} aria-haspopup="dialog">
      <span className="pulse" aria-hidden="true" />
      <PhoneCall size={17} strokeWidth={1.7} aria-hidden="true" />
      {label}
    </button>
  );
}

export function GiuliaProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const configured = !!site.giulia.telefono;

  const open = useCallback((from: string) => {
    track('cta_giulia', { from, stato: site.giulia.telefono ? 'numero' : 'demo' });
    lastFocus.current = document.activeElement as HTMLElement;
    setOpen(true);
  }, []);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (isOpen && !d.open) d.showModal();
    if (!isOpen && d.open) d.close();
    if (!isOpen) lastFocus.current?.focus?.();
  }, [isOpen]);

  const copy = async () => {
    if (!site.giulia.display) return;
    try {
      await navigator.clipboard.writeText(site.giulia.display);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* il numero resta selezionabile */
    }
  };

  return (
    <GiuliaCtx.Provider value={{ open }}>
      {children}
      <dialog
        ref={dialogRef}
        onClose={() => setOpen(false)}
        onClick={(e) => e.target === dialogRef.current && setOpen(false)}
        aria-labelledby="giulia-title"
        className="m-auto max-h-[92svh] w-[min(560px,calc(100vw-32px))] overflow-y-auto rounded-[28px] border-0 p-0 bg-transparent backdrop:bg-[rgba(13,27,36,0.55)] backdrop:backdrop-blur-sm"
      >
        <div className="on-dark relative overflow-hidden rounded-[28px] p-6 sm:p-9">
          <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full" style={{ background: 'radial-gradient(circle, rgba(26,167,230,.28), transparent 65%)' }} />
          <button type="button" onClick={() => setOpen(false)} className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full border border-[var(--line-dark)] text-[var(--on-dark)] hover:border-[var(--on-dark)]" aria-label="Chiudi">
            <X size={18} />
          </button>
          <p className="kicker">Assistente virtuale AI</p>
          <h2 id="giulia-title" className="display t-2 mt-2 pr-10">Chiama Giulia</h2>
          <p className="mt-3 text-[var(--on-dark-muted)]">Prova l’assistente virtuale AI.</p>

          {site.giulia.agentId && isOpen && (
            <div className="mt-6 rounded-2xl border border-[var(--line-dark)] bg-[var(--abyss-2)] p-5">
              <GiuliaVoice variant="dialog" />
            </div>
          )}

          {configured && (
            <div className="mt-4 flex items-center gap-4 rounded-2xl border border-[var(--line-dark)] bg-[var(--abyss-2)] p-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full" style={{ background: 'rgba(26,167,230,.14)' }}>
                <Phone size={20} className="text-[var(--sky)]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-[var(--on-dark-muted)]">Oppure chiama il numero di prova</p>
                <p className="tabnum select-all text-xl font-medium">{site.giulia.display}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <a className="btn btn-sky btn-sm" href={`tel:${site.giulia.telefono}`}>
                  <PhoneCall size={16} /> Chiama
                </a>
                <button type="button" className="btn btn-outline-light btn-sm" onClick={copy}>
                  {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? 'Copiato' : 'Copia'}
                </button>
              </div>
            </div>
          )}

          {!site.giulia.agentId && !configured && (
            <div className="mt-6 rounded-2xl border border-[var(--line-dark)] bg-[var(--abyss-2)] p-4">
              <p className="font-medium">Prova di Giulia non ancora attiva</p>
              <p className="text-sm text-[var(--on-dark-muted)]">Dental Go la attiva dopo aver impostato Giulia con le regole del centro.</p>
            </div>
          )}

          <ul className="mt-6 grid gap-2 text-[0.95rem] text-[var(--on-dark-muted)]">
            <li>Giulia si presenta sempre come assistente virtuale.</li>
            <li>In questa prova fissa la visita in un’agenda dimostrativa, oppure lascia la richiesta alla segreteria.</li>
            <li>Non dà consigli medici e non fa diagnosi.</li>
          </ul>
          <div className="mt-6 flex items-start gap-2 border-t border-[var(--line-dark)] pt-4 text-[0.82rem] text-[var(--on-dark-muted)]">
            <Info size={15} className="mt-[3px] shrink-0" />
            <p>
              Funzione dimostrativa proposta da Dental Go, non ancora adottata dal Centro Teramed.{' '}
              <a className="tlink text-[var(--on-dark)]" href={site.giulia.infoUrl} target="_blank" rel="noopener noreferrer">
                Cos’è Giulia
              </a>
            </p>
          </div>
        </div>
      </dialog>
    </GiuliaCtx.Provider>
  );
}
