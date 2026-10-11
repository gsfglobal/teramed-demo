import type { MutableRefObject } from 'react';
import { LazyCanvas } from './Stage';
import { ImplantViewerScene } from './ImplantViewer';
import type { ImplantState } from './ImplantModel';

export default function ImplantViewer3D({ target, reduced }: { target: MutableRefObject<ImplantState>; reduced: boolean }) {
  return (
    <LazyCanvas className="absolute inset-0" camera={{ position: [0, 0.5, 10.8], fov: 32 }}>
      <ImplantViewerScene target={target} reduced={reduced} />
    </LazyCanvas>
  );
}
