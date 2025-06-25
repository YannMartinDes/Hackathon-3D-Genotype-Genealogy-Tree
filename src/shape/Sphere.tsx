import { useRef } from "react";
import { useFrame, useThree } from "react-three-fiber";
import { Mesh, ShaderMaterial, Vector3 } from "three";

const fragmentShader = `
uniform vec3 cameraDirection; // 👈 new

varying vec3 vNormal;

void main() {
  float intensity = 1.0 - dot(vNormal, vec3(0, 0, 1)); // align with actual camera
  float alpha = smoothstep(0.1, 0.8, intensity);
  vec3 color = vec3(0.2, 0.9, 1.0);
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

	const { camera } = useThree();

	useFrame(() => {
		if (materialRef.current) {
			// camera.getWorldDirection gives the current forward vector
			const cameraDirection = camera.position
				.clone()
				.normalize()
				.add(new Vector3(0, 0, 1));

			materialRef.current.uniforms.cameraDirection.value.copy(cameraDirection);
		}
	});

	return (
		<mesh ref={meshRef}>
			<sphereGeometry args={[radius, 100, 100]} />
			<shaderMaterial
				ref={materialRef}
				vertexShader={vertexShader}
				fragmentShader={fragmentShader}
				transparent
				uniforms={{
					cameraDirection: { value: new Vector3() }, // default
				}}
			/>
		</mesh>
	);
}
