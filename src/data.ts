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

export const nodesYears: Record<number, INode[]> = {};
export interface INode extends IRawNode {
	position: Vector3;
	children: INode[];
	parentNode?: INode;
}

export const NODES: IRawNode[] = DATA as unknown as IRawNode[];

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
	const parent = node.parentNode;
	if (
		!parent ||
		(parent.position.x === 0 && parent.position.y === 0 && parent.position.z === 0)
	) {
		node.position = computeCoordinatesV1(node);
		return;
	}
	const yearIndex = YEAR_LIST.indexOf(node.year);
	const radius = 20 * (yearIndex + 1);

	const baseDir = parent.position.clone().normalize();

	const maxAngle = Math.PI / 3; // 30 degrees
	node.position = placeNode3D(baseDir, radius, maxAngle);
}

function asd() {
	YEAR_LIST.map((year: number) => {
		nodesYears[year]
			.sort((a, b) => {
				return (a.parentNode?.year ?? 0) - (b.parentNode?.year ?? 0);
			})
			.map((node) => {
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
		position: new Vector3(),
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
			const pNode = dataMap.get(node.parent);
			pNode?.children.push(node);
			node.parentNode = pNode;
		}
	});
}
computeChildren();
export const YEAR_LIST = computeYear();

asd();
