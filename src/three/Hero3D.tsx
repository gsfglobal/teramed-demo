import type { MutableRefObject } from 'react';
import { LazyCanvas } from './Stage';
import { HeroScene } from './HeroScene';
import type { HeroAnim } from './heroAnim';
import type { Quality } from './DentalArches';

export default function Hero3D(props: {
  anim: MutableRefObject<HeroAnim>;
  pointer: MutableRefObject<{ x: number; y: number }>;
  scroll: MutableRefObject<number>;
  layout: 'side' | 'stack';
  quality: Quality;
}) {
  return (
    <LazyCanvas className="absolute inset-0" camera={{ position: [0, 2.1, 6.2], fov: 30 }}>
      <HeroScene {...props} />
    </LazyCanvas>
  );
}
