/**
 * Geometrie anatomiche procedurali (nessun file 3D esterno).
 * Unità: 1 = 1 cm (le misure anatomiche sono scritte in mm e convertite con MM).
 * Modello illustrativo ed educativo: proporzioni medie, non un caso clinico reale.
 */
import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export const MM = 0.1;

export type ToothKind = 'centrale' | 'laterale' | 'canino' | 'premolare1' | 'premolare2' | 'molare1' | 'molare2';
type Family = 'incisivo' | 'canino' | 'premolare' | 'molare';

interface ToothSpec {
  kind: ToothKind;
  family: Family;
  W: number; // larghezza mesio-distale al punto di contatto (mm)
  D: number; // spessore vestibolo-linguale massimo (mm)
  H: number; // altezza della corona (mm)
}

const UPPER: ToothSpec[] = [
  { kind: 'centrale', family: 'incisivo', W: 8.6, D: 7.0, H: 10.6 },
  { kind: 'laterale', family: 'incisivo', W: 6.6, D: 6.2, H: 9.0 },
  { kind: 'canino', family: 'canino', W: 7.6, D: 8.0, H: 10.0 },
  { kind: 'premolare1', family: 'premolare', W: 7.0, D: 9.0, H: 8.4 },
  { kind: 'premolare2', family: 'premolare', W: 6.6, D: 9.0, H: 7.8 },
  { kind: 'molare1', family: 'molare', W: 10.2, D: 11.0, H: 7.4 },
  { kind: 'molare2', family: 'molare', W: 9.2, D: 10.6, H: 7.0 },
];
const LOWER: ToothSpec[] = [
  { kind: 'centrale', family: 'incisivo', W: 5.4, D: 5.8, H: 9.0 },
  { kind: 'laterale', family: 'incisivo', W: 5.9, D: 6.0, H: 9.4 },
  { kind: 'canino', family: 'canino', W: 7.0, D: 7.6, H: 10.6 },
  { kind: 'premolare1', family: 'premolare', W: 7.0, D: 7.8, H: 8.2 },
  { kind: 'premolare2', family: 'premolare', W: 7.1, D: 8.2, H: 7.8 },
  { kind: 'molare1', family: 'molare', W: 11.0, D: 10.4, H: 7.4 },
  { kind: 'molare2', family: 'molare', W: 10.4, D: 10.0, H: 7.0 },
];

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const sgnpow = (v: number, e: number) => Math.sign(v) * Math.pow(Math.abs(v), e);

/** Rilievo della superficie occlusale/incisale in coordinate normalizzate (xn mesio-distale, zn vestibolo-linguale). */
function cuspField(family: Family, xn: number, zn: number): number {
  const g = (cx: number, cz: number, sx: number, sz: number, h: number) =>
    h * Math.exp(-(((xn - cx) / sx) ** 2 + ((zn - cz) / sz) ** 2));
  switch (family) {
    case 'molare':
      return (
        g(-0.48, 0.42, 0.36, 0.36, 1.05) +
        g(0.5, 0.42, 0.34, 0.34, 0.95) +
        g(-0.46, -0.44, 0.38, 0.36, 1.15) +
        g(0.48, -0.44, 0.34, 0.34, 0.9) -
        g(0, 0, 0.55, 0.18, 0.55) -
        g(0, 0, 0.16, 0.7, 0.25)
      ) * 1.9;
    case 'premolare':
      return (g(0, 0.46, 0.55, 0.36, 1.2) + g(0, -0.46, 0.5, 0.34, 0.85) - g(0, 0, 0.7, 0.16, 0.35)) * 1.9;
    case 'canino':
      return g(0, 0.15, 0.42, 0.9, 1) * 2.4 + g(0, 0.1, 0.12, 0.9, 0.25);
    default:
      // incisivi: margine incisale appena ondulato
      return 0.12 * Math.cos(xn * Math.PI * 1.5) * (1 - xn * xn);
  }
}

export interface ToothGeometryOptions {
  segAround?: number;
  rootMM?: number; // porzione di radice sotto il margine gengivale
}

/**
 * Corona dentale come sweep di sezioni a super-ellisse lungo l'altezza.
 * Spazio locale: x = mesio-distale, z = vestibolare (+), y = asse della corona (0 = colletto, +H = margine incisale/occlusale).
 */
export function toothGeometry(spec: ToothSpec, opts: ToothGeometryOptions = {}): THREE.BufferGeometry {
  const seg = opts.segAround ?? 56;
  const R = opts.rootMM ?? 4.5;
  const { family, W, D, H } = spec;
  const anterior = family === 'incisivo' || family === 'canino';
  const Wc = W * (anterior ? 0.72 : 0.74);
  const Dc = D * (anterior ? 0.86 : 0.88);
  const e2 = family === 'molare' ? 0.62 : family === 'premolare' ? 0.78 : 0.72;
  const edgeRatio = family === 'incisivo' ? 0.16 : family === 'canino' ? 0.42 : 1;
  const topRound = family === 'incisivo' ? 0.7 : family === 'canino' ? 1.6 : 1.4;

  const widthAt = (y: number) => {
    const c = y / H;
    if (c < 0) return Wc * (1 + 0.12 * (y / R));
    let w = mix(Wc, W, smooth(0, anterior ? 0.62 : 0.58, c));
    if (!anterior) w *= mix(1, 0.9, smooth(0.72, 1, c));
    if (family === 'canino') w *= mix(1, 0.86, smooth(0.7, 1, c));
    return w;
  };
  const depthAt = (y: number) => {
    const c = y / H;
    if (c < 0) return Dc * (1 + 0.12 * (y / R));
    if (anterior) {
      const d0 = mix(Dc, D, smooth(0, 0.22, c));
      return mix(d0, D * edgeRatio, smooth(0.22, 1.0, c));
    }
    return mix(Dc, D, smooth(0, 0.34, c)) * mix(1, 0.8, smooth(0.55, 1, c));
  };
  const offsetZ = (y: number) => {
    if (!anterior) return 0;
    const d = depthAt(y);
    return ((D - d) / 2) * 0.82; // il lato vestibolare resta pieno, assottiglia il lato linguale
  };

  // Profilo verticale: [r (0..1 radiale), y (mm), peso del rilievo occlusale]
  const prof: [number, number, number][] = [];
  const yBottom = -R;
  const rb = 1.6;
  for (let i = 0; i <= 6; i++) {
    const a = (i / 6) * (Math.PI / 2);
    prof.push([Math.sin(a), yBottom + rb * (1 - Math.cos(a)), 0]);
  }
  const yTopSide = H - topRound;
  const sideRings = 34;
  for (let i = 1; i <= sideRings; i++) {
    const t = i / sideRings;
    prof.push([1, mix(yBottom + rb, yTopSide, t), 0]);
  }
  const k = 0.32; // quanto del raggio viene "girato" nel bordo arrotondato
  for (let i = 1; i <= 9; i++) {
    const a = (i / 9) * (Math.PI / 2);
    prof.push([1 - k * (1 - Math.cos(a)), yTopSide + topRound * Math.sin(a), Math.pow(i / 9, 1.6)]);
  }
  const capRings = 16;
  for (let i = 1; i <= capRings; i++) {
    const t = i / capRings;
    prof.push([(1 - k) * (1 - t), H, 1]);
  }

  const positions: number[] = [];
  const colors: number[] = [];
  const indices: number[] = [];
  const colCervical = new THREE.Color('#dcc7a3');
  const colBody = new THREE.Color('#ebe2d0');
  const colEdge = new THREE.Color('#d6dde1');
  const tmp = new THREE.Color();

  const ringCount = prof.length;
  for (let j = 0; j < ringCount; j++) {
    const [r, y, capW] = prof[j];
    const w = widthAt(y) / 2;
    const d = depthAt(y) / 2;
    const oz = offsetZ(y);
    for (let i = 0; i <= seg; i++) {
      const om = (i / seg) * Math.PI * 2;
      const px = sgnpow(Math.cos(om), e2);
      const pz = sgnpow(Math.sin(om), e2);
      const xn = r * px;
      const zn = r * pz;
      let yy = y;
      if (capW > 0) yy += capW * cuspField(family, xn, zn) * (family === 'incisivo' ? 1 : 1);
      // leggera convessità vestibolare
      const bulge = anterior && pz > 0 ? 0.25 * pz * Math.sin(Math.min(1, Math.max(0, y / H)) * Math.PI) : 0;
      positions.push(xn * w * MM, yy * MM, (zn * d + oz + bulge) * MM);
      const c = Math.max(0, y / H);
      tmp.copy(colCervical).lerp(colBody, smooth(0, 0.35, c));
      if (anterior) tmp.lerp(colEdge, smooth(0.7, 1, c) * 0.85);
      colors.push(tmp.r, tmp.g, tmp.b);
    }
  }
  const stride = seg + 1;
  for (let j = 0; j < ringCount - 1; j++) {
    for (let i = 0; i < seg; i++) {
      const a = j * stride + i;
      const b = a + stride;
      indices.push(a, a + 1, b, b, a + 1, b + 1);
    }
  }
  let g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  g.setIndex(indices);
  g = mergeVertices(g, 1e-6);
  g.computeVertexNormals();
  return g;
}

/* ------------------------------------------------------------------ arcata */

export interface PlacedTooth {
  spec: ToothSpec;
  side: -1 | 1;
  index: number; // 0 = centrale
  arc: number; // posizione lungo l'arcata (mm, 0 = linea mediana)
  position: THREE.Vector3;
  quaternion: THREE.Quaternion;
  cervicalY: number; // quota del colletto (unità scena)
}

export interface ArchData {
  upper: boolean;
  teeth: PlacedTooth[];
  curve: THREE.CatmullRomCurve3; // curva dell'arcata a quota 0 (mm*MM)
  halfLength: number; // mm
  lengthMM: number;
  arcToT: (arcMM: number) => number;
}

function archCurve(scale: number) {
  // mezza arcata destra in mm, linea mediana in avanti (+z)
  const half: [number, number][] = [
    [0, 26],
    [7.5, 24.6],
    [13.6, 21.2],
    [18.4, 16.2],
    [21.6, 10],
    [24.2, 2.6],
    [26.4, -6],
    [28.2, -15],
    [29.6, -24],
    [30.6, -31],
  ];
  const pts: THREE.Vector3[] = [];
  for (let i = half.length - 1; i > 0; i--) pts.push(new THREE.Vector3(-half[i][0] * scale, 0, half[i][1] * scale));
  for (let i = 0; i < half.length; i++) pts.push(new THREE.Vector3(half[i][0] * scale, 0, half[i][1] * scale));
  return new THREE.CatmullRomCurve3(pts.map((p) => p.multiplyScalar(MM)), false, 'centripetal');
}

export function buildArch(upper: boolean): ArchData {
  const specs = upper ? UPPER : LOWER;
  const curve = archCurve(upper ? 1 : 0.93);
  const total = curve.getLength() / MM; // mm
  const mid = total / 2;
  const arcToT = (arcMM: number) => curve.getUtoTmapping((mid + arcMM) / total, 0);
  const teeth: PlacedTooth[] = [];
  const gap = 0.12;
  for (const side of [-1, 1] as const) {
    let acc = 0;
    specs.forEach((spec, index) => {
      const center = acc + spec.W / 2;
      acc += spec.W + gap;
      const arc = side * center;
      const t = arcToT(arc);
      const p = curve.getPointAt(Math.min(1, Math.max(0, (mid + arc) / total)));
      const tangent = curve.getTangentAt(Math.min(1, Math.max(0, (mid + arc) / total))).normalize();
      const up = new THREE.Vector3(0, 1, 0);
      const outward = new THREE.Vector3().crossVectors(tangent, up).normalize(); // verso l'esterno dell'arcata
      if (outward.z * p.z + outward.x * p.x < 0) outward.negate();
      const xAxis = new THREE.Vector3().crossVectors(up, outward).normalize();
      const m = new THREE.Matrix4().makeBasis(xAxis, up, outward);
      const q = new THREE.Quaternion().setFromRotationMatrix(m);
      // inclinazioni: incisivi superiori leggermente proinclinati, molari con lieve inclinazione linguale
      const torque = spec.family === 'incisivo' ? (upper ? 0.2 : 0.12) : spec.family === 'canino' ? 0.1 : spec.family === 'premolare' ? 0.02 : -0.06;
      const tilt = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), upper ? torque : -torque);
      q.multiply(tilt);
      if (upper) q.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI));
      // piano occlusale a y = 0: i denti superiori scendono, gli inferiori salgono
      const overbite = spec.family === 'incisivo' ? 1.2 : spec.family === 'canino' ? 0.8 : 0;
      const cervY = upper ? (spec.H - overbite) * MM : -(spec.H - overbite * 0.4) * MM;
      const pos = p.clone();
      pos.y = cervY;
      teeth.push({ spec, side, index, arc, position: pos, quaternion: q, cervicalY: cervY });
      void t;
    });
  }
  teeth.sort((a, b) => a.arc - b.arc);
  const lastW = specs.reduce((s, x) => s + x.W + gap, 0);
  return { upper, teeth, curve, halfLength: lastW, lengthMM: total, arcToT };
}

/* ------------------------------------------------------------------ gengiva */

export function gumGeometry(arch: ArchData, segU = 300, segV = 44): THREE.BufferGeometry {
  const { teeth, curve, lengthMM } = arch;
  const s = arch.upper ? -1 : 1; // direzione "verso la corona" in y: inferiore +1, superiore -1
  const mid = lengthMM / 2;
  const ext = 7; // mm oltre l'ultimo molare (trigono retromolare)
  const startArc = -arch.halfLength - ext;
  const endArc = arch.halfLength + ext;

  // contatti tra denti adiacenti: altezza della papilla
  type Seg = { a: number; b: number; c: number; cerv: number; pl: number; pr: number; dLab: number; dLin: number };
  const segs: Seg[] = teeth.map((t) => {
    const cervMM = t.cervicalY / MM;
    // il margine gengivale copre ~0.8 mm di corona
    const margin = cervMM + s * 0.35;
    return {
      a: t.arc - t.spec.W / 2,
      b: t.arc + t.spec.W / 2,
      c: t.arc,
      cerv: margin,
      pl: margin,
      pr: margin,
      dLab: (t.spec.D * 0.86) / 2,
      dLin: (t.spec.D * 0.86) / 2,
    };
  });
  for (let i = 0; i < segs.length - 1; i++) {
    const A = segs[i];
    const B = segs[i + 1];
    const fam = teeth[i].spec.family;
    const pap = fam === 'incisivo' ? 2.7 : fam === 'canino' ? 2.5 : fam === 'premolare' ? 2.1 : 1.7;
    const tip = s > 0 ? Math.max(A.cerv, B.cerv) + pap : Math.min(A.cerv, B.cerv) - pap;
    A.pr = tip;
    B.pl = tip;
  }
  const first = segs[0];
  const last = segs[segs.length - 1];

  const marginAt = (arc: number) => {
    if (arc <= first.a) return { m: first.cerv, dl: first.dLab, dn: first.dLin, end: 1 - (arc - startArc) / (first.a - startArc) };
    if (arc >= last.b) return { m: last.cerv, dl: last.dLab, dn: last.dLin, end: (arc - last.b) / (endArc - last.b) };
    let sg = segs[0];
    for (const x of segs) if (arc >= x.a - 0.06 && arc <= x.b + 0.06) { sg = x; break; }
    const t = Math.max(-1, Math.min(1, (arc - sg.c) / ((sg.b - sg.a) / 2)));
    const target = t < 0 ? sg.pl : sg.pr;
    const m = sg.cerv + (target - sg.cerv) * Math.pow(Math.abs(t), 2.3);
    const narrow = 1 - 0.18 * Math.pow(Math.abs(t), 3);
    return { m, dl: sg.dLab * narrow, dn: sg.dLin * narrow, end: 0 };
  };

  // base piatta dell'arcata (quota assoluta), così il bordo inferiore non segue la smerlatura
  const margins = segs.map((x) => x.cerv);
  const baseY = s > 0 ? Math.min(...margins) - 10 : Math.max(...margins) + 10;

  // profilo della sezione (n = verso l'esterno; y assoluta in mm) — chiuso
  const profile = (lab: number, lin: number, m: number) => {
    const P = (n: number, dy: number) => new THREE.Vector3(n, m + s * dy, 0);
    const B = (n: number, f: number) => new THREE.Vector3(n, mix(m, baseY, f), 0);
    const pts = [
      P(lab + 0.16, 0),
      P(lab + 0.95, -1.8),
      B(lab + 1.7, 0.42),
      B(lab + 1.5, 0.82),
      B(lab * 0.5, 1),
      B(-lin * 0.5, 1),
      B(-lin - 1.5, 0.82),
      B(-lin - 1.6, 0.42),
      P(-lin - 0.9, -1.8),
      P(-lin - 0.16, 0),
      P(-lin * 0.35, -0.9),
      P(lab * 0.35, -0.9),
    ];
    return new THREE.CatmullRomCurve3(pts, true, 'catmullrom', 0.35);
  };

  const positions: number[] = [];
  const colors: number[] = [];
  const indices: number[] = [];
  const cMargin = new THREE.Color('#ee9f9d');
  const cAttached = new THREE.Color('#dd7f87');
  const cMucosa = new THREE.Color('#bf5d6d');
  const tmp = new THREE.Color();
  const up = new THREE.Vector3(0, 1, 0);

  for (let iu = 0; iu <= segU; iu++) {
    const arc = mix(startArc, endArc, iu / segU);
    const u = Math.min(1, Math.max(0, (mid + arc) / lengthMM));
    const p = curve.getPointAt(u);
    const tan = curve.getTangentAt(u).normalize();
    const out = new THREE.Vector3().crossVectors(tan, up).normalize();
    if (out.x * p.x + out.z * p.z < 0) out.negate();
    const mg = marginAt(arc);
    const endScale = mg.end > 0 ? Math.sqrt(Math.max(0, 1 - mg.end * mg.end)) : 1;
    const prof = profile(mg.dl, mg.dn, mg.m);
    const center = new THREE.Vector3(0, mix(mg.m, baseY, 0.55), 0);
    for (let iv = 0; iv <= segV; iv++) {
      const q = prof.getPoint(iv / segV);
      // rastrema le estremità verso il centro della sezione
      const n = mix(center.x, q.x, endScale);
      const yy = mix(center.y, q.y, endScale);
      positions.push(p.x + out.x * n * MM, yy * MM, p.z + out.z * n * MM);
      const depth = Math.abs(yy - mg.m); // distanza dal margine (mm)
      tmp.copy(cMargin).lerp(cAttached, smooth(0.2, 2.2, depth)).lerp(cMucosa, smooth(3.5, 8, depth));
      colors.push(tmp.r, tmp.g, tmp.b);
    }
  }
  const stride = segV + 1;
  for (let iu = 0; iu < segU; iu++) {
    for (let iv = 0; iv < segV; iv++) {
      const a = iu * stride + iv;
      const b = a + stride;
      if (s > 0) indices.push(a, a + 1, b, a + 1, b + 1, b);
      else indices.push(a, b, a + 1, a + 1, b, b + 1);
    }
  }
  let g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  g.setIndex(indices);
  g = mergeVertices(g, 1e-5);
  g.computeVertexNormals();
  return g;
}

/* ------------------------------------------------------------------ impianto */

/** Fixture con filettatura elicoidale reale. y = 0 piattaforma, verso il basso l'apice. */
export function implantFixtureGeometry(segAround = 72, segY = 260): THREE.BufferGeometry {
  const L = 11; // mm
  const pitch = 0.85;
  const depth = 0.42;
  const collar = 1.3;
  const positions: number[] = [];
  const indices: number[] = [];
  const core = (y: number) => {
    // y in [0, L] dall'alto
    if (y < collar) return 2.05 - 0.12 * (y / collar);
    const t = (y - collar) / (L - collar);
    let r = mix(1.86, 1.25, Math.pow(t, 1.4));
    if (y > L - 1.4) r *= Math.sqrt(Math.max(0, 1 - ((y - (L - 1.4)) / 1.4) ** 2)) * 0.6 + 0.4;
    return r;
  };
  const mask = (y: number) => smooth(collar, collar + 1.1, y) * (1 - smooth(L - 1.3, L - 0.2, y));
  const rows: number[][] = [];
  // tappo superiore (piattaforma con connessione interna appena accennata)
  const rings: { y: number; r: (th: number) => number }[] = [];
  rings.push({ y: -0.0, r: () => 0.0 });
  rings.push({ y: -0.0, r: () => 0.9 });
  rings.push({ y: 0.0, r: () => 1.95 });
  for (let j = 0; j <= segY; j++) {
    const y = (j / segY) * L;
    rings.push({
      y,
      r: (th: number) => {
        const phase = ((y / pitch - th / (Math.PI * 2)) % 1 + 1) % 1;
        const ridge = Math.pow(1 - Math.abs(2 * phase - 1), 0.75);
        return core(y) + depth * ridge * mask(y);
      },
    });
  }
  rings.push({ y: L + 0.05, r: () => 0.0 });
  rings.forEach((ring) => {
    const row: number[] = [];
    for (let i = 0; i <= segAround; i++) {
      const th = (i / segAround) * Math.PI * 2;
      const r = ring.r(th);
      row.push(positions.length / 3);
      positions.push(Math.cos(th) * r * MM, -ring.y * MM, Math.sin(th) * r * MM);
    }
    rows.push(row);
  });
  for (let j = 0; j < rows.length - 1; j++)
    for (let i = 0; i < segAround; i++) {
      const a = rows[j][i], b = rows[j + 1][i], c = rows[j][i + 1], d = rows[j + 1][i + 1];
      indices.push(a, c, b, c, d, b);
    }
  let g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  g.setIndex(indices);
  g = mergeVertices(g, 1e-6);
  g.computeVertexNormals();
  return g;
}

/** Moncone protesico: colletto transmucoso e pilastro conico. y = 0 base (si avvita sulla piattaforma). */
export function abutmentGeometry(): THREE.BufferGeometry {
  const pts = [
    [0, 0],
    [1.9, 0],
    [2.05, 0.4],
    [2.45, 1.6],
    [2.5, 2.1],
    [1.75, 2.4],
    [1.62, 3.4],
    [1.38, 6.2],
    [1.2, 6.65],
    [0.6, 6.85],
    [0, 6.88],
  ].map(([r, y]) => new THREE.Vector2(r * MM, y * MM));
  const g = new THREE.LatheGeometry(pts, 72);
  g.computeVertexNormals();
  return g;
}

/** Corona protesica: geometria del primo molare inferiore senza radice. */
export function crownGeometry(): THREE.BufferGeometry {
  return toothGeometry(LOWER[5], { rootMM: 1.2, segAround: 64 });
}

export function specFor(upper: boolean, index: number) {
  return (upper ? UPPER : LOWER)[index];
}
