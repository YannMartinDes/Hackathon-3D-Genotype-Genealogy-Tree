import { Vector3 } from "three";
import { CameraControl } from "./CameraControl";
import { Node, type INode } from "./Node";
import { YearSphere } from "./YearSphere";
import hierarchyData from "./data/hierarchy.json";
import { useMemo } from "react";

export const DATA: INode[] = hierarchyData as unknown as INode[];
export function useFibonacciSpherePoints(n: number, radius: number): Vector3[] {
	return useMemo(() => {
		const points: Vector3[] = [];
		const goldenRatio = (1 + Math.sqrt(5)) / 2;
		const angleIncrement = 2 * Math.PI * goldenRatio;

		for (let i = 0; i < n; i++) {
			const t = i / n;
			const inclination = Math.acos(1 - 2 * t);
			const azimuth = angleIncrement * i;

			const x = radius * Math.sin(inclination) * Math.cos(azimuth);
			const y = radius * Math.sin(inclination) * Math.sin(azimuth);
			const z = radius * Math.cos(inclination);

			points.push(new Vector3(x, y, z));
		}

		return points;
	}, [n, radius]);
}

export function Scene() {
	const years = [2000, 2001, 2002];
	//const asd = [NODES];
	//const points = useFibonacciSpherePoints(asd.length, 20);

	return (
		<>
			<ambientLight />
			<pointLight position={[10, 10, 10]} />
			<CameraControl />
			{years.map((year, i) => (
				<YearSphere key={year + i} year={year} gap={i} />
			))}
			{DATA.slice(0, 10).map((node: INode, i) => (
				<Node key={node.id} current={node} deep={0} sibling={i} parent={null} />
			))}
		</>
	);
}
