import { useRef } from "react";
import { Group, Mesh } from "three";
import { useFrame } from "@react-three/fiber";
import { Billboard, Text } from "@react-three/drei";
import { Color, AdditiveBlending } from "three";

export function HaloSphere({ radius }: { radius: number }) {
	const meshRef = useRef<Mesh>(null);

	useFrame(() => {
		if (meshRef.current) {
			meshRef.current.lookAt(0, 0, 0); // Optional: orient to center
		}
	});

	return (
		<Billboard>
			<mesh ref={meshRef}>
				<planeGeometry args={[radius * 2.5, radius * 2.5]} />
				<meshBasicMaterial
					transparent
					opacity={0.5}
					color={new Color("cyan")}
					blending={AdditiveBlending}
					depthWrite={false}
				/>
			</mesh>
		</Billboard>
	);
}
