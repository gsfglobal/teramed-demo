import { createRoot } from 'react-dom/client';
import { Canvas, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { DentalArches, defaultArchState } from './three/DentalArches';
import { makeMaterials, studioEnvironment } from './three/materials';
import { implantFixtureGeometry, abutmentGeometry, crownGeometry } from './three/anatomy';

const params = new URLSearchParams(location.search);
const view = params.get('view') || 'front';
const cams: Record<string, [number, number, number]> = {
  front: [0, 0.4, 13], three: [8, 3.5, 10], top: [0, 9.5, 1.2], close: [2.2, 0.2, 5.2], implant: [0, 0, 4],
};
function Env() {
  const { gl, scene } = useThree();
  useEffect(() => { scene.environment = studioEnvironment(gl); }, [gl, scene]);
  return null;
}
function Scene() {
  const mats = useMemo(() => makeMaterials(), []);
  const state = useRef({ ...defaultArchState(), open: Number(params.get('open') ?? 0.35), aligner: Number(params.get('aligner') ?? 0) });
  const fx = useMemo(() => implantFixtureGeometry(), []);
  const ab = useMemo(() => abutmentGeometry(), []);
  const cr = useMemo(() => crownGeometry(), []);
  const { camera, invalidate } = useThree();
  useEffect(() => { camera.lookAt(0, view === 'implant' ? 0 : 0, 0); setTimeout(() => { invalidate(); setTimeout(() => ((window as any).__ready = true), 1500); }, 300); }, [camera]);
  return (<>
    <Env />
    <ambientLight intensity={0.12} />
    <directionalLight position={[-3, 6, 5]} intensity={1.5} color="#fff6ea" />
    <directionalLight position={[-5, 2, -3]} intensity={0.8} color="#bfe6ff" />
    {view === 'implant' ? (
      <group>
        <mesh geometry={cr} material={mats.ceramic} position={[0, 0.9, 0]} />
        <mesh geometry={ab} material={mats.titaniumSatin} position={[0, 0.1, 0]} />
        <mesh geometry={fx} material={mats.titanium} position={[0, -0.25, 0]} />
      </group>
    ) : <DentalArches quality="high" mats={mats} state={state} />}
  </>);
}
createRoot(document.getElementById('r')!).render(
  <Canvas frameloop="demand" camera={{ position: cams[view], fov: 32 }} gl={{ antialias: true, preserveDrawingBuffer: true }} dpr={1}
    onCreated={({ gl }) => { gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 0.95; }}>
    <Scene />
  </Canvas>
);
