import { useMemo, useRef, type MutableRefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { abutmentGeometry, crownGeometry, implantFixtureGeometry, MM } from './anatomy';
import { getMaterials } from './Stage';

let geo: { fixture: THREE.BufferGeometry; abutment: THREE.BufferGeometry; crown: THREE.BufferGeometry; bone: THREE.BufferGeometry; gum: THREE.BufferGeometry } | null = null;
function geometries() {
  if (geo) return geo;
  // blocco di osso e gengiva in sezione, solo illustrativo
  const bone = new THREE.BoxGeometry(9 * MM, 13 * MM, 7 * MM, 1, 1, 1);
  bone.translate(0, -6.6 * MM, 0);
  const gum = new THREE.CapsuleGeometry(3.6 * MM, 5.6 * MM, 8, 24);
  gum.rotateZ(Math.PI / 2);
  gum.scale(1, 0.55, 0.95);
  gum.translate(0, 0.6 * MM, 0);
  geo = { fixture: implantFixtureGeometry(), abutment: abutmentGeometry(), crown: crownGeometry(), bone, gum };
  return geo;
}

export interface ImplantState {
  explode: number; // 0 assemblato, 1 esploso
  context: number; // 0..1 visibilità di osso e gengiva
  labels: number; // 0..1
  rotY?: number; // rotazione delle sole componenti (le etichette restano ferme)
}

export function ImplantModel({ state, scale = 1.6, showLabels = true }: { state: MutableRefObject<ImplantState>; scale?: number; showLabels?: boolean }) {
  const g = useMemo(geometries, []);
  const mats = getMaterials();
  const boneMat = useMemo(
    () => new THREE.MeshPhysicalMaterial({ color: '#eadfcb', roughness: 0.75, transparent: true, opacity: 0.28, depthWrite: false, side: THREE.DoubleSide }),
    [],
  );
  const gumMat = useMemo(
    () => new THREE.MeshPhysicalMaterial({ color: '#e08a91', roughness: 0.45, transparent: true, opacity: 0.38, depthWrite: false, side: THREE.DoubleSide, clearcoat: 0.3 }),
    [],
  );
  const abut = useRef<THREE.Group>(null);
  const crown = useRef<THREE.Group>(null);
  const ctx = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const lAbut = useRef<THREE.Group>(null);
  const lCrown = useRef<THREE.Group>(null);
  const labelsRef = useRef<HTMLDivElement[]>([]);

  useFrame(() => {
    const s = state.current;
    const e = s.explode;
    if (abut.current) abut.current.position.y = e * 0.45;
    if (crown.current) crown.current.position.y = 2.1 * MM + e * 1.1;
    if (lAbut.current) lAbut.current.position.y = e * 0.45 + 0.4;
    if (lCrown.current) lCrown.current.position.y = 2.1 * MM + e * 1.1 + 0.45;
    if (spin.current && s.rotY !== undefined) spin.current.rotation.y = s.rotY;
    const c = s.context * (1 - e);
    boneMat.opacity = 0.28 * c;
    gumMat.opacity = 0.4 * c;
    if (ctx.current) ctx.current.visible = c > 0.02;
    labelsRef.current.forEach((el) => {
      if (el) el.style.opacity = String(Math.max(0, Math.min(1, s.labels * (e * 1.4 - 0.2))));
    });
  });

  const label = (i: number, text: string, sub: string) =>
    showLabels ? (
      <Html position={[0.66, 0, 0]} zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
        <div ref={(el) => el && (labelsRef.current[i] = el)} className="label3d" style={{ opacity: 0 }}>
          <span style={{ display: 'inline-block', width: 26, height: 1, background: '#1aa7e6', verticalAlign: 'middle', marginRight: 8 }} />
          <strong style={{ fontWeight: 500 }}>{text}</strong>
          <span style={{ display: 'block', marginLeft: 34, color: '#55636d' }}>{sub}</span>
        </div>
      </Html>
    ) : null;

  return (
    <group scale={scale} position={[0, -0.55 * scale, 0]}>
      <group ref={spin}>
        <group ref={ctx}>
          <mesh geometry={g.bone} material={boneMat} renderOrder={4} />
          <mesh geometry={g.gum} material={gumMat} renderOrder={5} />
        </group>
        <mesh geometry={g.fixture} material={mats.titanium} />
        <group ref={abut}>
          <mesh geometry={g.abutment} material={mats.titaniumSatin} />
        </group>
        <group ref={crown}>
          <mesh geometry={g.crown} material={mats.ceramic} />
        </group>
      </group>
      {/* etichette fuori dal gruppo che ruota */}
      <group position={[0, -0.55, 0]}>{label(0, 'Impianto in titanio', 'la radice artificiale')}</group>
      <group ref={lAbut}>{label(1, 'Moncone', 'collega impianto e corona')}</group>
      <group ref={lCrown}>{label(2, 'Corona protesica', 'la parte visibile del dente')}</group>
    </group>
  );
}
