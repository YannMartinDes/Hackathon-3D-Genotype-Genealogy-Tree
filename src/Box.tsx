/* eslint-disable react-refresh/only-export-components */
import type { Vector3 } from "three";

export function Box({
	onSelect,
	selected,
	highlighted,
	position,
}: {
	position: Vector3;
	onSelect: () => void;
	selected: boolean;
	highlighted?: boolean;
}) {
	return (
		<mesh onClick={onSelect} scale={selected ? 1.2 : 1} position={position}>
			<boxGeometry args={[1, 1, 1]} />
			<meshStandardMaterial
				color={selected ? "hotpink" : "orange"}
				emissive={selected ? "hotpink" : "orange"}
				emissiveIntensity={selected ? 0.5 : 0.2}
			/>
			{/* Glowy highlight layer */}
			{highlighted && (
				<mesh scale={1.15}>
					<boxGeometry args={[1, 1, 1]} />
					<meshBasicMaterial color="yellow" transparent opacity={0.5} />
				</mesh>
			)}
		</mesh>
	);
}
