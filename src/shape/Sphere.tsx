import { useRef } from "react";
import { useFrame, useThree } from "react-three-fiber";
import { Mesh, ShaderMaterial } from "three";

const fragmentShader = `
varying vec3 vNormal;

void main() {
  float intensity = 1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)); // more visible at edges
  float alpha = smoothstep(0.1, 0.8, intensity);
  vec3 color = vec3(0.2, 0.9, 1.0); // soft cyan glow
  gl_FragColor = vec4(color, alpha);
}
`;

const vertexShader = `
 varying vec3 vNormal;

void main() {
  vNormal = normalize(normalMatrix * normal); // transformed normal
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export function Sphere({ radius }: { radius: number }) {
	const meshRef = useRef<Mesh>(null);
	const materialRef = useRef<ShaderMaterial>(null);

	return (
		<mesh ref={meshRef}>
			<sphereGeometry args={[radius]} />
			<shaderMaterial
				ref={materialRef}
				vertexShader={vertexShader}
				fragmentShader={fragmentShader}
				transparent
			/>
		</mesh>
	);
}
