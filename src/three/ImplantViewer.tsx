import { useRef, type MutableRefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { ImplantModel, type ImplantState } from './ImplantModel';
import { Lights, Shadow } from './Stage';

export function ImplantViewerScene({ target, reduced }: { target: MutableRefObject<ImplantState>; reduced: boolean }) {
  const state = useRef<ImplantState>({ ...target.current });
  useFrame((st, dt) => {
    state.current.rotY = reduced ? 0.5 : st.clock.elapsedTime * 0.3;
    const k = reduced ? 1 : 1 - Math.pow(0.002, dt);
    state.current.explode += (target.current.explode - state.current.explode) * k;
    state.current.context += (target.current.context - state.current.context) * k;
    state.current.labels = target.current.labels;
  });
  return (
    <>
      <Lights />
      <group position={[-0.55, 0.1, 0]}>
        <ImplantModel state={state} scale={1.12} />
      </group>
      <Shadow y={-2.55} opacity={0.25} />
      <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={1.1} maxPolarAngle={1.9} minAzimuthAngle={-0.9} maxAzimuthAngle={0.9} />
    </>
  );
}
