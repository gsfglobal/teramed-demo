import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { makeMaterials, studioEnvironment, type Materials } from './materials';

let sharedMats: Materials | null = null;
export const getMaterials = () => (sharedMats ??= makeMaterials());

function Env() {
  const { gl, scene } = useThree();
  useEffect(() => {
    scene.environment = studioEnvironment(gl);
  }, [gl, scene]);
  return null;
}

export function Lights({ dark = false }: { dark?: boolean }) {
  return (
    <>
      <Env />
      <ambientLight intensity={dark ? 0.08 : 0.12} />
      <directionalLight position={[-3, 6, 5]} intensity={dark ? 1.35 : 1.5} color="#fff6ea" />
      <directionalLight position={[5, 1.5, -4]} intensity={dark ? 1.4 : 0.8} color="#9fdcff" />
      <directionalLight position={[0, -4, 3]} intensity={0.25} color="#ffe9e4" />
    </>
  );
}

export function Shadow({ y = -2.2, opacity = 0.32 }: { y?: number; opacity?: number }) {
  return <ContactShadows position={[0, y, 0]} scale={9} blur={2.4} far={3} opacity={opacity} resolution={256} color="#0d1b24" />;
}

/** Canvas che si ferma quando non è visibile (frameloop "never"). */
export function LazyCanvas({
  children,
  className,
  camera,
  dark = false,
  dpr = [1, 1.75],
  onReady,
}: {
  children: ReactNode;
  className?: string;
  camera: { position: [number, number, number]; fov: number };
  dark?: boolean;
  dpr?: [number, number];
  onReady?: () => void;
}) {
  const host = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const el = host.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: '120px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const gl = useMemo(() => ({ antialias: true, alpha: true, powerPreference: 'high-performance' as const, preserveDrawingBuffer: false }), []);
  return (
    <div ref={host} className={className}>
      <Canvas
        frameloop={visible ? 'always' : 'never'}
        camera={camera}
        dpr={dpr}
        gl={gl}
        onCreated={({ gl: r }) => {
          r.toneMapping = THREE.ACESFilmicToneMapping;
          r.toneMappingExposure = dark ? 1.0 : 0.95;
          r.setClearColor(0x000000, 0);
          onReady?.();
        }}
      >
        {children}
      </Canvas>
    </div>
  );
}
