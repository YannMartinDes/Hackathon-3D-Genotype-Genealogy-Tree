import {
	Vector3,
	BufferGeometry,
	Material,
	Mesh,
	type NormalBufferAttributes,
	type Object3DEventMap,
} from "three";
import DATA from "./data/formated.json";

export interface IRawNode {
	id: number;
	species: string;
	genotype: string;
	year: number;
	depth: number;
	parent: number | null;
}

export const nodesYears: Record<number, INode[]> = {};
export interface INode extends IRawNode {
	coordinates: Vector3;
	children: INode[];
	ref?: Mesh<
		BufferGeometry<NormalBufferAttributes>,
		Material | Material[],
		Object3DEventMap
	> | null;
}

export const NODES: IRawNode[] = DATA as unknown as IRawNode[];
const computeCoordinates = (node: IRawNode): Vector3 => {
	const radius = 20 * (node.depth + 1);

	const theta = Math.random() * 2 * Math.PI; // angle azimutal
	const phi = Math.acos(2 * Math.random() - 1); // angle polaire, distribution uniforme sur la sphère

	const x = radius * Math.sin(phi) * Math.cos(theta);
	const y = radius * Math.cos(phi);
	const z = radius * Math.sin(phi) * Math.sin(theta);

	return new Vector3(x, y, z);
};

export const DataWithDisplay: INode[] = NODES.map((elt) => {
	const node = {
		...elt,
		coordinates: computeCoordinates(elt),
		children: [],
	};

	if (!nodesYears[elt.year]) {
		nodesYears[elt.year] = [];
	}

	nodesYears[elt.year].push(node);

	return node;
});

export const dataMap = new Map<number, INode>(DataWithDisplay.map((node) => [node.id, node]));
function computeChildren() {
	DataWithDisplay.forEach((node) => {
		if (node.parent) {
			dataMap.get(node.parent)?.children.push(node);
		}
	});
}
computeChildren();
