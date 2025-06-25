/* eslint-disable react-refresh/only-export-components */
import { atom } from "jotai";
import { store } from "./utils";
import { dataMap, type INodeWithDisplay } from "./data";
import { selectAtom } from "jotai/utils";

export const currentNodeAtom = atom<INodeWithDisplay | null>(null);
export const nodeAtom = atom<Map<string, { node: number; children: number; isChildren: boolean }>>(
	(get) => {
		const currentNode = get(currentNodeAtom);
		return NodeHelper.computeGenealogyTree(currentNode as INodeWithDisplay);
	}
);
export const linkTypeAtom = (idCrt: number, idChildren: number) =>
	selectAtom(nodeAtom, (node) => {
		const isLinkToSelection = node.get(idCrt + ":" + idChildren);
		if (!isLinkToSelection) return "none";
		return isLinkToSelection.isChildren ? "children" : "parent";
	});

export const isSelected = (id: number) =>
	selectAtom(currentNodeAtom, (node): boolean => node?.id === id);

export class NodeHelper {
	static selectedNode(node: INodeWithDisplay | null) {
		console.log("Selected node:", node);
		store.set(currentNodeAtom, node);
	}

	static computeGenealogyTree(node: INodeWithDisplay | null) {
		if (!node) {
			return new Map<string, { node: number; children: number; isChildren: boolean }>();
		}
		const genealogyTree: { node: number; children: number; isChildren: boolean }[] = [];
		const computeParent = (currentNode: INodeWithDisplay) => {
			if (currentNode.parent === null) return;
			const parent = dataMap.get(currentNode.parent)!;
			genealogyTree.push({
				node: parent.id,
				children: currentNode.id,
				isChildren: false,
			});
			computeParent(parent);
		};
		computeParent(node);

		const computeChildren = (currentNode: INodeWithDisplay) => {
			currentNode.children?.forEach((child) => {
				genealogyTree.push({
					node: currentNode.id,
					children: child.id,
					isChildren: true,
				});
				computeChildren(child);
			});
		};
		computeChildren(node);

		const map = new Map<string, { node: number; children: number; isChildren: boolean }>(
			genealogyTree.map((item) => [item.node + ":" + item.children, item])
		);

		return map;
	}
}
