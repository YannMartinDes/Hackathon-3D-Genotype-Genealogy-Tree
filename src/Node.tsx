import { Text } from "@react-three/drei";
import { useAtom } from "jotai";
import { useMemo, useRef } from "react";
import { Group, Vector3, type Object3DEventMap } from "three";
import { Box, currentNodeAtom, highlightNodeAtom, NodeHelper } from "./Box";
import { GenLine } from "./GenLine";
import { useFibonacciSpherePoints } from "./Scene";

export interface INode {
	id: string;
	year?: number;
	parent?: INode;
	children: INode[];
	ref?: Group<Object3DEventMap> | null;
}

export function Node({
	current,
	parent,
	deep,
	sibling,
	highlightedNode,
	pos = new Vector3(3, sibling * 1.5 * deep, 0),
}: {
	current: INode;
	parent: INode | null;
	highlightedNode?: boolean;
	deep: number;
	sibling: number;
	pos?: Vector3;
}) {
	const groupRef = useRef<Group>(null);
	const [selected] = useAtom(currentNodeAtom);
	const [highlighted] = useAtom(highlightNodeAtom);

	const nodeWithRef = useMemo(
		() => ({ ...current, ref: groupRef.current }),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[current, groupRef.current]
	);
	const localPos = pos;
	const shouldHighlightAsParent = NodeHelper.isMyChildHighlighted(current);

	const basePos = useMemo(() => {
		return groupRef.current?.getWorldPosition(new Vector3()) ?? new Vector3();
	}, [groupRef.current]);

	const points = useFibonacciSpherePoints(current.children.length, 20);
	return (
		<group ref={groupRef} position={localPos}>
			<Box
				onSelect={() => NodeHelper.selectedNode(nodeWithRef)}
				selected={selected?.id === nodeWithRef.id}
				highlighted={
					selected?.id !== current.id && (shouldHighlightAsParent || highlightedNode)
				}
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
			{parent !== null && (
				<GenLine
					start={new Vector3()}
					end={localPos.clone().multiplyScalar(-1)}
					highlighted={highlightedNode}
					highlightedParent={shouldHighlightAsParent}
				/>
			)}
			{current.children.map((child: INode, i) => (
				<Node
					current={child}
					deep={deep + 1}
					sibling={i}
					highlightedNode={highlightedNode || highlighted?.id === current.id}
					parent={current}
					pos={points[i]}
				/>
			))}
		</group>
	);
}
