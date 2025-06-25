import { Vector3 } from "three";
import { Box } from "./Box";
import { useMemo } from "react";

interface INode {
	id: string;
	year?: number;
	parent?: INode;
	children: INode[];
}

export function Node({ current, deep }: { current: INode; deep: number }) {
	console.log(deep);

	const dsa = useMemo(() => deep + 1, []);
	const ds = useMemo(() => new Vector3(deep, 0, 0), [deep]);

	return (
		<group position={ds}>
			<Box onSelect={() => {}} selected={true} />
			{current.children.map((child: INode) => (
				<Node current={child} deep={deep + 1} />
			))}
		</group>
	);
}
