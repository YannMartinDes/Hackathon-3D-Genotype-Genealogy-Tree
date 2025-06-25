import { useAtom, useAtomValue } from "jotai";
import { useMemo } from "react";
import { Box } from "./Box";
import type { INodeWithDisplay } from "./data";
import { GenLine } from "./GenLine";
import { isSelected, linkTypeAtom, NodeHelper } from "./Atom";
import { Text } from "@react-three/drei";
import { Vector3 } from "three";
import _ from "lodash";

export function Node({ node }: { node: INodeWithDisplay }) {
	const [selected] = useAtom(useMemo(() => isSelected(node.id), [node.id]));

	return (
		<>
			<Box
				position={node.coordinates}
				onSelect={() => NodeHelper.selectedNode(node)}
				selected={selected}
				highlighted={false}
			/>
			{node.children.map((child, index) => (
				<NodeLine node={node} child={child} key={index} />
			))}

			{selected && (
				<Text
					position={_.clone(node.coordinates).add(new Vector3(0, 1, 1))}
					fontSize={0.3}
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

function NodeLine({ node, child }: { node: INodeWithDisplay; child: INodeWithDisplay }) {
	const linkType = useAtomValue(
		useMemo(() => linkTypeAtom(node.id, child.id), [node.id, child.id])
	);
	if (linkType === "none") return null;

	return (
		<GenLine
			start={node.coordinates}
			end={child.coordinates}
			highlighted={linkType === "children"}
			highlightedParent={linkType === "parent"}
		/>
	);
}
