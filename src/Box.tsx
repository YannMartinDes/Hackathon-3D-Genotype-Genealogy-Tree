/* eslint-disable react-refresh/only-export-components */
import { useEffect, useRef } from "react";
import type { Mesh, Vector3 } from "three";
import { dataMap, type INode } from "./data";

const layerColors = [
	"#FF8C94", // soft red
	"#FFBC80", // soft orange
	"#9FFFB0", // soft green
	"#91D6FF", // soft blue
	"#C7A6FF", // soft purple
	"#FFA6C9", // soft pink
	"#DFFF84", // soft lime
];

function getColorForLayer(layer: number) {
	return layerColors[layer % layerColors.length];
}

export function Box({
	onSelect,
	selected,
	highlighted,
	position,
	layer,
	node,
}: {
	position: Vector3;
	onSelect: () => void;
	selected: boolean;
	highlighted?: boolean;
	layer: number;
	node: INode;
}) {
	const color = selected ? "hotpink" : getColorForLayer(layer);
	const ref = useRef<Mesh>(null);

	useEffect(() => {
		const n: INode = dataMap.get(node.id)!;
		n.ref = ref?.current;
	}, [node, ref?.current]);

	return (
		<mesh
			ref={ref}
			onClick={() => onSelect()}
			scale={selected || highlighted ? 1.5 : 1}
			position={position}
		>
			<boxGeometry args={[1, 1, 1]} />
			<meshStandardMaterial
				color={color}
				emissive={color}
				emissiveIntensity={selected ? 0.5 : 0.2}
			/>
			{/* Glowy highlight layer */}
			{highlighted && (
				<mesh scale={1.3}>
					<boxGeometry args={[1, 1, 1]} />
					<meshBasicMaterial color="white" transparent opacity={0.4} />
				</mesh>
			)}
		</mesh>
	);
}
