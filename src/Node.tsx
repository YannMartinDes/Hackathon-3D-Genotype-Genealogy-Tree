import { Vector3 } from "three";
import { Box } from "./Box";
import { Text } from "@react-three/drei";

interface INode {
	id: string;
	year?: number;
	parent?: INode;
	children: INode[];
}

export function Node({
	current,
	deep,
	sibling,
}: {
	current: INode;
	deep: number;
	sibling: number;
}) {
	return (
		<group position={new Vector3(3, sibling * 1.5 * deep, 0)}>
			<Box onSelect={() => {}} selected={false} />
			<Text
				position={[0, 1, 1]}
				fontSize={0.3}
				color="white"
				anchorX="center"
				anchorY="bottom"
			>
				{current.id}
			</Text>
			{current.children.map((child: INode, i) => (
				<Node current={child} deep={deep + 1} sibling={i} />
			))}
		</group>
	);
}
