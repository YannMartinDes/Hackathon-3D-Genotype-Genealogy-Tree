/* eslint-disable react-refresh/only-export-components */
import { atom } from "jotai";
import { store } from "./utils";
import { dataMap, type INode } from "./data";
import { selectAtom } from "jotai/utils";

export type NodeLink = {
	node: number;
	children: number;
	isChildren: boolean;
	distance: number; // Optional distance property
};
export type LinkType = { type: "children" | "parent" | "none"; distance: number };

export const currentNodeAtom = atom<INode | null>(null);
export const nodeLinkAtom = atom<Map<string, NodeLink>>((get) => {
	const currentNode = get(currentNodeAtom);
	return NodeHelper.computeGenealogyTree(currentNode as INode);
});

export const amIInSelectedFamily = (id: number) =>
	selectAtom(nodeLinkAtom, (node): boolean => {
		if (!node) return false;
		const links = Array.from(node.values());
		return links.some((link) => link.node === id || link.children === id);
	});

export const linkTypeAtom = (idCrt: number | null, idChildren: number) =>
	selectAtom(nodeLinkAtom, (node): LinkType => {
		if (idCrt === null) return { type: "none", distance: -1 };
		const isLinkToSelection = node.get(idCrt + ":" + idChildren);
		if (!isLinkToSelection) return { type: "none", distance: -1 };

		return isLinkToSelection.isChildren
			? { type: "children", distance: isLinkToSelection.distance }
			: { type: "parent", distance: isLinkToSelection.distance };
	});

export const isSelected = (id: number) =>
	selectAtom(currentNodeAtom, (node): boolean => node?.id === id);

export class NodeHelper {
	static selectedNode(node: INode | null) {
		store.set(currentNodeAtom, node);
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
