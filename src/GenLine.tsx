import * as THREE from "three";
import { Line } from "@react-three/drei";

export function GenLine({ start, end }: { start: THREE.Vector3; end: THREE.Vector3 }) {
	return (
		<Line
			points={[start.toArray(), end.toArray()]}
			color="white"
			lineWidth={1}
			dashed={false}
		/>
	);
}
