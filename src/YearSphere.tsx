import { Text } from "@react-three/drei";
import { useRef } from "react";
import { Group } from "three";
import { HaloSphere } from "./shape/Billboard";

export function YearSphere({ year, gap }: { year: number; gap: number }) {
	const ref = useRef<Group>(null);

	const radius = gap * 10;

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
			<HaloSphere radius={radius} />
		</group>
	);
}
