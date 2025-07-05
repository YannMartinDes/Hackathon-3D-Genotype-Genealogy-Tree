import { atom } from "jotai";
import { selectAtom } from "jotai/utils";
import { NODE_DATA_MAP, ENHANCED_DATA, type INode } from "../data";
import { NodeHelper } from "./helper";

export type NodeLink = {
	node: number;
	children: number;
	isChildren: boolean;
	isMaleLink: boolean;
	distance: number; // Optional distance property
};
export type LinkType = {
	type: "children" | "parentM" | "parent" | "childrenM" | "none";
	distance: number;
};

export const currentNodeAtom = atom<INode | null>(null);
export const search = atom<string | undefined>();
export const nodeLinkAtom = atom<Map<string, NodeLink>>((get) => {
	const currentNode = get(currentNodeAtom);
	return NodeHelper.computeGenealogyTree(currentNode as INode);
});
export const isFocusOnGenealogy = atom<boolean>(false);
export const showYear = atom<boolean>(true);

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

		if (isLinkToSelection.isMaleLink && !isLinkToSelection.isChildren) {
			return { type: "parentM", distance: isLinkToSelection.distance };
		}
		if (isLinkToSelection.isMaleLink && isLinkToSelection.isChildren) {
			return { type: "childrenM", distance: isLinkToSelection.distance };
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

	const data = isFocusFamily ? myFamily : ENHANCED_DATA;

	// No filtering if searchValue is empty
	if (!searchValue || searchValue.trim() === "") {
		return data;
	}

	return data.filter((node) => {
		const genotype = node.genotype?.toLowerCase() || "";
		const searchLower = searchValue.toLowerCase();

		return (
			genotype.includes(searchLower) ||
			myFamily.some((familyNode) => familyNode.id === node.id)
		);
	});
});

export const myFamilyAtom = selectAtom(nodeLinkAtom, (nodeLinkMap): INode[] => {
	if (!nodeLinkMap) return [];

	const links = Array.from(nodeLinkMap.values());

	const familyIds = new Set<number>();
	for (const link of links) {
		familyIds.add(link.node);
		familyIds.add(link.children);
	}

	return Array.from(familyIds)
		.map((id) => NODE_DATA_MAP.get(id))
		.filter(Boolean) as INode[];
});
