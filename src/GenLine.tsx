import * as THREE from "three";
import { Line } from "@react-three/drei";

export function GenLine({
	start,
	end,
	highlighted,
}: {
	start: THREE.Vector3;
	end: THREE.Vector3;
	highlighted?: boolean;
}) {
	return (
		<Line
			points={[start.toArray(), end.toArray()]}
			color={highlighted ? "green" : "white"}
			lineWidth={highlighted ? 4 : 1}
			dashed={false}
		/>
	);
}
