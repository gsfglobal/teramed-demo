/**
 * Logo Teramed ricostruito in vettoriale dal file pubblico (dente azzurro/grigio, «TERA» azzurro, «MED» scuro).
 * Da sostituire con il file originale fornito dallo studio (vedi site.centro.logoDaSostituire).
 */
type Props = { className?: string; tone?: 'light' | 'dark'; withSub?: boolean; title?: string };

const L = {
  T: (x: number) => `M${x} 48H${x + 22}M${x + 11} 48V78`,
  E: (x: number) => `M${x + 20} 48H${x}V78H${x + 20}M${x} 63H${x + 17}`,
  R: (x: number) => `M${x} 78V48H${x + 12}C${x + 24} 48 ${x + 24} 64 ${x + 12} 64H${x}M${x + 11} 64L${x + 22} 78`,
  A: (x: number) => `M${x} 78L${x + 12} 48L${x + 24} 78`,
  M: (x: number) => `M${x} 78V48L${x + 13} 72L${x + 26} 48V78`,
  D: (x: number) => `M${x} 48V78H${x + 9}C${x + 27} 78 ${x + 27} 48 ${x + 9} 48Z`,
};

export function Logo({ className = '', tone = 'light', withSub = true, title = 'Teramed — Centro Medico Dentistico' }: Props) {
  const sky = '#1aa7e6';
  const grey = tone === 'dark' ? '#6f7d86' : '#a9b0b5';
  const ink = tone === 'dark' ? '#f2f6f8' : '#14212a';
  const xs = [56, 84, 110, 138, 172, 205, 231];
  return (
    <svg className={className} viewBox={`0 0 320 ${withSub ? 138 : 118}`} role="img" aria-label={title}>
      <title>{title}</title>
      <defs>
        <linearGradient id="lg-l" x1="0" x2="1">
          <stop offset="0" stopColor={sky} stopOpacity="0" />
          <stop offset="1" stopColor={sky} />
        </linearGradient>
        <linearGradient id="lg-lg" x1="0" x2="1">
          <stop offset="0" stopColor={grey} stopOpacity="0" />
          <stop offset="1" stopColor={grey} />
        </linearGradient>
        <linearGradient id="lg-r" x1="0" x2="1">
          <stop offset="0" stopColor={grey} />
          <stop offset="1" stopColor={grey} stopOpacity="0" />
        </linearGradient>
        <linearGradient id="lg-rs" x1="0" x2="1">
          <stop offset="0" stopColor={sky} />
          <stop offset="1" stopColor={sky} stopOpacity="0" />
        </linearGradient>
      </defs>
      <g fill="none" strokeLinecap="round" strokeWidth="3.2">
        {/* dente: metà superiore sinistra azzurra, destra grigia; radici invertite */}
        <path d="M160 24C150 12 136 8 126 13C114 19 113 36 116 46" stroke={sky} />
        <path d="M160 24C170 12 184 8 194 13C206 19 207 36 204 46" stroke={grey} />
        <path d="M116 86C118 100 126 112 137 110C148 108 150 96 157 92" stroke={grey} />
        <path d="M163 92C170 96 172 108 183 110C194 112 202 100 204 86" stroke={sky} />
      </g>
      <g strokeWidth="1.6">
        <path d="M18 46H118" stroke="url(#lg-l)" />
        <path d="M202 46H302" stroke="url(#lg-r)" />
        <path d="M18 86H118" stroke="url(#lg-lg)" />
        <path d="M202 86H302" stroke="url(#lg-rs)" />
      </g>
      <g fill="none" strokeWidth="4.4" strokeLinejoin="miter" strokeLinecap="butt">
        <path d={L.T(xs[0])} stroke={sky} />
        <path d={L.E(xs[1])} stroke={sky} />
        <path d={L.R(xs[2])} stroke={sky} />
        <path d={L.A(xs[3])} stroke={sky} />
        <path d={L.M(xs[4])} stroke={ink} />
        <path d={L.E(xs[5])} stroke={ink} />
        <path d={L.D(xs[6])} stroke={ink} />
      </g>
      {withSub && (
        <text
          x="160"
          y="131"
          textAnchor="middle"
          fill={ink}
          style={{ font: '400 17px Newsreader, Georgia, serif', fontVariant: 'small-caps', letterSpacing: '0.06em' }}
        >
          Centro Medico Dentistico
        </text>
      )}
    </svg>
  );
}
