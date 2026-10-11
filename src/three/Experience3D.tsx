import type { ComponentProps } from 'react';
import { LazyCanvas } from './Stage';
import { ExperienceScene } from './ExperienceScene';

export default function Experience3D(props: ComponentProps<typeof ExperienceScene>) {
  return (
    <LazyCanvas className="absolute inset-0" camera={{ position: [0, 2.6, 14.2], fov: 32 }} dark>
      <ExperienceScene {...props} />
    </LazyCanvas>
  );
}
