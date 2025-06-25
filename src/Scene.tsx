import { CameraControl } from "./CameraControl";
import { Node, type INode } from "./Node";
import { YearSphere } from "./YearSphere";
import hierarchyData from "./data/hierarchy.json";

export const DATA: INode[] = hierarchyData as unknown as INode[];

export function Scene() {
	const years = [2000, 2001, 2002];

	return (
		<>
			<ambientLight />
			<pointLight position={[10, 10, 10]} />
			<CameraControl />
			{years.map((year, i) => (
				<YearSphere year={year} gap={i} />
			))}
			{DATA.map((node: INode, i) => (
				<Node key={node.id} current={node} deep={0} sibling={i} parent={null} />
			))}
		</>
	);
}
