import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import { AdditiveBlending, Color, Mesh, ShaderMaterial } from "three";

const fragmentShader = `
  varying vec2 vUv;

  void main() {
    float dist = distance(vUv, vec2(0.5));
    float alpha = smoothstep(0.3, 0.9, dist); // edge fade
    vec3 color = vec3(0.2, 1.0, 1.0); // cyan glow
    gl_FragColor = vec4(color, alpha);
  }
`;

const vertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export function HaloSphere({ radius }: { radius: number }) {
	const meshRef = useRef<Mesh>(null);
	const materialRef = useRef<ShaderMaterial>(null);

	const { camera } = useThree();
	useFrame(() => {
		if (meshRef.current) {
			meshRef.current.lookAt(camera.position); // Optional: orient to center
		}
	});

	return (
		<mesh ref={meshRef}>
			<circleGeometry args={[radius]} />
			<shaderMaterial
				ref={materialRef}
				vertexShader={vertexShader}
				fragmentShader={fragmentShader}
				blending={AdditiveBlending}
				transparent
			/>
		</mesh>
	);
}
