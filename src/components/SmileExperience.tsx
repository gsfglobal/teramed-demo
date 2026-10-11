import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { MousePointerClick } from 'lucide-react';
import { PrenotaButton, WhatsAppButton } from './Cta';
import { trattamenti } from '../config/site';
import { ScrollTrigger } from '../lib/motion';
import { hasWebGL, prefersReducedMotion, quality } from '../lib/env';
import type { HotspotId } from '../three/ExperienceScene';
import imgArcate from '../assets/renders/arcate.webp';
import imgGengive from '../assets/renders/gengive.webp';
import imgMascherina from '../assets/renders/mascherina.webp';
import imgImpianto from '../assets/renders/impianto.webp';
import imgFrontale from '../assets/renders/frontale.webp';

const Experience3D = lazy(() => import('../three/Experience3D'));

const SCENES = ['Esplora il sorriso', 'Prevenzione', 'Trattamenti', 'Implantologia', 'Percorso personalizzato'];
const HOTSPOT_LABELS: Record<HotspotId, string> = {
  'igiene-e-prevenzione': 'Igiene e prevenzione',
  'ortodonzia-trasparente': 'Ortodonzia trasparente',
  'chirurgia-orale': 'Chirurgia orale',
  implantologia: 'Implantologia',
};
const FALLBACK = [imgArcate, imgGengive, imgMascherina, imgImpianto, imgFrontale];

export function SmileExperience() {
  const section = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const [scene, setScene] = useState(0);
  const [active, setActive] = useState<HotspotId>('igiene-e-prevenzione');
  const [gl] = useState(() => hasWebGL());
  const [stack, setStack] = useState(() => window.innerWidth < 1024);
  const reduced = prefersReducedMotion();

  useEffect(() => {
    const onResize = () => setStack(window.innerWidth < 1024);
    window.addEventListener('resize', onResize);
    const st = ScrollTrigger.create({
      trigger: section.current,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        progress.current = self.progress;
        const idx = Math.min(4, Math.floor(self.progress * 5 + 0.0001));
        setScene((s) => (s === idx ? s : idx));
      },
    });
    return () => {
      st.kill();
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const treatment = trattamenti.find((t) => t.id === active)!;

  return (
    <section ref={section} className="on-dark relative" style={{ height: stack ? '560vh' : '520vh' }} aria-labelledby="exp-title">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0" style={{ background: 'radial-gradient(70% 60% at 60% 45%, #16303f 0%, #0d1b24 62%)' }} />
        <div className="absolute inset-0">
          {gl ? (
            <Suspense fallback={null}>
              <Experience3D
                progress={progress}
                quality={quality()}
                stack={stack}
                reduced={reduced}
                hotspotsVisible={scene === 2}
                active={active}
                onHotspot={setActive}
                labels={HOTSPOT_LABELS}
              />
            </Suspense>
          ) : (
            <img src={FALLBACK[scene]} alt="" className="absolute inset-0 m-auto max-h-[70%] max-w-[86%] object-contain transition-opacity duration-700" />
          )}
        </div>

        {/* indicatore delle scene: è una sequenza, quindi numerata */}
        <ol className="absolute right-[var(--gutter)] top-1/2 hidden -translate-y-1/2 gap-3 text-[0.82rem] text-[var(--on-dark-muted)] lg:grid" aria-label="Scene">
          {SCENES.map((s, i) => (
            <li key={s} className="flex items-center justify-end gap-3" aria-current={i === scene ? 'step' : undefined}>
              <span className={`transition-opacity duration-500 ${i === scene ? 'opacity-100 text-[var(--on-dark)]' : 'opacity-0'}`}>{s}</span>
              <span className="tabnum w-5 text-right">{i + 1}</span>
              <span className="h-px transition-all duration-700" style={{ width: i === scene ? 34 : 14, background: i === scene ? 'var(--sky)' : 'var(--line-dark)' }} />
            </li>
          ))}
        </ol>

        <div className="wrap pointer-events-none relative flex h-full flex-col justify-end pb-8 pt-[calc(var(--header-h)+12px)] lg:justify-center lg:pb-0">
          <div className="relative min-h-[280px] max-w-[460px] lg:min-h-[420px]">
            <Panel show={scene === 0}>
              <p className="kicker">Il sorriso in 3D</p>
              <h2 id="exp-title" className="display t-1 mt-3">Esplora il sorriso</h2>
              <p className="lead mt-4">Un modello tridimensionale delle arcate dentali che si muove con lo scorrimento della pagina. È un’illustrazione educativa: ogni bocca è diversa.</p>
            </Panel>
            <Panel show={scene === 1}>
              <p className="kicker">Prevenzione</p>
              <h3 className="display t-2 mt-3">Prendersi cura del sorriso significa partire dalla prevenzione.</h3>
              <p className="lead mt-4">Il confine tra dente e gengiva è il punto in cui la placca si accumula più facilmente. Igiene professionale e controlli periodici aiutano a tenerlo sotto controllo.</p>
            </Panel>
            <Panel show={scene === 2}>
              <p className="kicker">I trattamenti del centro</p>
              <h3 className="display t-2 mt-3">{treatment.nome}</h3>
              <p className="lead mt-4">{treatment.sintesi}</p>
              <div className="pointer-events-auto mt-5 flex flex-wrap gap-2" role="group" aria-label="Scegli un trattamento">
                {(Object.keys(HOTSPOT_LABELS) as HotspotId[]).map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setActive(id)}
                    aria-pressed={active === id}
                    className={`rounded-full border px-3.5 py-2 text-[0.88rem] transition-colors ${active === id ? 'border-[var(--sky)] bg-[rgba(26,167,230,0.16)] text-white' : 'border-[var(--line-dark)] text-[var(--on-dark-muted)] hover:text-white'}`}
                  >
                    {HOTSPOT_LABELS[id]}
                  </button>
                ))}
              </div>
              <p className="mt-4 hidden items-center gap-2 text-[0.85rem] text-[var(--on-dark-muted)] lg:flex">
                <MousePointerClick size={15} /> Puoi anche toccare i punti sul modello.
              </p>
              <Link to={`/trattamenti#${treatment.id}`} className="tlink pointer-events-auto mt-4 inline-block text-[var(--sky)]">
                Approfondisci {treatment.nome.toLowerCase()}
              </Link>
            </Panel>
            <Panel show={scene === 3}>
              <p className="kicker">Implantologia</p>
              <h3 className="display t-2 mt-3">Tre componenti, un dente da sostituire.</h3>
              <p className="lead mt-4">L’impianto in titanio fa da radice, il moncone lo collega alla corona, la corona è la parte visibile. Il modello separa le componenti per mostrarle.</p>
              <Link to="/implantologia" className="tlink pointer-events-auto mt-5 inline-block text-[var(--sky)]">
                Scopri l’implantologia
              </Link>
            </Panel>
            <Panel show={scene === 4}>
              <p className="kicker">Percorso personalizzato</p>
              <h3 className="display t-2 mt-3">Ogni sorriso ha esigenze diverse.</h3>
              <p className="lead mt-4">Il primo passo è una visita: il dentista valuta la situazione e propone un percorso spiegato con chiarezza.</p>
              <div className="pointer-events-auto mt-6 flex flex-wrap gap-3">
                <PrenotaButton className="btn-light" label="Richiedi una valutazione" from="esperienza-3d" />
                <WhatsAppButton className="btn-outline-light" from="esperienza-3d" />
              </div>
            </Panel>
          </div>
        </div>
        <p className="pointer-events-none absolute bottom-3 left-0 right-0 text-center text-[0.75rem] text-[var(--on-dark-muted)] opacity-70 lg:bottom-5">
          Modello 3D illustrativo, non rappresenta un caso clinico reale.
        </p>
      </div>
    </section>
  );
}

function Panel({ show, children }: { show: boolean; children: React.ReactNode }) {
  return (
    <div className="absolute inset-x-0 bottom-0 lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2" aria-hidden={!show}>
      <div
        className="rounded-[22px] bg-[rgba(13,27,36,0.72)] p-5 backdrop-blur-md lg:bg-transparent lg:p-0 lg:backdrop-blur-none"
        style={{
          opacity: show ? 1 : 0,
          transform: show ? 'none' : 'translateY(18px)',
          visibility: show ? 'visible' : 'hidden',
          transition: 'opacity .7s var(--ease), transform .8s var(--ease), visibility .7s',
        }}
      >
        {children}
      </div>
    </div>
  );
}
