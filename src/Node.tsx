import { Vector3 } from "three";
import { Box } from "./Box";

interface INode {
	id: string;
	year?: number;
	parent?: INode;
	children: INode[];
}

export function Node({ current, deep, sibling }: { current: INode; deep: number, sibling:number }) {


	return (
		<group position={new Vector3(3,sibling*1.5,0)}>
			<Box onSelect={() => {}} selected={true} />
			{current.children.map((child: INode, i) => (
				<Node current={child} deep={deep + 1} sibling={i}/>
			))}
		</group>
	);
}
