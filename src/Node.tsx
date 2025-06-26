import { useAtom, useAtomValue } from "jotai";
import { useMemo, useRef } from "react";
import { Box } from "./Box";
import type { INode } from "./data";
import { GenLine } from "./GenLine";
import { amIInSelectedFamily, isSelected, linkTypeAtom, NodeHelper, type LinkType } from "./Atom";
import { Text } from "@react-three/drei";
import { Mesh, Vector3 } from "three";
import _ from "lodash";
import { useThree, useFrame } from "react-three-fiber";

export function Node({ node }: { node: INode }) {
	const [selected] = useAtom(useMemo(() => isSelected(node.id), [node.id]));

	const amIInFamily = useAtomValue(
		useMemo(() => {
			return amIInSelectedFamily(node.id);
		}, [node.id])
	);

	const ref = useRef<Mesh>(null);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const textRef = useRef<any>(null);
	const { camera } = useThree();
	useFrame(() => {
		if (textRef.current) {
			textRef.current.lookAt(camera.position); // Optional: orient to center
		}
	});

	return (
		<>
			<Box
				ref={ref}
				position={node.coordinates}
				onSelect={() => NodeHelper.selectedNode(node, ref.current)}
				selected={selected}
				highlighted={amIInFamily && !selected}
				layer={node.depth}
			/>
			{node.children.map((child, index) => (
				<NodeLine node={node} child={child} key={index} />
			))}

			{(selected || amIInFamily) && (
				<Text
					ref={textRef}
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
