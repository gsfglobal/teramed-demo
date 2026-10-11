# Teramed — Concept Demo (Dental Go)

Sito dimostrativo per **TERAMED S.r.l. — Centro Medico Dentistico**, Montella (AV).
Proposta grafica di Dental Go, **non approvata dal centro**: dati e immagini da verificare (vedi `DATI-DA-VERIFICARE.md`).

## Cosa c'è
- 6 pagine: Home, Il centro, Trattamenti, Il team, Implantologia, Contatti (routing a hash, `#/centro` ecc.).
- Esperienza 3D procedurale (nessun file 3D esterno): arcate dentali con gengive, mascherina trasparente, impianto con moncone e corona.
  - Hero: linea luminosa → arcata 3D → spostamento laterale → titolo e pulsanti.
  - Sezione «Il sorriso in 3D»: 5 scene guidate dallo scroll (esplora, prevenzione, trattamenti con punti cliccabili, implantologia, percorso).
  - Pagina Implantologia: modello interattivo (componenti/assemblato, osso e gengiva, rotazione col mouse).
- Tre azioni ovunque: **Prenota una visita** (AlfaDocs reale), **Scrivici su WhatsApp** (wa.me con messaggio precompilato), **Chiama Giulia** (stato demo finché manca il numero).
- Barra fissa su smartphone: Prenota · WhatsApp · Giulia.
- Fallback senza WebGL (immagini statiche generate dallo stesso modello) e supporto a `prefers-reduced-motion`.

## File pronto da aprire
`teramed-demo-offline.html` (nella radice dello zip) è il sito intero in un solo file: si apre con doppio clic nel browser, senza installare nulla. Serve la connessione solo per i font; senza rete usa font di sistema.

## Configurazione
Tutti i dati stanno in **`src/config/site.ts`**: nome, contatti, indirizzo (civico `null` finché non confermato), orari, link AlfaDocs, numero WhatsApp, numero Giulia (`giulia.telefono`), recensioni (valore e numero aggiornabili), team, trattamenti (`confermato: true/false`), dati legali, colori.
- `demo.mostraDaConfermare = false` nasconde tutti i segnaposto «da confermare».
- `analytics.enabled = false`: gli eventi CTA (`src/lib/analytics.ts`) sono predisposti ma nessuno strumento è installato.

## Avvio locale
```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # build classica in dist/ (3D caricato a parte)
npm run build:single # un solo file HTML in dist-single/ (anteprima)
```
Richiede Node 18+.

## Pubblicazione
- Qualsiasi hosting statico (Netlify, Vercel, GitHub Pages): pubblicare la cartella `dist/` (base relativa `./`).
- Prima di andare online per davvero: rimuovere `noindex` in `index.html` e `public/robots.txt`, collegare privacy e cookie policy, cookie banner se si attivano analytics, backend del modulo contatti, dati legali (direttore sanitario, P. IVA, Albo).
- Per la SEO reale conviene passare a URL senza `#` (BrowserRouter + prerender o Next.js) e aggiornare `public/sitemap.xml`.

## Struttura
```
src/config/site.ts        dati del centro (unico punto da modificare)
src/three/anatomy.ts      geometrie procedurali: denti, gengive, impianto
src/three/*.tsx           scene 3D (hero, esperienza, viewer impianto)
src/components/           layout, pulsanti CTA, sezioni
src/pages/                le 6 pagine
src/assets/renders/       immagini statiche del modello 3D (fallback e visual)
src/assets/team/          foto del team (dal profilo AlfaDocs, da sostituire)
```
`test.html` / `render.html` sono banchi di prova usati per generare le immagini statiche (`?view=arcate|gengive|mascherina|molari|impianto|frontale`).
