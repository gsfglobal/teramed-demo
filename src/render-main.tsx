// Harness per generare le immagini statiche (fallback senza WebGL e visual dei trattamenti).
import { createRoot } from 'react-dom/client';
import { Canvas, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { DentalArches, defaultArchState } from './three/DentalArches';
import { ImplantModel } from './three/ImplantModel';
import { getMaterials, Lights, Shadow } from './three/Stage';

const view = new URLSearchParams(location.search).get('view') || 'arcate';
const V: Record<string, { pos: [number, number, number]; tgt: [number, number, number]; open?: number; aligner?: number; fov?: number; rotY?: number }> = {
  arcate: { pos: [6.2, 2.8, 10.8], tgt: [0, -0.1, 0], open: 0.35, rotY: 0 },
  frontale: { pos: [0, 1.2, 13], tgt: [0, 0, 0], open: 0.35 },
  gengive: { pos: [1.3, -0.1, 6.0], tgt: [0, -0.75, 2.1], open: 1.0 },
  mascherina: { pos: [-5.5, 3.4, 9.6], tgt: [0, 0.2, 0], open: 0.8, aligner: 1 },
  molari: { pos: [-8.5, 1.6, 3.2], tgt: [-1.6, -0.3, -0.6], open: 0.9 },
  impianto: { pos: [0.6, 0.4, 10.4], tgt: [0, 0.25, 0] },
};
function Scene() {
  const cfg = V[view];
  const mats = getMaterials();
  const st = useRef({ ...defaultArchState(), open: cfg.open ?? 0.35, aligner: cfg.aligner ?? 0 });
  const impl = useRef({ explode: 1, context: 0, labels: 0 });
  const { camera, invalidate } = useThree();
  useEffect(() => {
    camera.position.set(...cfg.pos);
    camera.lookAt(...cfg.tgt);
    setTimeout(() => { invalidate(); setTimeout(() => { invalidate(); (window as any).__ready = true; }, 1800); }, 400);
  }, [camera, cfg, invalidate]);
  return (<>
    <Lights />
    {view === 'impianto' ? <ImplantModel state={impl} scale={1.45} showLabels={false} /> : <DentalArches quality="high" mats={mats} state={st} />}
    {view !== 'molari' && view !== 'gengive' && <Shadow y={view === 'impianto' ? -2.4 : -2.35} opacity={0.22} />}
  </>);
}
createRoot(document.getElementById('r')!).render(
  <Canvas frameloop="demand" camera={{ position: [0, 0, 10], fov: V[view].fov ?? 32 }} dpr={2} gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
    onCreated={({ gl }) => { gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 0.95; gl.setClearColor(0, 0); }}>
    <Scene />
  </Canvas>
);
