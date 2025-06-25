import { Text } from "@react-three/drei";
import { useRef } from "react";
import { Group } from "three";
import { Sphere } from "./shape/Sphere";
import { useFrame, useThree } from "react-three-fiber";

export function YearSphere({ year, gap }: { year: number; gap: number }) {
	const ref = useRef<Group>(null);

	const radius = (1 + gap) * 20;
	const { camera } = useThree();
	useFrame(() => {
		if (ref.current) {
			//	ref.current.lookAt(camera.position); // Optional: orient to center
		}
	});

	return (
		<group ref={ref}>
			<Text
				position={[0, radius, 0]}
				fontSize={1.5}
				color="white"
				anchorX="center"
				anchorY="bottom"
			>
				{year}
			</Text>
			<Sphere radius={radius} />
		</group>
	);
}
