import { Vector3 } from "three";
import { Box } from "./Box";
import { useMemo } from "react";

interface INode {
	id: string;
	year?: number;
	parent?: INode;
	children: INode[];
}
interface ddd {
	current: INode;
	deep: number;
}

export function Node({ current, deep }: ddd) {
	const childDeep = useMemo(() => deep + 1, []);

	return (
		<group position={new Vector3(2, 0, 0)}>
			<Box onSelect={() => {}} selected={true} />
			{current.children.map((child: INode, i) => (
				<Node current={child} deep={childDeep} />
			))}
		</group>
	);
}
