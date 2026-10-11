import { useEffect, useMemo, useRef, type MutableRefObject } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { DentalArches, defaultArchState, getArch, type ArchState, type Quality } from './DentalArches';
import { ImplantModel, type ImplantState } from './ImplantModel';
import { getMaterials, Lights, Shadow } from './Stage';

type Key = {
  p: number;
  pos: [number, number, number];
  tgt: [number, number, number];
  archY: number;
  implY: number;
  open: number;
  aligner: number;
  explode: number;
};

// 5 scene: esplora · prevenzione · trattamenti · implantologia · percorso
const KEYS: Key[] = [
  { p: 0.0, pos: [0, 2.8, 16.2], tgt: [0, 0, 0], archY: 0, implY: 10, open: 0.35, aligner: 0, explode: 0.2 },
  { p: 0.25, pos: [1.8, 0.25, 10.4], tgt: [0.15, -0.7, 1.9], archY: 0, implY: 10, open: 0.95, aligner: 0, explode: 0.2 },
  { p: 0.5, pos: [8.6, 3.7, 10.6], tgt: [0, -0.1, 0], archY: 0, implY: 10, open: 0.45, aligner: 1, explode: 0.2 },
  { p: 0.75, pos: [0.4, 0.4, 11.2], tgt: [0, 0.1, 0], archY: -11, implY: 0, open: 0.45, aligner: 0, explode: 1 },
  { p: 1.0, pos: [0, 1.8, 15.2], tgt: [0, 0, 0], archY: 0, implY: 10, open: 0.35, aligner: 0, explode: 0.2 },
];

const sm = (x: number) => x * x * (3 - 2 * x);
function sample(p: number) {
  let i = 0;
  while (i < KEYS.length - 2 && p > KEYS[i + 1].p) i++;
  const a = KEYS[i];
  const b = KEYS[i + 1];
  const raw = THREE.MathUtils.clamp((p - a.p) / (b.p - a.p), 0, 1);
  const t = sm(THREE.MathUtils.clamp((raw - 0.18) / 0.64, 0, 1)); // piccola pausa su ogni scena
  const L = (x: number, y: number) => x + (y - x) * t;
  return {
    pos: new THREE.Vector3(L(a.pos[0], b.pos[0]), L(a.pos[1], b.pos[1]), L(a.pos[2], b.pos[2])),
    tgt: new THREE.Vector3(L(a.tgt[0], b.tgt[0]), L(a.tgt[1], b.tgt[1]), L(a.tgt[2], b.tgt[2])),
    archY: L(a.archY, b.archY),
    implY: L(a.implY, b.implY),
    open: L(a.open, b.open),
    aligner: L(a.aligner, b.aligner),
    explode: L(a.explode, b.explode),
  };
}

export type HotspotId = 'igiene-e-prevenzione' | 'ortodonzia-trasparente' | 'chirurgia-orale' | 'implantologia';

export function ExperienceScene({
  progress,
  quality,
  stack,
  reduced,
  hotspotsVisible,
  active,
  onHotspot,
  labels,
}: {
  progress: MutableRefObject<number>;
  quality: Quality;
  stack: boolean;
  reduced: boolean;
  hotspotsVisible: boolean;
  active: HotspotId | null;
  onHotspot: (id: HotspotId) => void;
  labels: Record<HotspotId, string>;
}) {
  const mats = getMaterials();
  const arch = useRef<ArchState>({ ...defaultArchState() });
  const impl = useRef<ImplantState>({ explode: 0.2, context: 0, labels: 1 });
  const archGroup = useRef<THREE.Group>(null);
  const implGroup = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const smoothP = useRef(0);
  const { camera, size } = useThree();
  useEffect(() => {
    // sposta il centro dell'inquadratura: a destra su desktop (testo a sinistra), in alto su mobile (pannello in basso)
    const cam = camera as THREE.PerspectiveCamera;
    if (stack) cam.setViewOffset(size.width, size.height, 0, size.height * 0.17, size.width, size.height);
    else cam.setViewOffset(size.width, size.height, -size.width * 0.17, 0, size.width, size.height);
    cam.updateProjectionMatrix();
    return () => {
      cam.clearViewOffset();
    };
  }, [camera, size, stack]);

  const spots = useMemo(() => {
    const U = getArch(true, quality).arch.teeth;
    const Lw = getArch(false, quality).arch.teeth;
    const out = (t: (typeof U)[number], n: number, dy: number, dyOpen: number) => {
      const o = new THREE.Vector3(t.position.x, 0, t.position.z).normalize();
      return new THREE.Vector3(t.position.x + o.x * n, t.position.y + dy + dyOpen, t.position.z + o.z * n);
    };
    const lc = Lw.find((t) => t.index === 0 && t.side === 1)!;
    const uc = U.find((t) => t.index === 0 && t.side === -1)!;
    const lm = Lw.find((t) => t.index === 6 && t.side === -1)!;
    const um = U.find((t) => t.index === 5 && t.side === 1)!;
    return [
      { id: 'igiene-e-prevenzione' as HotspotId, pos: out(lc, 0.36, 0.12, -0.225) },
      { id: 'ortodonzia-trasparente' as HotspotId, pos: out(uc, 0.42, -0.45, 0.225) },
      { id: 'chirurgia-orale' as HotspotId, pos: out(lm, 0.1, 0.78, -0.225) },
      { id: 'implantologia' as HotspotId, pos: out(um, 0.15, -0.72, 0.225) },
    ];
  }, [quality]);

  useFrame((state, dt) => {
    const k = reduced ? 1 : 1 - Math.pow(0.0015, dt);
    smoothP.current += (progress.current - smoothP.current) * k;
    const s = sample(smoothP.current);
    const dist = stack ? 1.38 : 1;
    camera.position.copy(s.tgt).add(s.pos.clone().sub(s.tgt).multiplyScalar(dist));
    camera.lookAt(s.tgt.x, s.tgt.y, s.tgt.z);
    arch.current.open = s.open;
    arch.current.aligner = s.aligner;
    impl.current.explode = s.explode;
    impl.current.context = Math.max(0, 1 - s.explode * 1.2);
    if (archGroup.current) {
      archGroup.current.position.y = s.archY;
      archGroup.current.visible = s.archY > -10.5;
    }
    if (implGroup.current) {
      implGroup.current.position.y = s.implY;
      implGroup.current.visible = s.implY < 9.5;
      impl.current.rotY = reduced ? 0.4 : state.clock.elapsedTime * 0.35;
    }
    if (spin.current) {
      const p = smoothP.current;
      const idle = reduced ? 0 : Math.sin(state.clock.elapsedTime * 0.25) * 0.18;
      const w = 1 - THREE.MathUtils.smoothstep(p, 0.05, 0.2) + THREE.MathUtils.smoothstep(p, 0.85, 0.97);
      spin.current.rotation.y = idle * w;
    }
  });

  return (
    <>
      <Lights dark />
      <group ref={archGroup}>
        <group ref={spin}>
          <DentalArches quality={quality} mats={mats} state={arch} />
          {spots.map((s) => (
            <Html key={s.id} position={s.pos} zIndexRange={[30, 0]} style={{ transition: 'opacity .5s', opacity: hotspotsVisible ? 1 : 0, pointerEvents: hotspotsVisible ? 'auto' : 'none' }}>
              <button type="button" className="hotspot" aria-pressed={active === s.id} onClick={() => onHotspot(s.id)} tabIndex={hotspotsVisible ? 0 : -1}>
                <span className="dot" aria-hidden="true" />
                <span className="txt">{labels[s.id]}</span>
              </button>
            </Html>
          ))}
        </group>
        <Shadow y={-2.4} opacity={0.4} />
      </group>
      <group ref={implGroup}>
        <ImplantModel state={impl} scale={stack ? 1.15 : 1.3} />
      </group>
    </>
  );
}
