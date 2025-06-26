/* eslint-disable react-refresh/only-export-components */
import { atom } from "jotai";
import { selectAtom } from "jotai/utils";
import { dataMap, DataWithDisplay, type INode } from "./data";
import { store } from "./utils";

export type NodeLink = {
	node: number;
	children: number;
	isChildren: boolean;
	isMaleLink: boolean;
	distance: number; // Optional distance property
};
export type LinkType = { type: "children" | "parentM" | "parent" | "none"; distance: number };

export const currentNodeAtom = atom<INode | null>(null);
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

		if (isLinkToSelection.isMaleLink) {
			return { type: "parentM", distance: isLinkToSelection.distance };
		}

		return isLinkToSelection.isChildren
			? { type: "children", distance: isLinkToSelection.distance }
			: { type: "parent", distance: isLinkToSelection.distance };
	});

export const isSelected = (id: number) =>
	selectAtom(currentNodeAtom, (node): boolean => node?.id === id);

export const filteredDataAtom = atom<INode[]>((get) => {
	const isFocusFamily = get(isFocusOnGenealogy);
	const myFamily = get(myFamilyAtom);
	const searchValue = get(search);

	const data = isFocusFamily ? myFamily : DataWithDisplay;

	// Pas de filtre si la recherche est vide
	if (!searchValue || searchValue.trim() === "") {
		return data;
	}

	return data.filter((node) => {
		const genotype = node.genotype?.toLowerCase() || "";
		//const species = node.species?.toLowerCase() || "";
		const searchLower = searchValue.toLowerCase();

		return (
			genotype.includes(searchLower) ||
			//	species.includes(searchLower) ||
			myFamily.some((familyNode) => familyNode.id === node.id)
		);
	});
});

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
	}
	static unselectNode() {
		store.set(currentNodeAtom, null);
		store.set(search, undefined);
		store.set(isFocusOnGenealogy, false);
	}

	static computeGenealogyTree(node: INode | null) {
		if (!node) {
			return new Map<string, NodeLink>();
		}
		const genealogyTree: NodeLink[] = [];
		const computeParent = (currentNode: INode, distance: number, maleMode: boolean) => {
			if (maleMode) {
				if (currentNode.male === null) return;
				const parentM = dataMap.get(currentNode.male!)!;

				genealogyTree.push({
					node: parentM.id,
					children: currentNode.id,
					isChildren: false,
					isMaleLink: true,
					distance: distance,
				});
				computeParent(parentM, distance + 1, true);
			} else {
				if (currentNode.parent === null) return;
				const parent = dataMap.get(currentNode.parent!)!;

				genealogyTree.push({
					node: parent.id,
					children: currentNode.id,
					isChildren: false,
					isMaleLink: false,
					distance: distance,
				});
				computeParent(parent, distance + 1, false);
			}
		};
		computeParent(node, 1, false);
		computeParent(node, 1, true);

		const computeChildren = (currentNode: INode, distance: number) => {
			currentNode.children?.forEach((child) => {
				genealogyTree.push({
					node: currentNode.id,
					children: child.id,
					isChildren: true,
					distance: distance,
					isMaleLink: false,
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
