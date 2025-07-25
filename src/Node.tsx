/* eslint-disable @typescript-eslint/no-explicit-any */
import { Text } from "@react-three/drei";
import { useAtom, useAtomValue } from "jotai";
import _ from "lodash";
import { useMemo, useRef } from "react";
import { useFrame, useThree } from "react-three-fiber";
import { Vector3 } from "three";
import { amIInSelectedFamily, isSelected, linkTypeAtom, type LinkType } from "./jotai/atom";
import { NodeBody } from "./components/NodeBody";
import { NODE_DATA_MAP, YEAR_LIST, type INode } from "./data";
import { GenLine } from "./components/GenLine";
import { NodeHelper } from "./jotai/helper";

export function Node({ node }: { node: INode }) {
	const [selected] = useAtom(useMemo(() => isSelected(node.id), [node.id]));

	const amIInFamily = useAtomValue(
		useMemo(() => {
			return amIInSelectedFamily(node.id);
		}, [node.id])
	);

	const textRef = useRef<any>(null);
	const { camera } = useThree();
	useFrame(() => {
		if (textRef.current) {
			textRef.current.lookAt(camera.position); // Optional: orient to center
		}
	});

	const layer = useMemo(() => {
		const yearIndex = YEAR_LIST.indexOf(node.year);
		return yearIndex + 1;
	}, [node.year]);

	const parentM = useMemo(() => {
		if (node.male === null) return null;
		return NODE_DATA_MAP.get(node.male) ?? null;
	}, [node.male]);

	return (
		<>
			<NodeBody
				position={node.position}
				onSelect={() => NodeHelper.selectedNode(node)}
				selected={selected}
				highlighted={amIInFamily && !selected}
				layer={layer}
			/>
			{node.children.map((child, index) => (
				<NodeLine node={node} child={child} key={index} />
			))}
			{amIInFamily && parentM && (
				<NodeLine node={parentM} child={node} key={"male_" + node.id} />
			)}

			{(selected || amIInFamily) && (
				<Text
					ref={textRef}
					position={_.clone(node.position).add(new Vector3(0, 1, 1))}
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

	return <GenLine start={node.position} end={child.position} link={linkType as LinkType} />;
}
