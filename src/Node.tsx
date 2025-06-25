import { useAtom, useAtomValue } from "jotai";
import { useMemo } from "react";
import { Box } from "./Box";
import type { INode } from "./data";
import { GenLine } from "./GenLine";
import { amIInSelectedFamily, isSelected, linkTypeAtom, NodeHelper, type LinkType } from "./Atom";
import { Text } from "@react-three/drei";
import { Vector3 } from "three";
import _ from "lodash";

export function Node({ node }: { node: INode }) {
	const [selected] = useAtom(useMemo(() => isSelected(node.id), [node.id]));

	const amIInFamily = useAtomValue(
		useMemo(() => {
			return amIInSelectedFamily(node.id);
		}, [node.id])
	);

	return (
		<>
			<Box
				position={node.coordinates}
				onSelect={() => NodeHelper.selectedNode(node)}
				selected={selected}
				highlighted={amIInFamily && !selected}
				layer={node.depth}
			/>
			{node.children.map((child, index) => (
				<NodeLine node={node} child={child} key={index} />
			))}

			{(selected || amIInFamily) && (
				<Text
					position={_.clone(node.coordinates).add(new Vector3(0, 1, 1))}
					fontSize={2}
					color="white"
					anchorX="center"
					anchorY="bottom"
				>
					{node.genotype ?? node.id.toString()}
				</Text>
			)}
		</>
	);
}

function NodeLine({ node, child }: { node: INode; child: INode }) {
	const linkType = useAtomValue(
		useMemo(() => linkTypeAtom(node.id, child.id), [node.id, child.id])
	);
	if (linkType.type === "none") return null;

	return <GenLine start={node.coordinates} end={child.coordinates} link={linkType as LinkType} />;
}
