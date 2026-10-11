import { lazy, Suspense, useRef, useState } from 'react';
import { Plus, Move3d } from 'lucide-react';
import { CtaBand, SectionHead, SmileRule } from '../components/Sections';
import { GiuliaButton, PrenotaButton, WhatsAppButton } from '../components/Cta';
import { useSeo } from '../lib/seo';
import { hasWebGL, prefersReducedMotion } from '../lib/env';
import type { ImplantState } from '../three/ImplantModel';
import imgImpianto from '../assets/renders/impianto.webp';

const ImplantViewer3D = lazy(() => import('../three/ImplantViewer3D'));

const PARTS = [
  { t: 'Impianto', d: 'Una piccola vite in titanio inserita nell’osso. Fa da radice artificiale.' },
  { t: 'Moncone', d: 'Il collegamento tra l’impianto e la corona, che attraversa la gengiva.' },
  { t: 'Corona protesica', d: 'La parte visibile, realizzata su misura per forma e colore dei denti vicini.' },
];

const STEPS = [
  { t: 'Visita', d: 'Il dentista raccoglie la storia clinica, visita la bocca e ascolta le tue esigenze.' },
  { t: 'Esami diagnostici', d: 'Radiografie e, quando servono, esami tridimensionali per valutare l’osso disponibile.' },
  { t: 'Piano di trattamento', d: 'Ti vengono spiegate le soluzioni possibili, le alternative, i tempi previsti e i costi.' },
  { t: 'Inserimento dell’impianto', d: 'Intervento eseguito in ambulatorio, di norma in anestesia locale.' },
  { t: 'Fase protesica', d: 'Dopo il periodo di guarigione stabilito dal dentista, si realizza e si fissa la corona.' },
  { t: 'Controlli nel tempo', d: 'Igiene professionale e visite periodiche aiutano a mantenere sani impianto e gengive.' },
];

const FAQ = [
  { q: 'L’implantologia è adatta a tutti?', a: 'No. Dipende dalla salute generale, dalle condizioni delle gengive e dall’osso disponibile. Lo valuta il dentista dopo la visita e gli esami.' },
  { q: 'Quanto dura un impianto?', a: 'Non esiste una durata garantita. Contano l’igiene a casa, i controlli periodici, il fumo e le condizioni generali di salute.' },
  { q: 'L’intervento fa male?', a: 'Di norma si esegue in anestesia locale. Il dentista spiega prima cosa aspettarsi durante e dopo l’intervento e come gestire eventuali fastidi.' },
  { q: 'Quanto tempo serve?', a: 'Cambia da caso a caso: dipende dall’osso, dal tipo di protesi e dalla guarigione. Il piano di trattamento indica i tempi previsti per la tua situazione.' },
  { q: 'Come conosco il costo?', a: 'Il costo dipende dal piano di cura. Lo studio lo indica in un preventivo dopo la visita.' },
];

export default function Implantologia() {
  useSeo(
    'Implantologia a Montella | Teramed',
    'Implantologia al Centro Medico Dentistico Teramed di Montella (AV): cos’è un impianto, come si svolge la valutazione, domande frequenti.',
  );
  const reduced = prefersReducedMotion();
  const target = useRef<ImplantState>({ explode: 0.85, context: 0, labels: 1 });
  const [exploded, setExploded] = useState(true);
  const [context, setContext] = useState(false);
  const [gl] = useState(() => hasWebGL());

  const setMode = (e: boolean) => {
    setExploded(e);
    target.current.explode = e ? 0.85 : 0;
  };
  const toggleContext = () => {
    const v = !context;
    setContext(v);
    target.current.context = v ? 1 : 0;
    if (v) setMode(false);
  };

  return (
    <>
      <section className="relative overflow-hidden pt-[calc(var(--header-h)+40px)] md:pt-[calc(var(--header-h)+72px)]" aria-labelledby="impl-title">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10" style={{ background: 'radial-gradient(45% 60% at 75% 45%, rgba(221,238,246,0.9), transparent 70%)' }} />
        <div className="wrap grid items-center gap-8 lg:grid-cols-[1fr_1.05fr]">
          <div className="pb-4 lg:pb-24">
            <p className="kicker reveal">Trattamento</p>
            <h1 id="impl-title" className="display t-hero reveal mt-4 text-[clamp(3rem,1.6rem+5.4vw,6.8rem)]">Implantologia</h1>
            <p className="lead reveal mt-6">Sostituire uno o più denti mancanti con radici artificiali in titanio e corone protesiche, dopo una valutazione accurata.</p>
            <div className="reveal mt-8 flex flex-wrap gap-3">
              <PrenotaButton size="lg" from="implantologia-hero" />
              <GiuliaButton size="lg" from="implantologia-hero" />
            </div>
          </div>
          <div className="relative">
            <div className="relative aspect-[4/4.4] w-full sm:aspect-[4/3.6] lg:aspect-[4/4.6]">
              {gl ? (
                <Suspense fallback={<img src={imgImpianto} alt="" className="absolute inset-0 m-auto max-h-[82%] object-contain" />}>
                  <ImplantViewer3D target={target} reduced={reduced} />
                </Suspense>
              ) : (
                <img src={imgImpianto} alt="Modello illustrativo di un impianto dentale con moncone e corona" className="absolute inset-0 m-auto max-h-[82%] object-contain" />
              )}
            </div>
            <div className="relative z-10 -mt-4 flex flex-wrap items-center gap-3 pb-6">
              <div className="inline-flex rounded-full border border-[var(--line)] bg-white p-1" role="group" aria-label="Vista del modello">
                {[
                  ['Componenti', true],
                  ['Assemblato', false],
                ].map(([l, v]) => (
                  <button
                    key={String(l)}
                    type="button"
                    aria-pressed={exploded === v}
                    onClick={() => setMode(v as boolean)}
                    className={`rounded-full px-4 py-2 text-[0.92rem] transition-colors ${exploded === v ? 'bg-[var(--ink)] text-white' : 'text-[var(--muted)] hover:text-[var(--ink)]'}`}
                  >
                    {l}
                  </button>
                ))}
              </div>
              <button type="button" onClick={toggleContext} aria-pressed={context} className={`rounded-full border px-4 py-2 text-[0.92rem] transition-colors ${context ? 'border-[var(--sky-deep)] bg-[var(--mist)]' : 'border-[var(--line)] bg-white'}`}>
                {context ? 'Nascondi osso e gengiva' : 'Mostra osso e gengiva'}
              </button>
              {gl && (
                <span className="muted inline-flex items-center gap-1.5 text-[0.85rem]">
                  <Move3d size={15} /> Trascina per ruotare
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28" aria-labelledby="cose-title">
        <div className="wrap">
          <SmileRule className="mb-14" />
          <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
            <SectionHead kicker="In parole semplici" title="Cos’è un impianto dentale." id="cose-title">
              Un impianto sostituisce la radice di un dente mancante. Sopra l’impianto si fissa una corona che ripristina la funzione e l’aspetto del dente.
            </SectionHead>
            <dl className="grid gap-0">
              {PARTS.map((p, i) => (
                <div key={p.t} className="reveal grid gap-2 border-t border-[var(--line)] py-6 md:grid-cols-[220px_1fr] md:gap-8" style={{ ['--d' as string]: `${i * 0.07}s` }}>
                  <dt className="display text-[1.8rem] leading-tight">{p.t}</dt>
                  <dd className="muted">{p.d}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="bg-[var(--porcelain)] py-20 md:py-28" aria-labelledby="valutazione-title">
        <div className="wrap grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHead kicker="Percorso di valutazione" title="Come si arriva al trattamento." id="valutazione-title">
              Le fasi più comuni di un percorso implantare. Tempi e passaggi cambiano da persona a persona.
            </SectionHead>
          </div>
          <ol>
            {STEPS.map((s, i) => (
              <li key={s.t} className="reveal grid grid-cols-[56px_1fr] gap-4 border-t border-[var(--line)] py-6 md:grid-cols-[80px_1fr_1.2fr] md:gap-8" style={{ ['--d' as string]: `${i * 0.05}s` }}>
                <span className="display tabnum text-[2rem] leading-none text-[var(--sky-deep)]">{i + 1}</span>
                <h3 className="display t-3 md:text-[1.7rem]">{s.t}</h3>
                <p className="muted col-start-2 md:col-start-3">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-20 md:py-28" aria-labelledby="faq-title">
        <div className="wrap grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <SectionHead kicker="Domande frequenti" title="Le risposte alle domande più comuni." id="faq-title" />
          <div className="reveal border-t border-[var(--line)]">
            {FAQ.map((f) => (
              <details key={f.q} className="faq border-b border-[var(--line)]">
                <summary className="flex items-center justify-between gap-6 py-6 text-[1.15rem] font-medium">
                  {f.q}
                  <Plus size={20} className="faq-icon shrink-0" />
                </summary>
                <p className="muted max-w-[60ch] pb-6">{f.a}</p>
              </details>
            ))}
            <p className="muted pt-6 text-[0.9rem]">Informazioni generali: non sostituiscono la visita, che resta il solo momento in cui si può valutare il singolo caso.</p>
          </div>
        </div>
      </section>

      <section className="pb-8" aria-label="Domande a Giulia">
        <div className="wrap">
          <div className="on-dark reveal grid items-center gap-8 rounded-[32px] px-6 py-12 md:grid-cols-[1.4fr_auto] md:px-14 md:py-16">
            <div>
              <h2 className="display t-2">Vuoi fare una domanda prima di prenotare?</h2>
              <p className="lead mt-3">Scrivici su WhatsApp. In questa demo puoi anche provare Giulia, l’assistente virtuale proposta da Dental Go: raccoglie la richiesta e la segreteria ricontatta il paziente.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <GiuliaButton size="lg" from="implantologia-giulia" />
              <WhatsAppButton className="btn-outline-light" size="lg" from="implantologia-giulia" />
            </div>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
