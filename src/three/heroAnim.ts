/** Valori animati dalla timeline GSAP dell'intro (modulo leggero, senza three.js). */
export interface HeroAnim {
  draw: number; // 0..1 la linea luminosa si disegna dal centro
  line: number; // 0..1 opacità della linea
  build: number; // 0..1 comparsa dei denti
  gum: number; // 0..1
  pull: number; // 0..1 la camera arretra
  slide: number; // 0..1 l'arcata si sposta di lato
}
export const heroAnimStart = (): HeroAnim => ({ draw: 0, line: 0, build: 0, gum: 0, pull: 0, slide: 0 });
export const heroAnimEnd = (): HeroAnim => ({ draw: 1, line: 0, build: 1, gum: 1, pull: 1, slide: 1 });
