import { useMemo, useRef, type MutableRefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { buildArch, gumGeometry, toothGeometry, type ArchData } from './anatomy';
import type { Materials } from './materials';

export type Quality = 'high' | 'low';

interface ArchAssets {
  arch: ArchData;
  gum: THREE.BufferGeometry;
  teeth: THREE.BufferGeometry[]; // indicizzate per index del dente (0..6)
  shells: THREE.BufferGeometry[]; // solo corona, per la mascherina trasparente
}

const cache = new Map<string, ArchAssets>();
export function getArch(upper: boolean, quality: Quality): ArchAssets {
  const key = `${upper ? 'U' : 'L'}-${quality}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const arch = buildArch(upper);
  const segAround = quality === 'high' ? 56 : 32;
  const teeth: THREE.BufferGeometry[] = [];
  const shells: THREE.BufferGeometry[] = [];
  arch.teeth.forEach((t) => {
    if (!teeth[t.index]) teeth[t.index] = toothGeometry(t.spec, { segAround });
    if (upper && !shells[t.index]) shells[t.index] = toothGeometry(t.spec, { segAround: 32, rootMM: 0.3 });
  });
  const gum = gumGeometry(arch, quality === 'high' ? 300 : 170, quality === 'high' ? 44 : 30);
  const assets = { arch, gum, teeth, shells };
  cache.set(key, assets);
  return assets;
}

/** Stato animabile condiviso (scritto da GSAP/scroll, letto ogni frame). */
export interface ArchState {
  build: number; // 0..1 comparsa progressiva dei denti dalla linea mediana
  open: number; // apertura tra le arcate (cm)
  gum: number; // 0..1 opacità della gengiva
  aligner: number; // 0..1 mascherina trasparente sull'arcata superiore
  upperVisible: number; // 0..1
  lowerVisible: number;
  focusTooth: number | null; // dente superiore evidenziato (arc index)
}

export const defaultArchState = (): ArchState => ({ build: 1, open: 0.35, gum: 1, aligner: 0, upperVisible: 1, lowerVisible: 1, focusTooth: null });

function Arch({ upper, quality, mats, state }: { upper: boolean; quality: Quality; mats: Materials; state: MutableRefObject<ArchState> }) {
  const { arch, gum, teeth, shells } = useMemo(() => getArch(upper, quality), [upper, quality]);
  const group = useRef<THREE.Group>(null);
  const toothRefs = useRef<(THREE.Mesh | null)[]>([]);
  const gumRef = useRef<THREE.Mesh>(null);
  const alignerRefs = useRef<(THREE.Mesh | null)[]>([]);
  const gumMat = useMemo(() => {
    const m = mats.gum.clone();
    m.transparent = true;
    return m;
  }, [mats]);
  const maxArc = arch.halfLength;

  useFrame(() => {
    const s = state.current;
    if (group.current) {
      const vis = upper ? s.upperVisible : s.lowerVisible;
      group.current.visible = vis > 0.01;
      group.current.position.y = (upper ? 1 : -1) * s.open * 0.5;
    }
    arch.teeth.forEach((t, i) => {
      const m = toothRefs.current[i];
      if (!m) return;
      const delay = Math.abs(t.arc) / maxArc; // 0 al centro, 1 in fondo
      const k = THREE.MathUtils.clamp((s.build * 1.6 - delay * 0.6) / 1, 0, 1);
      const e = 1 - Math.pow(1 - k, 3);
      m.scale.setScalar(Math.max(0.0001, e));
      m.visible = e > 0.002;
      const a = alignerRefs.current[i];
      if (a) {
        a.scale.set(Math.max(0.0001, e) * 1.07, Math.max(0.0001, e) * 1.03, Math.max(0.0001, e) * 1.1);
        a.visible = s.aligner > 0.01 && e > 0.5;
      }
    });
    if (gumRef.current) {
      gumMat.opacity = s.gum;
      gumMat.depthWrite = s.gum > 0.98;
      gumRef.current.visible = s.gum > 0.01;
    }
    if (upper) mats.aligner.opacity = 0.5 * s.aligner;
  });

  return (
    <group ref={group}>
      <mesh ref={gumRef} geometry={gum} material={gumMat} renderOrder={1} />
      {arch.teeth.map((t, i) => (
        <group key={i} position={t.position} quaternion={t.quaternion}>
          <mesh ref={(el) => (toothRefs.current[i] = el)} geometry={teeth[t.index]} material={mats.enamel} />
          {upper && (
            <mesh
              ref={(el) => (alignerRefs.current[i] = el)}
              geometry={shells[t.index]}
              material={mats.aligner}
              renderOrder={3}
              scale={1.06}
            />
          )}
        </group>
      ))}
    </group>
  );
}

export function DentalArches({ quality, mats, state }: { quality: Quality; mats: Materials; state: MutableRefObject<ArchState> }) {
  return (
    <group>
      <Arch upper quality={quality} mats={mats} state={state} />
      <Arch upper={false} quality={quality} mats={mats} state={state} />
    </group>
  );
}
