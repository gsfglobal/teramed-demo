import { Link } from 'react-router-dom';
import { CalendarCheck, Clock, MapPin, ShieldCheck } from 'lucide-react';
import { GiuliaVoice } from '../components/GiuliaVoice';
import { site, indirizzoBreve } from '../config/site';
import { useSeo } from '../lib/seo';

export default function Giulia() {
  useSeo('Prova Giulia | Teramed', 'Parla dal browser con Giulia, l’assistente virtuale configurata per il Centro Medico Dentistico Teramed di Montella. Demo di Dental Go.');
  const aperto = site.orari.giorni.filter((g) => g.orario !== 'Chiuso');
  return (
    <section className="on-dark relative overflow-hidden pb-24 pt-[calc(var(--header-h)+48px)] md:pb-32 md:pt-[calc(var(--header-h)+80px)]" aria-labelledby="giulia-page-title">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(55% 60% at 75% 35%, #16303f 0%, transparent 70%)' }} />
      <div className="wrap relative grid gap-10 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-x-14">
        <div className="lg:col-start-1 lg:row-start-1">
          <p className="kicker reveal">Assistente virtuale del Centro Teramed</p>
          <h1 id="giulia-page-title" className="display t-hero reveal mt-4 text-[clamp(2.9rem,1.6rem+5vw,6rem)]">Prova Giulia</h1>
          <p className="lead reveal mt-6">Parla con Giulia dal browser, come se chiamassi il centro. Chiedi una prima visita, una seduta di igiene, sposta un appuntamento o segnala un’urgenza.</p>

        </div>

        <div className="reveal lg:sticky lg:top-28 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <div className="rounded-[34px] border border-[var(--line-dark)] bg-[linear-gradient(180deg,#152c3a,#0f202b)] p-6 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.7)] md:p-10">
            {site.giulia.agentId ? <GiuliaVoice variant="page" /> : <p className="text-[var(--on-dark-muted)]">La prova vocale non è ancora attiva.</p>}
          </div>
        </div>

        <div className="lg:col-start-1 lg:row-start-2">
          <ul className="reveal mt-9 grid gap-4">
            <li className="flex gap-3">
              <MapPin size={19} className="mt-1 shrink-0 text-[var(--sky)]" />
              <span>{indirizzoBreve()}</span>
            </li>
            <li className="flex gap-3">
              <Clock size={19} className="mt-1 shrink-0 text-[var(--sky)]" />
              <span>
                Da martedì a sabato, {aperto[0]?.orario.replace(' – ', ' alle ').replace(/^/, 'dalle ')}, orario continuato. Lunedì e domenica chiuso.
              </span>
            </li>
            <li className="flex gap-3">
              <CalendarCheck size={19} className="mt-1 shrink-0 text-[var(--sky)]" />
              <span>Le visite che fissi qui finiscono in un’agenda di prova, così lo studio vede come arrivano le richieste.</span>
            </li>
          </ul>

          <div className="reveal mt-10 border-t border-[var(--line-dark)] pt-6">
            <p className="font-medium">Le regole di Giulia</p>
            <ul className="mt-3 grid gap-2 text-[var(--on-dark-muted)]">
              <li className="flex gap-3"><ShieldCheck size={18} className="mt-1 shrink-0 text-[var(--sky)]" /> Dice sempre di essere un’assistente virtuale.</li>
              <li className="flex gap-3"><ShieldCheck size={18} className="mt-1 shrink-0 text-[var(--sky)]" /> Non fa diagnosi, non dà consigli medici e non indica farmaci.</li>
              <li className="flex gap-3"><ShieldCheck size={18} className="mt-1 shrink-0 text-[var(--sky)]" /> Non comunica prezzi: li dà lo studio dopo la visita.</li>
              <li className="flex gap-3"><ShieldCheck size={18} className="mt-1 shrink-0 text-[var(--sky)]" /> Per un’emergenza indica il 112.</li>
            </ul>
          </div>

          <p className="reveal mt-8 text-[0.85rem] text-[var(--on-dark-muted)]">
            Funzione dimostrativa proposta da Dental Go, non ancora adottata dal Centro Teramed.{' '}
            <Link className="tlink text-[var(--on-dark)]" to="/">
              Torna al sito
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
