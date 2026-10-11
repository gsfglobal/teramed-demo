import { Link } from 'react-router-dom';
import { Hero } from '../components/Hero';
import { SmileExperience } from '../components/SmileExperience';
import { BookingBlock, ContactInfo, Gallery, GiuliaSection, MapCard, PatientJourney, Reviews, SectionHead, SmileRule, TeamStrip, TreatmentRows } from '../components/Sections';
import { useSeo } from '../lib/seo';
import { site } from '../config/site';

const PILLARS = [
  { t: 'Fiducia', d: 'Ascoltare prima di proporre. Ogni percorso parte da una visita e da spiegazioni chiare, con il tempo per fare domande.' },
  { t: 'Competenza', d: 'Dentisti e igienisti dentali che lavorano insieme, dalla prevenzione ai trattamenti più articolati.' },
  { t: 'Innovazione', d: 'Strumenti digitali che rendono più semplici informazione e contatto, a partire dalla prenotazione online.' },
];

export default function Home() {
  useSeo(
    'Teramed | Centro Medico Dentistico a Montella (AV)',
    'Teramed, centro medico dentistico a Montella (AV): implantologia, chirurgia orale, ortodonzia trasparente, igiene e prevenzione. Prenota una visita online.',
  );
  return (
    <>
      <Hero />

      {/* 2 · presentazione */}
      <section className="py-24 md:py-36" aria-labelledby="intro-title">
        <div className="wrap grid gap-14 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <p className="kicker reveal">Il Centro Teramed</p>
            <h2 id="intro-title" className="display reveal mt-4 text-[clamp(1.9rem,1.3rem+2.2vw,3.3rem)] leading-[1.18]" style={{ ['--d' as string]: '.05s' }}>
              Un centro medico dentistico a Montella, in Alta Irpinia, nato per offrire al territorio cure odontoiatriche di qualità e un’attenzione costante alla prevenzione.
            </h2>
            <Link to="/centro" className="tlink reveal mt-8 inline-block text-[1.05rem] text-[var(--sky-deep)]">
              Conosci il centro
            </Link>
          </div>
          <dl className="reveal grid content-start gap-0 self-end" style={{ ['--d' as string]: '.12s' }}>
            {[
              ['Professionisti', '4 dentisti e 2 igienisti dentali'],
              ['Lingue parlate', site.lingue.join(', ')],
              ['Prenotazione', 'Online, al telefono o su WhatsApp'],
              ['Accoglienza', 'Attenzione a chi vive con ansia la visita dal dentista'],
            ].map(([k, v]) => (
              <div key={k} className="grid grid-cols-[130px_1fr] gap-4 border-t border-[var(--line)] py-4">
                <dt className="muted text-[0.92rem]">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 3 · filosofia */}
      <section className="bg-[var(--porcelain)] py-24 md:py-32" aria-labelledby="filosofia-title">
        <div className="wrap">
          <SectionHead kicker="La nostra filosofia" title="Tre parole guidano il lavoro del centro." id="filosofia-title" />
          <SmileRule className="my-12 md:my-16" />
          <div className="grid gap-12 md:grid-cols-3 md:gap-10">
            {PILLARS.map((p, i) => (
              <div key={p.t} className="reveal" style={{ ['--d' as string]: `${i * 0.1}s` }}>
                <h3 className="display text-[clamp(2.4rem,1.8rem+2vw,3.6rem)] leading-none">{p.t}</h3>
                <p className="muted mt-5 max-w-[34ch]">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 · trattamenti principali */}
      <section className="py-24 md:py-36" aria-labelledby="tratt-title">
        <div className="wrap">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6 md:mb-16">
            <SectionHead kicker="Trattamenti" title="Le principali cure del centro." id="tratt-title" />
            <Link to="/trattamenti" className="btn btn-ghost reveal">Tutti i trattamenti</Link>
          </div>
          <TreatmentRows />
        </div>
      </section>

      {/* 5 · esperienza 3D */}
      <SmileExperience />

      {/* 6 · team */}
      <section className="py-24 md:py-36" aria-labelledby="team-title">
        <div className="wrap">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6 md:mb-16">
            <SectionHead kicker="Il team" title="Le persone del centro." id="team-title">
              Quattro dentisti e due igienisti dentali. Su AlfaDocs puoi prenotare la visita con ciascuno di loro.
            </SectionHead>
            <Link to="/team" className="btn btn-ghost reveal">Conosci il team</Link>
          </div>
          <TeamStrip />
        </div>
      </section>

      {/* 7 · esperienza del paziente */}
      <section className="bg-[var(--porcelain)] py-24 md:py-36" aria-labelledby="percorso-title">
        <div className="wrap grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHead kicker="Esperienza del paziente" title="Dalla prenotazione ai controlli." id="percorso-title">
              Ogni fase ha un momento per le domande. Così sai sempre cosa succede e perché.
            </SectionHead>
          </div>
          <PatientJourney />
        </div>
      </section>

      {/* 8 · gallery */}
      <section className="py-24 md:py-36" aria-labelledby="ambienti-title">
        <div className="wrap">
          <div className="mb-12 md:mb-16">
            <SectionHead kicker="Gli ambienti" title="Uno sguardo dentro il centro." id="ambienti-title">
              Questo spazio è pensato per le fotografie degli ambienti di Teramed.
            </SectionHead>
          </div>
          <Gallery />
        </div>
      </section>

      {/* 9 · reputazione */}
      <section className="pb-24 md:pb-36" aria-labelledby="recensioni-title">
        <div className="wrap">
          <div className="mb-12 md:mb-16">
            <SectionHead kicker="Reputazione" title="Le valutazioni dei pazienti." id="recensioni-title">
              Due piattaforme indipendenti, mostrate separatamente con la loro fonte.
            </SectionHead>
          </div>
          <Reviews />
        </div>
      </section>

      {/* 10 · prenotazione online */}
      <section className="bg-[var(--mist)] py-24 md:py-32" aria-label="Prenotazione online">
        <div className="wrap">
          <BookingBlock />
        </div>
      </section>

      {/* 11 · Giulia */}
      <section className="on-dark overflow-hidden py-24 md:py-36" aria-label="Giulia, assistente virtuale">
        <div className="wrap">
          <GiuliaSection />
        </div>
      </section>

      {/* 12 · contatti e indicazioni */}
      <section className="py-24 md:py-36" aria-labelledby="dove-title">
        <div className="wrap">
          <div className="mb-12 md:mb-16">
            <SectionHead kicker="Contatti e indicazioni" title="Come raggiungerci." id="dove-title" />
          </div>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:items-start">
            <div className="reveal">
              <ContactInfo />
            </div>
            <div className="reveal">
              <MapCard />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
