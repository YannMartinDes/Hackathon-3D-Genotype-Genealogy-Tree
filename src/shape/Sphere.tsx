import { useRef } from "react";
import { useFrame, useThree } from "react-three-fiber";
import { Mesh, ShaderMaterial, Vector3 } from "three";

const fragmentShaderV0 = `
uniform vec3 cameraDirection; // 👈 new

varying vec3 vNormal;

void main() {
  float intensity = 1.0 - dot(vNormal, vec3(0, 0, 1)); // align with actual camera
  float alpha = smoothstep(0.1, 0.8, intensity);
  vec3 color = vec3(0.2, 0.9, 1.0);
  gl_FragColor = vec4(color, alpha);
}
`;

const vertexShaderV0 = `
 varying vec3 vNormal;

void main() {
  vNormal = normalize(normalMatrix * normal); // transformed normal
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform vec3 cameraDirection; // 👈 new
varying float intensity;

varying vec3 vNormal;
varying vec3 vertexNormal;

void main() {
//float intensity = pow(0.9 - dot(vertexNormal, vec3(0, 0, 1.0)), 2.0);
  float intensity = 1.0 - dot(vertexNormal, vec3(0, 0, 1)); // align with actual camera

vec3 color = vec3(0.2, 0.9, 1.0);
float alpha = smoothstep(0.1, 0.8, intensity);
gl_FragColor = vec4(color, alpha) ;
}
`;

const vertexShader = `
varying vec3 vWorldNormal;
uniform vec3 cameraDirection;
varying float intensity;
uniform vec3 lightSourcePos;
varying vec3 vertexNormal;

void main() {
	vertexNormal = normal;
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
			const cameraDirection = camera.position.clone().normalize();

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
				depthWrite={false} // 👈 pour voir les objets derrière
				uniforms={{
					cameraDirection: { value: new Vector3() }, // default
					lightSourcePos: { value: new Vector3() }, // default
				}}
			/>
		</mesh>
	);
}
