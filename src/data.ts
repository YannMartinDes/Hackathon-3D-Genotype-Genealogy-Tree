import { Mesh, Vector3 } from "three";
import DATA from "./data/formated.json";

export interface IRawNode {
	id: number;
	species: string;
	genotype: string;
	year: number;
	depth: number;
	parent: number | null;
	male: number | null;
	type: string;
	generation: string;
	name: string;
	trialName: string;
}

export const nodesYears: Record<number, IRawNode[]> = {};
export interface INode extends IRawNode {
	coordinates: Vector3;
	children: INode[];
	ref?: Mesh;
}

export const NODES: IRawNode[] = DATA as unknown as IRawNode[];
const computeCoordinates = (node: IRawNode): Vector3 => {
	const yearIndex = YEAR_LIST.indexOf(node.year);
	const radius = 20 * (yearIndex + 1);

	const theta = Math.random() * 2 * Math.PI; // angle azimutal
	const phi = Math.acos(2 * Math.random() - 1); // angle polaire, distribution uniforme sur la sphère

	const x = radius * Math.sin(phi) * Math.cos(theta);
	const y = radius * Math.cos(phi);
	const z = radius * Math.sin(phi) * Math.sin(theta);

	return new Vector3(x, y, z);
};

function computeYear() {
	NODES.forEach((node) => {
		if (!nodesYears[node.year]) {
			nodesYears[node.year] = [];
		}

		nodesYears[node.year].push(node);
	});
	return Object.keys(nodesYears)
		.map((year) => Number(year))
		.sort();
}
export const YEAR_LIST = computeYear();

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
