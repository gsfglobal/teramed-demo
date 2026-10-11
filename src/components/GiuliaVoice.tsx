import { useCallback, useEffect, useRef, useState } from 'react';
import { Mic, PhoneOff, ExternalLink } from 'lucide-react';
import { site } from '../config/site';
import { track } from '../lib/analytics';

type Stato = 'pronta' | 'collego' | 'ascolta' | 'parla' | 'finita';
type Riga = { chi: 'giulia' | 'tu'; testo: string };
type Sessione = { endSession: () => Promise<void> | void; getInputVolume: () => number; getOutputVolume: () => number };

const IDEE = [
  'Vorrei prenotare una prima visita martedì mattina.',
  'Sono già paziente, vorrei una seduta di igiene la settimana prossima.',
  'Ho un forte mal di denti, è urgente.',
];

/** Conversazione vocale dal browser con Giulia (agente demo configurato per Teramed). */
export function GiuliaVoice({ variant = 'panel' }: { variant?: 'panel' | 'page' | 'dialog' }) {
  const [stato, setStato] = useState<Stato>('pronta');
  const [errore, setErrore] = useState('');
  const [resto, setResto] = useState(site.giulia.durataSec);
  const [righe, setRighe] = useState<Riga[]>([]);
  const conv = useRef<Sessione | null>(null);
  const orb = useRef<HTMLDivElement>(null);
  const raf = useRef(0);
  const timer = useRef<number | null>(null);
  const log = useRef<HTMLDivElement>(null);
  const inIframe = typeof window !== 'undefined' && window.self !== window.top;

  const pulisci = useCallback(() => {
    if (timer.current) window.clearInterval(timer.current);
    timer.current = null;
    cancelAnimationFrame(raf.current);
    if (orb.current) orb.current.style.transform = '';
    conv.current = null;
  }, []);

  const termina = useCallback(
    (nuovoStato: Stato = 'finita') => {
      const c = conv.current;
      pulisci();
      setStato(nuovoStato);
      if (c) {
        try {
          void c.endSession();
        } catch {
          /* già chiusa */
        }
      }
    },
    [pulisci],
  );

  useEffect(() => () => termina('pronta'), [termina]);
  useEffect(() => {
    log.current?.scrollTo({ top: log.current.scrollHeight });
  }, [righe]);

  const anima = useCallback(() => {
    const c = conv.current;
    if (c && orb.current) {
      let v = 0;
      try {
        v = Math.max(c.getOutputVolume(), c.getInputVolume() * 0.7);
      } catch {
        v = 0;
      }
      orb.current.style.transform = `scale(${(1 + Math.min(v, 1) * 0.32).toFixed(3)})`;
    }
    raf.current = requestAnimationFrame(anima);
  }, []);

  const avvia = async () => {
    if (stato === 'collego') return;
    setErrore('');
    setRighe([]);
    setStato('collego');
    track('cta_giulia', { from: `voce-${variant}`, stato: 'avvio' });
    try {
      const s = await navigator.mediaDevices.getUserMedia({ audio: true });
      s.getTracks().forEach((t) => t.stop());
    } catch {
      setStato('pronta');
      setErrore(
        inIframe
          ? 'Da questa anteprima il microfono non è disponibile. Apri la pagina pubblica di Giulia per parlarle.'
          : 'Per parlare con Giulia serve il microfono: consentilo nelle impostazioni del browser e riprova.',
      );
      return;
    }
    try {
      const { Conversation } = await import('@elevenlabs/client');
      const c = (await Conversation.startSession({
        agentId: site.giulia.agentId!,
        connectionType: 'webrtc',
        onConnect: () => {
          setStato('ascolta');
          const inizio = Date.now();
          setResto(site.giulia.durataSec);
          timer.current = window.setInterval(() => {
            const r = site.giulia.durataSec - Math.floor((Date.now() - inizio) / 1000);
            setResto(r);
            if (r <= 0) termina('finita');
          }, 1000);
          raf.current = requestAnimationFrame(anima);
        },
        onDisconnect: () => {
          if (conv.current) {
            pulisci();
            setStato('finita');
          }
        },
        onModeChange: ({ mode }) => setStato((s) => (s === 'collego' || s === 'finita' ? s : mode === 'speaking' ? 'parla' : 'ascolta')),
        onMessage: (p) => {
          if (!p?.message) return;
          const chi: Riga['chi'] = p.source === 'ai' || (p.role as string) === 'agent' ? 'giulia' : 'tu';
          setRighe((r) => [...r.slice(-30), { chi, testo: p.message }]);
        },
        onError: () => setErrore('La chiamata si è interrotta. Riprova tra poco.'),
      })) as unknown as Sessione;
      conv.current = c;
    } catch {
      pulisci();
      setStato('pronta');
      setErrore('Giulia non è raggiungibile in questo momento. Riprova tra qualche minuto.');
    }
  };

  const attiva = stato === 'ascolta' || stato === 'parla';
  const etichetta: Record<Stato, string> = {
    pronta: 'Tocca il pulsante e parla con Giulia',
    collego: 'Mi collego…',
    ascolta: 'Giulia ti ascolta',
    parla: 'Giulia sta parlando',
    finita: 'Chiamata terminata',
  };
  const mm = Math.max(0, Math.floor(resto / 60));
  const ss = Math.max(0, resto % 60);
  const big = variant === 'page';

  return (
    <div className="grid gap-5">
      <div className="flex flex-col items-center text-center">
        <div className="relative grid place-items-center" style={{ width: big ? 168 : 120, height: big ? 168 : 120 }}>
          <div aria-hidden="true" className={`absolute inset-0 rounded-full ${attiva ? 'halo-anim' : ''}`} style={{ background: 'radial-gradient(circle, rgba(26,167,230,.28), transparent 68%)' }} />
          <div
            ref={orb}
            aria-hidden="true"
            className="relative rounded-full transition-transform duration-100"
            style={{
              width: big ? 104 : 76,
              height: big ? 104 : 76,
              background: 'radial-gradient(circle at 35% 30%, #bfe9ff 0%, #1aa7e6 45%, #0a6b9a 100%)',
              boxShadow: attiva ? '0 0 40px rgba(26,167,230,.55)' : '0 0 18px rgba(26,167,230,.25)',
            }}
          />
        </div>
        <p className="display mt-3 text-[1.7rem]">Giulia</p>
        <p className="text-[0.92rem] text-[var(--on-dark-muted)]" aria-live="polite">
          {etichetta[stato]}
          {attiva && (
            <span className="tabnum">
              {' '}· ancora {mm}:{String(ss).padStart(2, '0')}
            </span>
          )}
        </p>
      </div>

      <button
        type="button"
        onClick={() => (attiva || stato === 'collego' ? termina('finita') : avvia())}
        className={`btn btn-lg mx-auto w-full max-w-[320px] ${attiva || stato === 'collego' ? 'btn-outline-light' : 'btn-sky'}`}
      >
        {attiva || stato === 'collego' ? <PhoneOff size={18} /> : <Mic size={18} />}
        {attiva || stato === 'collego' ? 'Termina la chiamata' : stato === 'finita' ? 'Parla di nuovo con Giulia' : 'Parla con Giulia'}
      </button>

      {errore && (
        <div role="alert" className="rounded-2xl border border-[rgba(26,167,230,0.35)] bg-[rgba(26,167,230,0.08)] p-4 text-[0.92rem]">
          <p>{errore}</p>
          {inIframe && (
            <a className="tlink mt-2 inline-flex items-center gap-1.5 text-[var(--sky)]" href={site.giulia.paginaPubblica} target="_blank" rel="noopener noreferrer">
              Apri la pagina di Giulia <ExternalLink size={14} />
            </a>
          )}
        </div>
      )}

      {righe.length > 0 ? (
        <div ref={log} className="max-h-[220px] overflow-y-auto rounded-2xl bg-[rgba(255,255,255,0.04)] p-4 text-[0.92rem]" aria-live="polite">
          {righe.map((r, i) => (
            <p key={i} className={`py-1 ${r.chi === 'giulia' ? 'text-[var(--on-dark)]' : 'text-[var(--on-dark-muted)]'}`}>
              <span className="mr-2 font-medium text-[var(--sky)]">{r.chi === 'giulia' ? 'Giulia' : 'Tu'}</span>
              {r.testo}
            </p>
          ))}
        </div>
      ) : (
        <div className="grid gap-2 rounded-2xl bg-[rgba(255,255,255,0.04)] p-4 text-[0.9rem] text-[var(--on-dark-muted)]">
          <p className="text-[var(--on-dark)]">Prova a dire:</p>
          {IDEE.map((t) => (
            <p key={t}>«{t}»</p>
          ))}
        </div>
      )}

      <p className="text-[0.8rem] leading-relaxed text-[var(--on-dark-muted)]">
        Serve il microfono. Giulia è un’assistente virtuale e la conversazione può essere registrata. Gli appuntamenti fissati in questa prova finiscono nell’agenda dimostrativa del centro, non in quella reale. Demo di {Math.round(site.giulia.durataSec / 60)} minuti.
      </p>
    </div>
  );
}
