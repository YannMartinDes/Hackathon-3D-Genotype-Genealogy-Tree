/* eslint-disable react-refresh/only-export-components */
import { atom } from "jotai";
import { useRef } from "react";
import { Mesh } from "three";
import type { INode } from "./Node";
import { store } from "./utils";
import { DATA } from "./Scene";
export const currentNodeAtom = atom<INode | null>(null);
export const highlightNodeAtom = atom<INode | null>(null);

export const parentOfSelectedNodeAtom = atom<string[]>([]);

export class NodeHelper {
	static selectedNode(node: INode | null) {
		store.set(currentNodeAtom, node);
		store.set(highlightNodeAtom, node);
		store.set(
			parentOfSelectedNodeAtom,
			node ? (NodeHelper.findParentPath(DATA, node.id) ?? []) : []
		);
	}

	static findParentPath(tree: INode | INode[], targetId: string): string[] | null {
		if (Array.isArray(tree)) {
			for (const node of tree) {
				const path = this.findParentPath(node, targetId);
				if (path) return path;
			}
			return null;
		}

		if (tree.id === targetId) return [tree.id];

		for (const child of tree.children) {
			const path = this.findParentPath(child, targetId);
			if (path !== null) {
				return [tree.id, ...path];
			}
		}

		return null;
	}

	static isMyChildHighlighted(node: INode) {
		const parentOfHighlighted = store.get(parentOfSelectedNodeAtom);
		if (!parentOfHighlighted || parentOfHighlighted.length === 0) return false;
		return parentOfHighlighted.includes(node.id);
	}
}

export function Box({
	onSelect,
	selected,
	highlighted,
}: {
	onSelect: () => void;
	selected: boolean;
	highlighted?: boolean;
}) {
	const meshRef = useRef<Mesh>(null);

	return (
		<mesh ref={meshRef} onClick={onSelect} scale={selected ? 1.2 : 1}>
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
