/**
 * CONFIGURAZIONE CENTRALIZZATA — Teramed, concept demo Dental Go
 * ----------------------------------------------------------------
 * Tutti i dati del centro stanno qui. Le voci con `daConfermare: true`
 * o valore `null` vanno verificate con lo studio prima della pubblicazione reale.
 * Fonti consultate l'11 ottobre 2026:
 *  - AlfaDocs: https://prenota.alfadocs.com/p/montella-teramed-s-r-l-7100
 *  - Google (scheda «Teramed Srl - Studio dentistico, Implantologia e odontoiatria»)
 *  - teramed.it: non leggibile in automatico (accesso bloccato), da rivedere a mano.
 */
import vatieri from '../assets/team/vatieri.jpg';
import castaldo from '../assets/team/castaldo.jpg';
import inglese from '../assets/team/inglese.jpg';
import patrone from '../assets/team/patrone.jpg';
import montuori from '../assets/team/montuori.jpg';
import bonavita from '../assets/team/bonavita.jpg';

export const ALFADOCS = 'https://prenota.alfadocs.com/p/montella-teramed-s-r-l-7100';
const GOOGLE_PLACE_ID = 'ChIJW_iS1xPWOxMR17bH_l9lqyQ';

export const site = {
  demo: {
    /** Etichetta discreta mostrata nel footer e nel badge. */
    label: 'Concept Demo — Dental Go',
    /** Mostra nel sito i segnaposto e i dati «da confermare» (utile in call). */
    mostraDaConfermare: true,
    noindex: true,
  },

  centro: {
    nome: 'Teramed',
    ragioneSociale: 'TERAMED S.r.l.',
    tipo: 'Centro Medico Dentistico',
    motto: 'Abbiamo a cuore il tuo sorriso.', // dal profilo AlfaDocs dello studio
    sitoAttuale: 'https://www.teramed.it/',
    /** Logo: ricostruito in vettoriale dal file pubblico. Sostituire con il file originale dello studio. */
    logoDaSostituire: true,
  },

  colori: {
    // Proposta creativa derivata dal logo (azzurro e grigio): da validare con lo studio.
    paper: '#FAF9F6',
    ink: '#14212A',
    sky: '#1AA7E6',
    skyDeep: '#0A6B9A',
    abyss: '#0D1B24',
    pearl: '#A9B0B5',
  },

  contatti: {
    telefono: { display: '0827 601732', href: 'tel:+390827601732' },
    whatsapp: {
      // Numero indicato dallo studio come «Numero WhatsApp» sul profilo AlfaDocs.
      numero: '393291761852',
      display: '329 176 1852',
      messaggio:
        'Buongiorno, vorrei ricevere informazioni e prenotare una visita presso il Centro Medico Dentistico Teramed.',
    },
    email: {
      valore: null as string | null,
      // Segnalata da fonti pubbliche, non verificata: inserirla in `valore` solo dopo conferma.
      daVerificare: 'teramed09@libero.it',
    },
  },

  indirizzo: {
    via: 'Via Ippolita Panico',
    civico: '9' as string | null, // indicato da Dental Go l'11/10/2026 (le fonti online riportavano 3 e 18)
    civiciTrovati: ['3 (Google)', '18 (AlfaDocs)'],
    cap: '83048',
    citta: 'Montella',
    provincia: 'AV',
    area: 'Alta Irpinia',
    lat: 40.8404285,
    lng: 15.016671,
    mapsUrl: `https://www.google.com/maps/search/?api=1&query=Teramed%20Srl%20Montella&query_place_id=${GOOGLE_PLACE_ID}`,
  },

  orari: {
    daConfermare: false,
    fonte: 'Indicati da Dental Go l’11/10/2026 (orario continuato)',
    giorni: [
      { giorno: 'Lunedì', orario: 'Chiuso' },
      { giorno: 'Martedì', orario: '9:00 – 18:00' },
      { giorno: 'Mercoledì', orario: '9:00 – 18:00' },
      { giorno: 'Giovedì', orario: '9:00 – 18:00' },
      { giorno: 'Venerdì', orario: '9:00 – 18:00' },
      { giorno: 'Sabato', orario: '9:00 – 18:00' },
      { giorno: 'Domenica', orario: 'Chiuso' },
    ],
    nota: 'Orario continuato',
  },

  prenotazione: {
    alfadocsUrl: ALFADOCS,
  },

  giulia: {
    /** Agente vocale demo di Giulia configurato per Teramed (ElevenLabs, agenda demo su Supabase slug «teramed»). */
    agentId: 'agent_0401m4p19n5eeqkaq8ch0vq70kfn' as string | null,
    durataSec: 360,
    paginaPubblica: 'https://gsfglobal.github.io/teramed-demo/#/giulia',
    /** Numero di telefono di prova (facoltativo). Se impostato, la scheda mostra anche la chiamata classica. */
    telefono: null as string | null, // es. '+390000000000'
    display: null as string | null,
    infoUrl: 'https://dentalgo.it/giulia-demo/',
  },

  recensioni: [
    {
      piattaforma: 'AlfaDocs',
      valutazione: 4.9,
      scala: 5,
      numero: 245,
      etichetta: 'opinioni',
      nota: 'Raccolte da AlfaDocs dopo una cura, in forma anonima.',
      url: `${ALFADOCS}#opinioni`,
      rilevatoIl: '11 ottobre 2026',
    },
    {
      piattaforma: 'Google',
      valutazione: 5.0,
      scala: 5,
      numero: 222,
      etichetta: 'recensioni',
      nota: 'Scheda Google «Teramed Srl».',
      url: `https://www.google.com/maps/search/?api=1&query=Teramed%20Srl%20Montella&query_place_id=${GOOGLE_PLACE_ID}`,
      rilevatoIl: '11 ottobre 2026',
    },
  ],

  legale: {
    direttoreSanitario: null as string | null, // obbligatorio: nome, cognome e titoli
    piva: null as string | null,
    albo: null as string | null,
    autorizzazione: null as string | null,
  },

  lingue: ['Italiano', 'Inglese', 'Francese', 'Spagnolo', 'Rumeno'],

  // Dal profilo AlfaDocs («Assicurazioni / Convenzioni»). Esclusi gli operatori di credito al consumo.
  convenzioni: [
    'Andi', 'Aon', 'Faschim', 'Fasdac', 'Fasi', 'Fasi Open', 'Fisde', 'Generali', 'Odontonetwork', 'One Net',
    'Previmedical', 'Pronto-Care', 'Poste Assicura', 'Poste Vita', 'Salutesemplice', 'Snms Cesare Pozzo', 'Unisalute',
  ],

  analytics: {
    /** Nessuno strumento di tracciamento installato. Attivare solo con cookie banner e informativa. */
    enabled: false,
  },
};

export type TeamMember = {
  id: string;
  nome: string;
  titolo: 'Dott.' | 'Dott.ssa';
  qualifica: string;
  ruolo: 'Dentista' | 'Igienista';
  foto: string;
  alfadocsUrl: string;
  bio: string | null; // da fornire dallo studio
  areeAttivita: string[]; // solo aree documentate
};

export const team: TeamMember[] = [
  { id: 'patrone', nome: 'Annibale Patrone', titolo: 'Dott.', qualifica: 'Dentista', ruolo: 'Dentista', foto: patrone, alfadocsUrl: 'https://prenota.alfadocs.com/o/dott-patrone-annibale-45987', bio: null, areeAttivita: [] },
  { id: 'vatieri', nome: 'Giovanni Vatieri', titolo: 'Dott.', qualifica: 'Dentista', ruolo: 'Dentista', foto: vatieri, alfadocsUrl: 'https://prenota.alfadocs.com/o/dott-vatieri-giovanni-29729', bio: null, areeAttivita: [] },
  { id: 'castaldo', nome: 'Michela Castaldo', titolo: 'Dott.ssa', qualifica: 'Dentista', ruolo: 'Dentista', foto: castaldo, alfadocsUrl: 'https://prenota.alfadocs.com/o/dott-ssa-castaldo-michela-30755', bio: null, areeAttivita: [] },
  { id: 'inglese', nome: 'Rossella Inglese', titolo: 'Dott.ssa', qualifica: 'Dentista', ruolo: 'Dentista', foto: inglese, alfadocsUrl: 'https://prenota.alfadocs.com/o/dott-ssa-inglese-rossella-30757', bio: null, areeAttivita: [] },
  { id: 'montuori', nome: 'Carlo Montuori', titolo: 'Dott.', qualifica: 'Igienista dentale', ruolo: 'Igienista', foto: montuori, alfadocsUrl: 'https://prenota.alfadocs.com/o/dott-montuori-carlo-194741', bio: null, areeAttivita: [] },
  { id: 'bonavita', nome: 'Carmine Bonavita', titolo: 'Dott.', qualifica: 'Igienista dentale', ruolo: 'Igienista', foto: bonavita, alfadocsUrl: 'https://prenota.alfadocs.com/o/dott-bonavita-carmine-314139', bio: null, areeAttivita: [] },
];

export type Treatment = {
  id: string;
  nome: string;
  confermato: boolean;
  fonte: string;
  sintesi: string;
  descrizione: string[];
  approfondimento: { titolo: string; testo: string }[];
  render?: string; // chiave dell'immagine 3D illustrativa
};

/** Prestazioni. Solo quelle `confermato: true` compaiono come trattamenti del centro. */
export const trattamenti: Treatment[] = [
  {
    id: 'implantologia',
    nome: 'Implantologia',
    confermato: true,
    fonte: 'Nome della scheda Google dello studio',
    sintesi: 'Sostituire uno o più denti mancanti con radici artificiali in titanio e corone protesiche.',
    descrizione: [
      'Un impianto è una piccola vite in titanio inserita nell’osso, che fa da radice per una corona protesica.',
      'Prima di ogni intervento il dentista valuta la salute generale, le gengive e la quantità di osso disponibile, anche con esami radiografici.',
    ],
    approfondimento: [
      { titolo: 'La valutazione', testo: 'Visita, esami diagnostici e un piano di trattamento spiegato passo per passo, con tempi e alternative.' },
      { titolo: 'Dopo il trattamento', testo: 'Igiene domiciliare accurata e controlli periodici aiutano a mantenere sani impianti e gengive nel tempo.' },
    ],
    render: 'impianto',
  },
  {
    id: 'chirurgia-orale',
    nome: 'Chirurgia orale',
    confermato: true,
    fonte: 'Pagina «Chirurgia orale» su teramed.it',
    sintesi: 'Interventi nella bocca eseguiti in ambulatorio, come estrazioni semplici e complesse.',
    descrizione: [
      'Comprende gli interventi eseguiti in anestesia locale, per esempio l’estrazione di un dente compromesso o di un dente del giudizio.',
      'Il dentista spiega prima come si svolge l’intervento e quali indicazioni seguire nei giorni successivi.',
    ],
    approfondimento: [
      { titolo: 'Prima dell’intervento', testo: 'Una visita con eventuali radiografie permette di pianificare l’intervento e di raccogliere informazioni su salute e farmaci in uso.' },
      { titolo: 'Dopo l’intervento', testo: 'Lo studio fornisce le indicazioni per i giorni successivi e fissa, se serve, un controllo.' },
    ],
    render: 'molari',
  },
  {
    id: 'ortodonzia-trasparente',
    nome: 'Ortodonzia trasparente',
    confermato: true,
    fonte: 'Pagina «Ortodonzia invisibile» su teramed.it',
    sintesi: 'Allineare i denti con mascherine trasparenti e rimovibili, quando il caso lo consente.',
    descrizione: [
      'Le mascherine sono realizzate su misura e si sostituiscono a intervalli stabiliti dal dentista, spostando i denti in modo graduale.',
      'Non tutti i casi si trattano con le mascherine: è la visita ortodontica a indicare la soluzione adatta.',
    ],
    approfondimento: [
      { titolo: 'Come si parte', testo: 'Visita ortodontica, impronte o scansione e un piano che mostra le fasi previste del trattamento.' },
      { titolo: 'Nella vita di tutti i giorni', testo: 'Le mascherine si tolgono per mangiare e lavare i denti, e vanno indossate per il numero di ore indicato.' },
    ],
    render: 'mascherina',
  },
  {
    id: 'igiene-e-prevenzione',
    nome: 'Igiene e prevenzione',
    confermato: true,
    fonte: 'Profilo AlfaDocs (igienisti dentali nello staff)',
    sintesi: 'Igiene professionale, controlli e consigli per la cura dei denti a casa.',
    descrizione: [
      'La seduta di igiene rimuove placca e tartaro dove lo spazzolino non arriva e permette di controllare lo stato delle gengive.',
      'Gli igienisti dentali spiegano come lavare i denti e quali strumenti usare tra una seduta e l’altra.',
    ],
    approfondimento: [
      { titolo: 'Ogni quanto', testo: 'La frequenza dei richiami la stabilisce il professionista in base alla situazione di ciascuno.' },
      { titolo: 'A casa', testo: 'Spazzolino, filo o scovolini e una tecnica corretta fanno la differenza tra una seduta e l’altra.' },
    ],
    render: 'gengive',
  },
  // ---- Da confermare con lo studio (indicate da fonti pubbliche, non verificate) ----
  { id: 'conservativa', nome: 'Conservativa', confermato: false, fonte: 'Da verificare', sintesi: 'Cura delle carie e ricostruzione dei denti.', descrizione: [], approfondimento: [] },
  { id: 'endodonzia', nome: 'Endodonzia', confermato: false, fonte: 'Da verificare', sintesi: 'Cura dei canali radicolari (devitalizzazione).', descrizione: [], approfondimento: [] },
  { id: 'parodontologia', nome: 'Parodontologia', confermato: false, fonte: 'Da verificare', sintesi: 'Cura delle gengive e dei tessuti di sostegno del dente.', descrizione: [], approfondimento: [] },
  { id: 'protesi', nome: 'Protesi dentarie', confermato: false, fonte: 'Da verificare', sintesi: 'Corone, ponti e protesi fisse o rimovibili.', descrizione: [], approfondimento: [] },
  { id: 'gnatologia', nome: 'Gnatologia', confermato: false, fonte: 'Da verificare', sintesi: 'Disturbi dell’articolazione della mandibola e della masticazione.', descrizione: [], approfondimento: [] },
  { id: 'diagnostica', nome: 'Diagnostica e radiologia', confermato: false, fonte: 'Da verificare', sintesi: 'Radiografie ed esami per la diagnosi odontoiatrica.', descrizione: [], approfondimento: [] },
];

export const waLink = (msg = site.contatti.whatsapp.messaggio) =>
  `https://wa.me/${site.contatti.whatsapp.numero}?text=${encodeURIComponent(msg)}`;

export const indirizzoBreve = () =>
  `${site.indirizzo.via}${site.indirizzo.civico ? ` ${site.indirizzo.civico}` : ''}, ${site.indirizzo.cap} ${site.indirizzo.citta} (${site.indirizzo.provincia})`;
