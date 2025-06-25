import { Group, Vector3, type Object3DEventMap } from "three";
import { Box, currentNodeAtom } from "./Box";
import { useMemo, useRef } from "react";
import { useAtom } from "jotai";

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
		<group ref={ref} position={new Vector3(3, sibling * 2 * deep, deep)}>
			<Box
				onSelect={() => {
					setNode(asd);
				}}
				selected={selected === asd}
			/>
			{current.children.map((child: INode, i) => (
				<Node current={child} deep={deep + 1} sibling={i} />
			))}
		</group>
	);
}
