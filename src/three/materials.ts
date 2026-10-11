import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export function makeMaterials() {
  const enamel = new THREE.MeshPhysicalMaterial({
    vertexColors: true,
    roughness: 0.34,
    metalness: 0,
    clearcoat: 0.5,
    clearcoatRoughness: 0.22,
    ior: 1.62,
    envMapIntensity: 0.5,
  });
  const gum = new THREE.MeshPhysicalMaterial({
    vertexColors: true,
    roughness: 0.42,
    metalness: 0,
    clearcoat: 0.35,
    clearcoatRoughness: 0.35,
    sheen: 0.6,
    sheenColor: new THREE.Color('#ffd2d0'),
    sheenRoughness: 0.5,
    envMapIntensity: 0.65,
  });
  const titanium = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#c3c8cd'),
    metalness: 1,
    roughness: 0.3,
    clearcoat: 0.2,
    envMapIntensity: 1.25,
  });
  const titaniumSatin = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#d2d5d8'),
    metalness: 1,
    roughness: 0.18,
    envMapIntensity: 1.3,
  });
  const ceramic = new THREE.MeshPhysicalMaterial({
    vertexColors: true,
    roughness: 0.18,
    clearcoat: 0.9,
    clearcoatRoughness: 0.1,
    ior: 1.6,
    envMapIntensity: 1,
  });
  const aligner = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#cfeeff'),
    roughness: 0.04,
    metalness: 0,
    clearcoat: 1,
    clearcoatRoughness: 0.03,
    specularIntensity: 1,
    transparent: true,
    opacity: 0.5,
    depthWrite: false,
    envMapIntensity: 2.2,
  });
  const glow = new THREE.MeshBasicMaterial({ color: new THREE.Color('#38b6f0'), transparent: true, opacity: 1, toneMapped: false });
  return { enamel, gum, titanium, titaniumSatin, ceramic, aligner, glow };
}

export type Materials = ReturnType<typeof makeMaterials>;

const envCache = new WeakMap<THREE.WebGLRenderer, THREE.Texture>();
export function studioEnvironment(gl: THREE.WebGLRenderer) {
  const cached = envCache.get(gl);
  if (cached) return cached;
  const pmrem = new THREE.PMREMGenerator(gl);
  const tex = pmrem.fromScene(new RoomEnvironment(), 0.035).texture;
  pmrem.dispose();
  envCache.set(gl, tex);
  return tex;
}
