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
	const ref = useRef<Group>(null);
	const [selected, setNode] = useAtom(currentNodeAtom);

	const asd = useMemo(() => ({ ...current, ref: ref.current }), [current, ref.current]);

	return (
		<group ref={ref} position={new Vector3(3, sibling * 1.5 * deep, 0)}>
			<Box
				onSelect={() => {
					setNode(asd);
				}}
				selected={selected === asd}
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
