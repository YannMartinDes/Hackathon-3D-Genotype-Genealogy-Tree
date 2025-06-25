import { useRef } from "react";
import type { Group } from "three";

export function Box({
	position,
	onSelect,
	selected,
}: {
	position: [number, number, number];
	onSelect: () => void;
	selected: boolean;
}) {
	const meshRef = useRef<Group>(null);

	return (
		<group ref={meshRef} position={[0, 0, 0]} name="parent-node">
			<mesh position={position} onClick={onSelect} scale={selected ? 1.2 : 1}>
				<boxGeometry args={[1, 1, 1]} />
				<meshStandardMaterial color={selected ? "hotpink" : "orange"} />
			</mesh>
		</group>
	);
}
