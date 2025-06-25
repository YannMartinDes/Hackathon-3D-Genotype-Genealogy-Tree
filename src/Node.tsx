import { Text } from "@react-three/drei";
import { useAtom } from "jotai";
import { useMemo, useRef } from "react";
import { Group, Vector3, type Object3DEventMap } from "three";
import {
	Box,
	currentNodeAtom,
	highlightNodeAtom,
	NodeHelper,
	parentOfSelectedNodeAtom,
} from "./Box";
import { GenLine } from "./GenLine";

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
}: {
	current: INode;
	parent: INode | null;
	highlightedNode?: boolean;
	deep: number;
	sibling: number;
}) {
	const groupRef = useRef<Group>(null);
	const [selected] = useAtom(currentNodeAtom);
	const [highlighted] = useAtom(highlightNodeAtom);

	const nodeWithRef = useMemo(
		() => ({ ...current, ref: groupRef.current }),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[current, groupRef.current]
	);
	const localPos = new Vector3(3, sibling * 1.5 * deep, 0);
	const shouldHighlightAsParent = NodeHelper.isMyChildHighlighted(current);

	return (
		<group ref={groupRef} position={localPos}>
			<Box
				onSelect={() => NodeHelper.selectedNode(nodeWithRef)}
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
				/>
			))}
		</group>
	);
}
