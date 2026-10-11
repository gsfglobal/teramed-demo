import { useMemo, useRef, type MutableRefObject } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { DentalArches, defaultArchState, getArch, type ArchState, type Quality } from './DentalArches';
import { getMaterials, Lights, Shadow } from './Stage';

import type { HeroAnim } from './heroAnim';
export type { HeroAnim };

function SmileLine({ anim, quality }: { anim: MutableRefObject<HeroAnim>; quality: Quality }) {
  const { arch } = getArch(false, quality);
  const { core, halo, count } = useMemo(() => {
    // curva della linea: l'arcata a quota del piano occlusale, metà destra e sinistra dal centro
    const pts: THREE.Vector3[] = [];
    const N = 80;
    for (let i = 0; i <= N; i++) {
      const u = 0.5 + (i / N) * 0.47;
      pts.push(arch.curve.getPointAt(u).clone().setY(0.02));
    }
    const path = new THREE.CatmullRomCurve3(pts);
    const core = new THREE.TubeGeometry(path, 200, 0.011, 8, false);
    const halo = new THREE.TubeGeometry(path, 200, 0.04, 10, false);
    return { core, halo, count: core.index!.count };
  }, [arch]);
  const coreMat = useMemo(() => new THREE.MeshBasicMaterial({ color: '#c9ecff', transparent: true, toneMapped: false }), []);
  const haloMat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: '#1aa7e6', transparent: true, opacity: 0.5, blending: THREE.NormalBlending, depthWrite: false, toneMapped: false }),
    [],
  );
  const g = useRef<THREE.Group>(null);
  useFrame(() => {
    const a = anim.current;
    const n = Math.floor((count * a.draw) / 6) * 6;
    core.setDrawRange(0, n);
    halo.setDrawRange(0, Math.floor((halo.index!.count * a.draw) / 6) * 6);
    coreMat.opacity = a.line;
    haloMat.opacity = 0.45 * a.line;
    if (g.current) g.current.visible = a.line > 0.01;
  });
  return (
    <group ref={g}>
      <mesh geometry={core} material={coreMat} />
      <mesh geometry={halo} material={haloMat} />
      <group scale={[-1, 1, 1]}>
        <mesh geometry={core} material={coreMat} />
        <mesh geometry={halo} material={haloMat} />
      </group>
    </group>
  );
}

export function HeroScene({
  anim,
  quality,
  layout,
  pointer,
  scroll,
}: {
  anim: MutableRefObject<HeroAnim>;
  quality: Quality;
  layout: 'side' | 'stack';
  pointer: MutableRefObject<{ x: number; y: number }>;
  scroll: MutableRefObject<number>;
}) {
  const mats = getMaterials();
  const archState = useRef<ArchState>({ ...defaultArchState(), build: 0, gum: 0, open: 0.32 });
  const rig = useRef<THREE.Group>(null);
  const model = useRef<THREE.Group>(null);
  const { camera, size } = useThree();
  const tmp = useMemo(() => new THREE.Vector3(), []);
  const smoothed = useRef({ x: 0, y: 0 });

  useFrame((state, dt) => {
    const a = anim.current;
    archState.current.build = a.build;
    archState.current.gum = a.gum;
    const t = state.clock.elapsedTime;
    // camera: da vicino e frontale (la linea sembra un tratto 2D) ad arretrata
    const near = new THREE.Vector3(0, 0.85, 6.6);
    const aspect = size.width / Math.max(1, size.height);
    const stretch = layout === 'stack' ? Math.max(1, 0.95 / aspect) : Math.max(1, 1.45 / aspect);
    const far = layout === 'side' ? new THREE.Vector3(0, 2.9 * stretch, 19.5 * stretch) : new THREE.Vector3(0, 2.6 * stretch, 16.5 * stretch);
    tmp.copy(near).lerp(far, a.pull);
    const visH = 2 * far.length() * Math.tan((30 * Math.PI) / 360);
    camera.position.copy(tmp);
    camera.lookAt(0, 0, 0);

    smoothed.current.x += (pointer.current.x - smoothed.current.x) * Math.min(1, dt * 3);
    smoothed.current.y += (pointer.current.y - smoothed.current.y) * Math.min(1, dt * 3);
    if (rig.current) {
      const sx = layout === 'side' ? visH * aspect * 0.255 : 0;
      const sy = layout === 'side' ? 0 : -visH * 0.25;
      rig.current.position.set(sx * a.slide, sy * a.slide, 0);
    }
    if (model.current) {
      const turn = -0.45 * a.pull; // rivela la profondità dell'arcata
      const idle = Math.sin(t * 0.35) * 0.06 * a.slide;
      model.current.rotation.y = turn + idle + smoothed.current.x * 0.22 + scroll.current * 0.6;
      model.current.rotation.x = 0.06 + smoothed.current.y * 0.08 + scroll.current * 0.25;
      model.current.position.y = Math.sin(t * 0.6) * 0.05 * a.slide;
    }
  });

  return (
    <>
      <Lights />
      <group ref={rig}>
        <group ref={model}>
          <SmileLine anim={anim} quality={quality} />
          <DentalArches quality={quality} mats={mats} state={archState} />
        </group>
        <Shadow y={-2.4} opacity={0.18} />
      </group>
    </>
  );
}
