import { Rotate3d, Languages, HeartHandshake, CalendarCheck } from 'lucide-react';
import { CtaBand, Gallery, PageHero, SectionHead, SmileRule, Tbc } from '../components/Sections';
import { PrenotaButton } from '../components/Cta';
import { Logo } from '../components/Logo';
import { site } from '../config/site';
import { useSeo } from '../lib/seo';

export default function Centro() {
  useSeo(
    'Il centro | Teramed, centro dentistico a Montella',
    'Il Centro Medico Dentistico Teramed a Montella (AV): approccio alla cura, accoglienza, lingue parlate e convenzioni.',
  );
  return (
    <>
      <PageHero
        kicker="Il centro"
        title="Un centro dentistico a Montella."
        lead="Teramed nasce per rispondere a un’esigenza del territorio: avere vicino a casa cure odontoiatriche di qualità, con un’attenzione costante alla prevenzione."
        aside={
          <div className="relative grid aspect-[5/4] place-items-center overflow-hidden rounded-[28px] bg-white">
            <div aria-hidden="true" className="absolute inset-0" style={{ background: 'radial-gradient(60% 60% at 50% 45%, rgba(221,238,246,.9), transparent 70%)' }} />
            <Logo className="relative w-[78%]" />
          </div>
        }
      >
        <PrenotaButton from="centro-hero" />
      </PageHero>

      {/* approccio: storytelling editoriale */}
      <section className="pb-24 md:pb-36" aria-labelledby="approccio-title">
        <div className="wrap">
          <SmileRule className="mb-16" />
          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
            <SectionHead kicker="Il nostro approccio" title="Prevenire, curare, accompagnare." id="approccio-title" />
            <div className="grid gap-6 text-[1.08rem] leading-[1.7]">
              <p className="reveal">
                Il centro si dedica alla prevenzione e alla cura delle patologie del cavo orale. È la parte del lavoro su cui insistiamo di più, perché un controllo fatto per tempo semplifica tutto quello che viene dopo.
              </p>
              <p className="reveal" style={{ ['--d' as string]: '.06s' }}>
                Organizzazione e metodi di lavoro sono pensati per ottenere buoni risultati clinici, con dentisti e igienisti dentali che collaborano sullo stesso percorso di cura.
              </p>
              <p className="reveal muted" style={{ ['--d' as string]: '.12s' }}>
                Testi da rivedere con lo studio: sono una sintesi della presentazione pubblicata dal centro sul proprio profilo AlfaDocs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* accoglienza */}
      <section className="bg-[var(--porcelain)] py-24 md:py-32" aria-labelledby="accoglienza-title">
        <div className="wrap">
          <SectionHead kicker="Accoglienza" title="Ci prendiamo il tempo di spiegare." id="accoglienza-title" />
          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {[
              { i: <HeartHandshake size={26} strokeWidth={1.4} />, t: 'Ansia del dentista', d: 'Il centro segue anche pazienti che vivono con timore la visita dal dentista.' },
              { i: <Languages size={26} strokeWidth={1.4} />, t: 'Cinque lingue', d: `${site.lingue.join(', ')}.` },
              { i: <CalendarCheck size={26} strokeWidth={1.4} />, t: 'Prenotare è semplice', d: 'Online su AlfaDocs in qualsiasi momento, oppure al telefono e su WhatsApp negli orari dello studio.' },
            ].map((c, k) => (
              <div key={c.t} className="reveal" style={{ ['--d' as string]: `${k * 0.08}s` }}>
                <div className="grid h-14 w-14 place-items-center rounded-full bg-white text-[var(--sky-deep)]">{c.i}</div>
                <h3 className="display mt-6 text-[1.9rem] leading-tight">{c.t}</h3>
                <p className="muted mt-3 max-w-[34ch]">{c.d}</p>
              </div>
            ))}
          </div>
          <div className="reveal mt-20 border-t border-[var(--line)] pt-10">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <h3 className="display t-3 md:text-[1.9rem]">Convenzioni e fondi sanitari</h3>
              <span className="muted text-[0.9rem]">Elenco dal profilo AlfaDocs del centro</span>
            </div>
            <ul className="mt-6 flex flex-wrap gap-2">
              {site.convenzioni.map((c) => (
                <li key={c} className="rounded-full border border-[var(--line)] bg-white px-4 py-2 text-[0.95rem]">
                  {c}
                </li>
              ))}
            </ul>
            <p className="muted mt-4 text-[0.9rem]">Condizioni e modalità di ciascuna convenzione si verificano con la segreteria.</p>
          </div>
        </div>
      </section>

      {/* gallery immersiva */}
      <section className="py-24 md:py-36" aria-labelledby="ambienti-title">
        <div className="wrap">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-4 md:mb-16">
            <SectionHead kicker="Gli ambienti" title="Dove ti accogliamo." id="ambienti-title">
              Le fotografie degli ambienti arriveranno dallo studio: ogni riquadro è già pronto per la sua immagine.
            </SectionHead>
            <Tbc>foto autentiche da fornire</Tbc>
          </div>
          <Gallery />
        </div>
      </section>

      {/* tour virtuale futuro */}
      <section className="pb-8" aria-labelledby="tour-title">
        <div className="wrap">
          <div className="on-dark reveal relative overflow-hidden rounded-[32px] px-6 py-16 md:px-16 md:py-24">
            <div aria-hidden="true" className="absolute -right-20 -top-28 h-[420px] w-[420px] rounded-full border border-[var(--line-dark)]" />
            <div aria-hidden="true" className="absolute -right-4 -top-12 h-[300px] w-[300px] rounded-full border border-[rgba(26,167,230,0.3)]" />
            <Rotate3d size={34} strokeWidth={1.2} className="text-[var(--sky)]" />
            <h2 id="tour-title" className="display t-1 mt-6 max-w-[16ch]">Tour virtuale degli ambienti</h2>
            <p className="lead mt-5">Uno spazio predisposto per un tour a 360° del centro, da realizzare con lo studio: reception, sala d’attesa e studi operativi visitabili dallo smartphone.</p>
            <div className="mt-8">
              <Tbc>in preparazione</Tbc>
            </div>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
