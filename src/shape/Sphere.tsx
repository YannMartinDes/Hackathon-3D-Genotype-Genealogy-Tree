import { useRef } from "react";
import { Mesh } from "three";

export function Sphere({ radius }: { radius: number }) {
	const meshRef = useRef<Mesh>(null);

	return (
		<mesh ref={meshRef}>
			<sphereGeometry args={[radius]} />
			<meshStandardMaterial color={"gray"} transparent={true} opacity={0.2} />
		</mesh>
	);
}
