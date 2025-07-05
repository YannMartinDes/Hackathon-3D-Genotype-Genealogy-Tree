import { Vector3 } from "three";
import DATA from "./data/FORMATTED.json";

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

export interface INode extends IRawNode {
	position: Vector3;
	children: INode[];
	childrenM: INode[];
	childrenF: INode[];
	parentNode?: INode;
}

export class DataHelper {
	static computeRandomCoordinates = (node: INode): Vector3 => {
		const yearIndex = YEAR_LIST.indexOf(node.year);
		const radius = 20 * (yearIndex + 1);

		const theta = Math.random() * 2 * Math.PI; // angle azimutal
		const phi = Math.acos(2 * Math.random() - 1); // angle polaire, distribution uniforme sur la sphère

		const x = radius * Math.sin(phi) * Math.cos(theta);
		const y = radius * Math.cos(phi);
		const z = radius * Math.sin(phi) * Math.sin(theta);

		return new Vector3(x, y, z);
	};

	static randomDirectionWithinCone(baseDir: Vector3, maxAngle: number): Vector3 {
		const axis = new Vector3().randomDirection(); // random axis
		const angle = Math.random() * maxAngle;
		return baseDir.clone().applyAxisAngle(axis, angle).normalize();
	}
	static placeNode3D(baseDir: Vector3, radius: number, maxAngle: number): Vector3 {
		const dir = DataHelper.randomDirectionWithinCone(baseDir, maxAngle);
		return dir.multiplyScalar(radius);
	}

	static computeCoordinates(node: INode) {
		const parent = node.parentNode;

		if (
			!parent ||
			(parent.position.x === 0 && parent.position.y === 0 && parent.position.z === 0)
		) {
			node.position = DataHelper.computeRandomCoordinates(node);
			return;
		}

		const yearIndex = YEAR_LIST.indexOf(node.year);
		const radius = 20 * (yearIndex + 1);

		const baseDir = parent.position.clone().normalize();

		const maxAngle = Math.PI / 3; // 30 degrees
		node.position = DataHelper.placeNode3D(baseDir, radius, maxAngle);
	}

	static computeNodeYearLayer() {
		YEAR_LIST.map((year: number) => {
			NODES_BY_YEARS[year]
				.sort((a, b) => {
					return (a.parentNode?.year ?? 0) - (b.parentNode?.year ?? 0);
				})
				.map((node) => {
					DataHelper.computeCoordinates(node);
				});
		});
	}

	static computeYearList() {
		return Object.keys(NODES_BY_YEARS)
			.map((year) => Number(year))
			.sort();
	}

	static computeNodeChildren() {
		ENHANCED_DATA.forEach((node) => {
			if (node.parent) {
				const pNode = NODE_DATA_MAP.get(node.parent);
				if (pNode) {
					if (!pNode.children.some((child) => child.id === node.id)) {
						pNode.children.push(node);
					}
					pNode.childrenF.push(node);
					node.parentNode = pNode;
				}
			}
			if (node.male) {
				const mNode = NODE_DATA_MAP.get(node.male);
				if (mNode) {
					if (!mNode.children.some((child) => child.id === node.id)) {
						mNode.children.push(node);
					}
					mNode?.childrenM.push(node);
				}
			}
		});
	}
}
export const NODES_BY_YEARS: Record<number, INode[]> = {};
export const ENHANCED_DATA: INode[] = (DATA as unknown as IRawNode[]).map((elt) => {
	const node = {
		...elt,
		position: new Vector3(),
		children: [],
		childrenF: [],
		childrenM: [],
	};

	if (!NODES_BY_YEARS[elt.year]) {
		NODES_BY_YEARS[elt.year] = [];
	}

	NODES_BY_YEARS[elt.year].push(node);

	return node;
});

export const NODE_DATA_MAP = new Map<number, INode>(ENHANCED_DATA.map((node) => [node.id, node]));

DataHelper.computeNodeChildren();
export const YEAR_LIST = DataHelper.computeYearList();

DataHelper.computeNodeYearLayer();
