/* eslint-disable react-refresh/only-export-components */
import type { Vector3 } from "three";

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
}: {
	position: Vector3;
	onSelect: () => void;
	selected: boolean;
	highlighted?: boolean;
	layer: number;
}) {
	const color = selected ? "hotpink" : getColorForLayer(layer);

	return (
		<mesh onClick={onSelect} scale={selected || highlighted ? 1.5 : 1} position={position}>
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
