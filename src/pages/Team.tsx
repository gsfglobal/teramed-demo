import { ExternalLink } from 'lucide-react';
import { CtaBand, PageHero, Tbc } from '../components/Sections';
import { PrenotaButton } from '../components/Cta';
import { site, team } from '../config/site';
import { useSeo } from '../lib/seo';
import { track } from '../lib/analytics';

export default function Team() {
  useSeo('Il team | Teramed, Montella', 'Dentisti e igienisti dentali del Centro Medico Dentistico Teramed di Montella (AV).');
  const dentisti = team.filter((m) => m.ruolo === 'Dentista');
  const igienisti = team.filter((m) => m.ruolo === 'Igienista');
  const Group = ({ title, members, note }: { title: string; members: typeof team; note: string }) => (
    <div className="py-14 md:py-20">
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-[var(--line)] pb-6">
        <h2 className="display t-2 reveal">{title}</h2>
        <p className="muted reveal text-[0.95rem]">{note}</p>
      </div>
      <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-8 sm:gap-y-16 lg:grid-cols-4">
        {members.map((m, i) => (
          <li key={m.id} className="reveal group" style={{ ['--d' as string]: `${i * 0.07}s` }}>
            <div className="arch-frame reveal-img relative aspect-[3/4.2]">
              <img src={m.foto} alt={`${m.titolo} ${m.nome}, ${m.qualifica.toLowerCase()}`} loading="lazy" className="h-full w-full object-cover object-top transition-transform duration-[1.2s] group-hover:scale-[1.035]" />
            </div>
            <p className="display mt-5 text-[1.3rem] leading-tight sm:text-[1.65rem]">
              {m.titolo} {m.nome}
            </p>
            <p className="text-[var(--sky-deep)]">{m.qualifica}</p>
            <p className="muted mt-3 text-[0.95rem]">{m.bio ?? 'Presentazione professionale in preparazione con lo studio.'}</p>
            {!m.bio && site.demo.mostraDaConfermare && (
              <div className="mt-3">
                <Tbc>biografia e aree di attività da fornire</Tbc>
              </div>
            )}
            <a
              href={m.alfadocsUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track('cta_prenota', { from: `team-${m.id}` })}
              className="tlink mt-4 inline-flex items-center gap-1.5 text-[0.98rem]"
            >
              Prenota con {m.titolo === 'Dott.ssa' ? 'la' : 'il'} {m.titolo} {m.nome.split(' ').slice(-1)[0]} <ExternalLink size={14} />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
  return (
    <>
      <PageHero
        kicker="Il team"
        title="Dentisti e igienisti del centro."
        lead="Sei professionisti: quattro dentisti e due igienisti dentali. Puoi prenotare la visita direttamente con ciascuno di loro su AlfaDocs."
        aside={
          <ul className="grid grid-cols-3 gap-3" aria-hidden="true">
            {team.map((m, i) => (
              <li key={m.id} className="arch-frame aspect-[3/4]" style={{ marginTop: i % 3 === 1 ? 28 : 0 }}>
                <img src={m.foto} alt="" className="h-full w-full object-cover object-top" />
              </li>
            ))}
          </ul>
        }
      >
        <PrenotaButton from="team-hero" />
      </PageHero>
      <section className="pb-12" aria-label="Professionisti">
        <div className="wrap">
          <Group title="Dentisti" members={dentisti} note="Prenotabili su AlfaDocs" />
          <Group title="Igienisti dentali" members={igienisti} note="Igiene professionale e prevenzione" />
          <p className="muted reveal border-t border-[var(--line)] pt-8 text-[0.95rem]">
            Direttore sanitario: {site.legale.direttoreSanitario ?? <Tbc>da indicare</Tbc>}. Ruoli e qualifiche come riportati sul profilo AlfaDocs del centro; fotografie dallo stesso profilo, da sostituire con originali in alta risoluzione.
          </p>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
