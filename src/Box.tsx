/* eslint-disable react-refresh/only-export-components */
import type { Vector3 } from "three";

const layerColors = [
	"#FF8C94", // soft red
	"#C7A6FF", // soft purple
	"#FFBC80", // soft orange
	"#9FFFB0", // soft green
	"#91D6FF", // soft blue
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
	const color = selected ? "yellow" : getColorForLayer(layer);

	return (
		<mesh
			onClick={() => onSelect()}
			scale={selected || highlighted ? 3 : 1}
			position={position}
		>
			<sphereGeometry args={[0.5, 32, 32]} />
			<meshStandardMaterial
				color={color}
				emissive={color}
				emissiveIntensity={selected ? 0.5 : 0.2}
			/>
			{/* Glowy highlight layer */}
			{highlighted && (
				<mesh scale={1.3}>
					<sphereGeometry args={[0.5, 32, 32]} />
					<meshBasicMaterial color="white" transparent opacity={0.5} />
				</mesh>
			)}
		</mesh>
	);
}
