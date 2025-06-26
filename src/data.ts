import { Mesh, Vector3 } from "three";
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

const computeCoordinatesV1 = (node: INode): Vector3 => {
	const yearIndex = YEAR_LIST.indexOf(node.year);
	const radius = 20 * (yearIndex + 1);

	const theta = Math.random() * 2 * Math.PI; // angle azimutal
	const phi = Math.acos(2 * Math.random() - 1); // angle polaire, distribution uniforme sur la sphère

	const x = radius * Math.sin(phi) * Math.cos(theta);
	const y = radius * Math.cos(phi);
	const z = radius * Math.sin(phi) * Math.sin(theta);

	return new Vector3(x, y, z);
};

function randomDirectionWithinCone(baseDir: Vector3, maxAngle: number): Vector3 {
	const axis = new Vector3().randomDirection(); // random axis
	const angle = Math.random() * maxAngle;
	return baseDir.clone().applyAxisAngle(axis, angle).normalize();
}

function placeNode3D(baseDir: Vector3, radius: number, maxAngle: number): Vector3 {
	const dir = randomDirectionWithinCone(baseDir, maxAngle);
	return dir.multiplyScalar(radius);
}

function computeCoordinatesV2(node: INode) {
	if (!node.parent) {
		node.coordinates = computeCoordinatesV1(node);
		return;
	}

	const parent = dataMap.get(node.parent) as INode;
	const yearIndex = YEAR_LIST.indexOf(node.year);
	const radius = 20 * (yearIndex + 1);

	const baseDir = parent.coordinates.clone().normalize();

	const maxAngle = Math.PI / 3; // 30 degrees
	node.coordinates = placeNode3D(baseDir, radius, maxAngle);
}

function asd() {
	Object.keys(nodesYears).map((year: string) => {
		nodesYears[Number(year)].map((node) => {
			computeCoordinatesV2(node);
		});
	});
}

function computeYear() {
	return Object.keys(nodesYears)
		.map((year) => Number(year))
		.sort();
}

export const DataWithDisplay: INode[] = NODES.map((elt) => {
	const node = {
		...elt,
		coordinates: new Vector3(),
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
export const YEAR_LIST = computeYear();

asd();
