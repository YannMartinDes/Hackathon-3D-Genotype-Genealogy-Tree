/* eslint-disable react-refresh/only-export-components */
import { atom } from "jotai";
import { useRef } from "react";
import { Mesh } from "three";
import type { INode } from "./Node";
import { store } from "./utils";
import { NODES } from "./data";
export const currentNodeAtom = atom<INode | null>(null);
export const highlightNodeAtom = atom<INode | null>(null);

export const parentOfSelectedNodeAtom = atom<string[]>([]);

export class NodeHelper {
	static selectedNode(node: INode | null) {
		store.set(currentNodeAtom, node);
		store.set(highlightNodeAtom, node);
		store.set(
			parentOfSelectedNodeAtom,
			node ? (NodeHelper.findParentPath(NODES, node.id) ?? []) : []
		);
	}

	static findParentPath(node: INode, targetId: string): string[] | null {
		if (node.id === targetId) return [node.id];

		for (const child of node.children) {
			const path = this.findParentPath(child, targetId);
			if (path !== null) {
				return [node.id, ...path];
			}
		}
		return null; // not found
	}

	static isMyChildHighlighted(node: INode) {
		const parentOfHighlighted = store.get(parentOfSelectedNodeAtom);
		if (!parentOfHighlighted || parentOfHighlighted.length === 0) return false;
		return parentOfHighlighted.includes(node.id);
	}
}

export function Box({ onSelect, selected }: { onSelect: () => void; selected: boolean }) {
	const meshRef = useRef<Mesh>(null);

	return (
		<mesh ref={meshRef} onClick={onSelect} scale={selected ? 1.2 : 1}>
			<boxGeometry args={[1, 1, 1]} />
			<meshStandardMaterial color={selected ? "hotpink" : "orange"} />
		</mesh>
	);
}
