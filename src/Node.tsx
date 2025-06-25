import { Group, Vector3, type Object3DEventMap } from "three";
import { Box, currentNodeAtom } from "./Box";
import { useMemo, useRef } from "react";
import { useAtom } from "jotai";
import { Text } from "@react-three/drei";

export interface INode {
	id: string;
	year?: number;
	parent?: INode;
	children: INode[];
	ref?: Group<Object3DEventMap> | null;
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
	const groupRef = useRef<Group>(null);
	const [selected, setNode] = useAtom(currentNodeAtom);

	const nodeWithRef = useMemo(
		() => ({ ...current, ref: groupRef.current }),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[current, groupRef.current]
	);

	return (
		<group ref={groupRef} position={new Vector3(3, sibling * 1.5 * deep, 0)}>
			<Box
				onSelect={() => {
					setNode(nodeWithRef);
				}}
				selected={selected === nodeWithRef}
			/>
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
