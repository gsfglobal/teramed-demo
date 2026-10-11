import { site } from '../config/site';

type CtaEvent = 'cta_prenota' | 'cta_whatsapp' | 'cta_giulia' | 'cta_telefono' | 'cta_mappa' | 'cta_recensioni' | 'form_demo';

/**
 * Eventi di conversione predisposti. Nessuno strumento è installato:
 * con `site.analytics.enabled = false` gli eventi restano locali (console in sviluppo).
 * Per attivarli: collegare GA4/GTM tramite dataLayer DOPO cookie banner e informativa.
 */
export function track(event: CtaEvent, detail: Record<string, string> = {}) {
  const payload = { event, ...detail, page: location.hash || '#/' };
  if (site.analytics.enabled) {
    (window as unknown as { dataLayer?: unknown[] }).dataLayer?.push(payload);
  } else if (import.meta.env.DEV) {
    console.debug('[analytics:off]', payload);
  }
}
