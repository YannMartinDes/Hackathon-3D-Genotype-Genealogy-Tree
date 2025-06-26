import { Text } from "@react-three/drei";
import { useRef } from "react";
import { useFrame, useThree } from "react-three-fiber";
import { Group } from "three";
import { Sphere } from "./shape/Sphere";

export function YearSphere({ year, gap }: { year: number; gap: number }) {
	const ref = useRef<Group>(null);
	const { camera } = useThree();
	const radius = (1 + gap) * 20;
	useFrame(() => {
		if (ref.current) {
			//ref.current.lookAt(camera.position); // Optional: orient to center
		}
	});

	return (
		<group ref={ref}>
			<Text
				position={[0, radius, 0]}
				fontSize={2}
				color="black"
				anchorX="center"
				anchorY="bottom"
			>
				{year}
			</Text>
			<Sphere radius={radius} />
		</group>
	);
}
