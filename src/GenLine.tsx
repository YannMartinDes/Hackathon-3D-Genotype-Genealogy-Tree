import * as THREE from "three";
import { Line } from "@react-three/drei";
import { useMemo } from "react";

export function GenLine({
	start,
	end,
	highlighted,
	highlightedParent,
}: {
	start: THREE.Vector3;
	end: THREE.Vector3;
	highlighted?: boolean;
	highlightedParent?: boolean;
}) {
	const color = useMemo(() => {
		if (highlighted) return "green";
		if (highlightedParent) return "blue";
		return "white";
	}, [highlighted, highlightedParent]);

	return (
		<Line
			points={[start.toArray(), end.toArray()]}
			color={color}
			lineWidth={highlighted || highlightedParent ? 4 : 1}
			dashed={false}
		/>
	);
}
