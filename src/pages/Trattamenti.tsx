import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { CtaBand, PageHero, SectionHead, Tbc } from '../components/Sections';
import { PrenotaButton, WhatsAppButton } from '../components/Cta';
import { site, trattamenti } from '../config/site';
import { useSeo } from '../lib/seo';
import { scrollToId } from '../lib/motion';
import imgImpianto from '../assets/renders/impianto.webp';
import imgMolari from '../assets/renders/molari.webp';
import imgMascherina from '../assets/renders/mascherina.webp';
import imgGengive from '../assets/renders/gengive.webp';
import imgFrontale from '../assets/renders/frontale.webp';

const RENDERS: Record<string, { src: string; alt: string; fit: string }> = {
  impianto: { src: imgImpianto, alt: 'Modello 3D illustrativo di un impianto: vite in titanio, moncone e corona separati', fit: 'object-contain p-8' },
  molari: { src: imgMolari, alt: 'Modello 3D illustrativo dei denti posteriori', fit: 'object-cover' },
  mascherina: { src: imgMascherina, alt: 'Modello 3D illustrativo di una mascherina trasparente sull’arcata superiore', fit: 'object-cover' },
  gengive: { src: imgGengive, alt: 'Modello 3D illustrativo di denti e gengive inferiori', fit: 'object-cover' },
};

export default function Trattamenti() {
  useSeo(
    'Trattamenti | Teramed, dentista a Montella',
    'Implantologia, chirurgia orale, ortodonzia trasparente, igiene e prevenzione al Centro Medico Dentistico Teramed di Montella (AV).',
  );
  const { hash } = useLocation();
  useEffect(() => {
    if (!hash) return;
    const t = setTimeout(() => scrollToId(hash.slice(1)), 650);
    return () => clearTimeout(t);
  }, [hash]);

  const confermati = trattamenti.filter((t) => t.confermato);
  const altri = trattamenti.filter((t) => !t.confermato);

  return (
    <>
      <PageHero
        kicker="Trattamenti"
        title="Le cure del centro."
        lead="Una panoramica delle prestazioni, con informazioni chiare su cosa sono e come si svolge la valutazione. Ogni percorso inizia con una visita."
        aside={<img src={imgFrontale} alt="" className="mx-auto w-full max-w-[520px]" />}
      >
        {confermati.map((t) => (
          <button key={t.id} type="button" onClick={() => scrollToId(t.id)} className="rounded-full border border-[var(--line)] bg-white px-4 py-2 text-[0.95rem] transition-colors hover:border-[var(--ink)]">
            {t.nome}
          </button>
        ))}
      </PageHero>

      {confermati.map((t, i) => {
        const r = RENDERS[t.render ?? 'gengive'];
        const flip = i % 2 === 1;
        return (
          <section key={t.id} id={t.id} className={`scroll-mt-24 py-20 md:py-28 ${i % 2 ? 'bg-[var(--porcelain)]' : ''}`} aria-labelledby={`${t.id}-title`}>
            <div className={`wrap grid items-center gap-12 lg:grid-cols-2 lg:gap-20 ${flip ? 'lg:[&>*:first-child]:order-2' : ''}`}>
              <figure className="reveal-img relative aspect-[4/3.4] overflow-hidden rounded-[28px] bg-[linear-gradient(160deg,#f3f6f6,#e4edf0)]">
                <img src={r.src} alt={r.alt} loading="lazy" className={`h-full w-full ${r.fit}`} />
                <figcaption className="absolute bottom-4 left-4 rounded-full bg-white/85 px-3 py-1 text-[0.75rem] text-[var(--muted)] backdrop-blur">Illustrazione 3D</figcaption>
              </figure>
              <div>
                <p className="kicker reveal">Trattamento</p>
                <h2 id={`${t.id}-title`} className="display t-1 reveal mt-3">{t.nome}</h2>
                <div className="reveal mt-6 grid gap-4 text-[1.06rem] leading-[1.7]">
                  {t.descrizione.map((d) => (
                    <p key={d}>{d}</p>
                  ))}
                </div>
                <div className="reveal mt-8 border-t border-[var(--line)]">
                  {t.approfondimento.map((a) => (
                    <details key={a.titolo} className="faq border-b border-[var(--line)]">
                      <summary className="flex items-center justify-between gap-4 py-4 text-[1.05rem] font-medium">
                        {a.titolo}
                        <Plus size={18} className="faq-icon shrink-0" />
                      </summary>
                      <p className="muted pb-5">{a.testo}</p>
                    </details>
                  ))}
                </div>
                <div className="reveal mt-8 flex flex-wrap gap-3">
                  <PrenotaButton from={`trattamento-${t.id}`} />
                  {t.id === 'implantologia' ? (
                    <Link to="/implantologia" className="btn btn-ghost">Pagina implantologia</Link>
                  ) : (
                    <WhatsAppButton from={`trattamento-${t.id}`} />
                  )}
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {site.demo.mostraDaConfermare && altri.length > 0 && (
        <section className="py-20 md:py-28" aria-labelledby="altre-title">
          <div className="wrap">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHead kicker="Altre discipline" title="In attesa di conferma dallo studio." id="altre-title">
                Prestazioni indicate da fonti pubbliche e non ancora verificate. Compariranno nel sito solo dopo la conferma del centro.
              </SectionHead>
              <Tbc>visibile solo nella demo</Tbc>
            </div>
            <ul className="mt-12 grid gap-px overflow-hidden rounded-[22px] border border-dashed border-[rgba(10,107,154,0.35)] bg-[rgba(10,107,154,0.12)] sm:grid-cols-2 lg:grid-cols-3">
              {altri.map((t) => (
                <li key={t.id} className="bg-[var(--paper)] p-6">
                  <p className="display text-[1.5rem]">{t.nome}</p>
                  <p className="muted mt-1 text-[0.95rem]">{t.sintesi}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <CtaBand />
    </>
  );
}
