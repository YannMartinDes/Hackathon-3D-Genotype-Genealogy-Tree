import { atom } from "jotai";
import { useRef } from "react";
import { Mesh } from "three";
import type { INode } from "./Node";
export const currentNodeAtom = atom<INode | null>(null);

export function Box({ onSelect, selected }: { onSelect: () => void; selected: boolean }) {
	const meshRef = useRef<Mesh>(null);

	return (
		<mesh ref={meshRef} onClick={onSelect} scale={selected ? 1.2 : 1}>
			<boxGeometry args={[1, 1, 1]} />
			<meshStandardMaterial color={selected ? "hotpink" : "orange"} />
		</mesh>
	);
}
