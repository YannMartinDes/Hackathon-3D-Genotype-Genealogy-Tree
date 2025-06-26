/* eslint-disable react-refresh/only-export-components */
import { atom } from "jotai";
import { selectAtom } from "jotai/utils";
import type { Mesh } from "three";
import { dataMap, type INode } from "./data";
import { store } from "./utils";

export type NodeLink = {
	node: number;
	children: number;
	isChildren: boolean;
	distance: number; // Optional distance property
};
export type LinkType = { type: "children" | "parent" | "none"; distance: number };

export const currentNodeAtom = atom<INode | null>(null);
export const currentRef = atom<Mesh | null>(null);
export const search = atom<string | undefined>();
export const nodeLinkAtom = atom<Map<string, NodeLink>>((get) => {
	const currentNode = get(currentNodeAtom);
	return NodeHelper.computeGenealogyTree(currentNode as INode);
});

export const amIInSelectedFamily = (id: number) =>
	selectAtom(nodeLinkAtom, (nodeLinkMap): boolean => {
		if (!nodeLinkMap) return false;
		const links = Array.from(nodeLinkMap.values());
		return links.some((link) => link.node === id || link.children === id);
	});

export const linkTypeAtom = (idCrt: number | null, idChildren: number) =>
	selectAtom(nodeLinkAtom, (nodeLinkMap): LinkType => {
		if (idCrt === null) return { type: "none", distance: -1 };
		const isLinkToSelection = nodeLinkMap.get(idCrt + ":" + idChildren);
		if (!isLinkToSelection) return { type: "none", distance: -1 };

		return isLinkToSelection.isChildren
			? { type: "children", distance: isLinkToSelection.distance }
			: { type: "parent", distance: isLinkToSelection.distance };
	});

export const isSelected = (id: number) =>
	selectAtom(currentNodeAtom, (node): boolean => node?.id === id);

export const isFocusOnGenealogy = atom<boolean>(false);
export const showYear = atom<boolean>(true);

export const myFamilyAtom = selectAtom(nodeLinkAtom, (nodeLinkMap): INode[] => {
	if (!nodeLinkMap) return [];

	const links = Array.from(nodeLinkMap.values());

	const familyIds = new Set<number>();
	for (const link of links) {
		familyIds.add(link.node);
		familyIds.add(link.children);
	}

	return Array.from(familyIds)
		.map((id) => dataMap.get(id))
		.filter(Boolean) as INode[];
});

export class NodeHelper {
	static selectedNode(node: INode | null) {
		store.set(currentNodeAtom, node);
		store.set(currentRef, node?.ref ?? null);
	}
	static unselectNode() {
		store.set(currentNodeAtom, null);
		store.set(currentRef, null);
		store.set(search, undefined);
		store.set(isFocusOnGenealogy, false);
	}

	static computeGenealogyTree(node: INode | null) {
		if (!node) {
			return new Map<string, NodeLink>();
		}
		const genealogyTree: NodeLink[] = [];
		const computeParent = (currentNode: INode, distance: number) => {
			if (currentNode.parent === null) return;
			const parent = dataMap.get(currentNode.parent)!;
			genealogyTree.push({
				node: parent.id,
				children: currentNode.id,
				isChildren: false,
				distance: distance,
			});
			computeParent(parent, distance + 1);
		};
		computeParent(node, 1);

		const computeChildren = (currentNode: INode, distance: number) => {
			currentNode.children?.forEach((child) => {
				genealogyTree.push({
					node: currentNode.id,
					children: child.id,
					isChildren: true,
					distance: distance,
				});
				computeChildren(child, distance + 1);
			});
		};
		computeChildren(node, 0);

		const map = new Map<string, NodeLink>(
			genealogyTree.map((item) => [item.node + ":" + item.children, item])
		);

		return map;
	}
}
