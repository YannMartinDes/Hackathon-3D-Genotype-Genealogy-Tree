import { type INode, NODE_DATA_MAP } from "../data";
import { store } from "../utils";
import { currentNodeAtom, search, isFocusOnGenealogy, type NodeLink } from "./atom";

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
				const parentM = NODE_DATA_MAP.get(currentNode.male!)!;

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
				const parent = NODE_DATA_MAP.get(currentNode.parent!)!;

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
			currentNode.childrenF?.forEach((child) => {
				genealogyTree.push({
					node: currentNode.id,
					children: child.id,
					isChildren: true,
					distance: distance,
					isMaleLink: false,
				});
				computeChildren(child, distance + 1);
			});
			currentNode.childrenM?.forEach((child) => {
				genealogyTree.push({
					node: currentNode.id,
					children: child.id,
					isChildren: true,
					distance: distance,
					isMaleLink: true,
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
