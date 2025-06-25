import * as THREE from "three";
import { Line } from "@react-three/drei";
import { useMemo } from "react";
import type { LinkType } from "./Atom";

export function GenLine({
	start,
	end,
	link,
}: {
	start: THREE.Vector3;
	end: THREE.Vector3;
	link: LinkType;
}) {
	const color = useMemo(() => {
		const minDistance = 0;
		const maxDistance = 10;

		// Clamp la distance pour rester dans l'intervalle
		const clamped = Math.max(minDistance, Math.min(link.distance, maxDistance));

		// Ratio t ∈ [0, 1]
		const t = Math.pow(clamped / maxDistance, 2); // transition plus douce

		// Couleur de base selon le type
		const base = new THREE.Color(link.type === "children" ? "darkgreen" : "blue");
		const white = new THREE.Color("white");

		// Interpolation entre la couleur de base et blanc
		const finalColor = base.lerp(white, t);

		return `#${finalColor.getHexString()}`;
	}, [link]);

	return (
		<Line
			points={[start.toArray(), end.toArray()]}
			color={color}
			lineWidth={link ? 4 : 1}
			dashed={false}
		/>
	);
}
