import { Vector3, Color } from "three";
import { Line } from "@react-three/drei";
import { useMemo } from "react";
import type { LinkType } from "../jotai/atom";

function getQuadraticBezierPoints3D(
	start: Vector3,
	end: Vector3,
	steps: number = 20,
	curveStrength: number = 0.1
): Vector3[] {
	const dir = end.clone().sub(start);
	const mid = end.clone().add(start).divideScalar(2);
	const up: Vector3 = new Vector3(0, 1, 0);
	const perp: Vector3 = new Vector3(
		dir.y * up.z - dir.z * up.y,
		dir.z * up.x - dir.x * up.z,
		dir.x * up.y - dir.y * up.x
	);

	// Normalize perpendicular
	const length = Math.sqrt(perp.x ** 2 + perp.y ** 2 + perp.z ** 2) || 1;
	const perpNormalized = {
		x: perp.x / length,
		y: perp.y / length,
		z: perp.z / length,
	};

	// Offset control points above and below the line to create the "S"
	const controlDistance = curveStrength * Math.sqrt(dir.x ** 2 + dir.y ** 2 + dir.z ** 2);
	const cp1: Vector3 = new Vector3(
		mid.x + perpNormalized.x * controlDistance,
		mid.y + perpNormalized.y * controlDistance,
		mid.z + perpNormalized.z * controlDistance
	);
	const cp2: Vector3 = new Vector3(
		mid.x - perpNormalized.x * controlDistance,
		mid.y - perpNormalized.y * controlDistance,
		mid.z - perpNormalized.z * controlDistance
	);

	// Generate cubic bezier points
	const points: Vector3[] = [];

	for (let i = 0; i <= steps; i++) {
		const t = i / steps;
		const oneMinusT = 1 - t;

		const x =
			oneMinusT ** 3 * start.x +
			3 * oneMinusT ** 2 * t * cp1.x +
			3 * oneMinusT * t ** 2 * cp2.x +
			t ** 3 * end.x;

		const y =
			oneMinusT ** 3 * start.y +
			3 * oneMinusT ** 2 * t * cp1.y +
			3 * oneMinusT * t ** 2 * cp2.y +
			t ** 3 * end.y;

		const z =
			oneMinusT ** 3 * start.z +
			3 * oneMinusT ** 2 * t * cp1.z +
			3 * oneMinusT * t ** 2 * cp2.z +
			t ** 3 * end.z;

		points.push(new Vector3(x, y, z));
	}

	return points;
}

export function GenLine({ start, end, link }: { start: Vector3; end: Vector3; link: LinkType }) {
	const color = useMemo(() => {
		const minDistance = 0;
		const maxDistance = 10;

		// Stay in the interval [minDistance, maxDistance]
		const clamped = Math.max(minDistance, Math.min(link.distance, maxDistance));

		// Ratio t ∈ [0, 1]
		const t = Math.pow(clamped / maxDistance, 2); // transition plus douce

		// Base color based on link type
		let baseColor = "white";
		if (link.type === "children") {
			baseColor = "purple";
		} else if (link.type === "childrenM") {
			baseColor = "darkgreen";
		} else if (link.type === "parent") {
			baseColor = "#FF007F";
		} else if (link.type === "parentM") {
			baseColor = "blue";
		}
		const base = new Color(baseColor);

		const white = new Color("white");

		// interpolate between base color and white based on distance
		const finalColor = base.lerp(white, t);

		return `#${finalColor.getHexString()}`;
	}, [link]);

	const points = useMemo(() => getQuadraticBezierPoints3D(start, end, 30), [start, end]);

	return <Line points={points} color={color} lineWidth={link ? 4 : 1} dashed={false} />;
}
