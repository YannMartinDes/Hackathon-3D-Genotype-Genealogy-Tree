/* eslint-disable @typescript-eslint/no-explicit-any */

export function buildHierarchy(data: any) {
	// Step 1: Create a map of all nodes by DATA_ID
	const nodeMap = new Map();

	// Step 2: Create nodes with children arrays
	data.forEach((item: any) => {
		const id = String(item["Data identifier (DATA_ID)"]);
		nodeMap.set(id, {
			id,
			species: item["Species (C0002)"],
			genotype: item["Genotype name (C0001)"],
			year: item["Registration year (C0159)"],
			children: [],
		});
	});

	const roots: any[] = [];

	// Step 3: Link children to their parents based on "Direct F parent"
	data.forEach((item: any) => {
		const id = String(item["Data identifier (DATA_ID)"]);
		const parentId = item["Female data ID (FEMALE_DATA_ID)"]?.toString();

		if (parentId && nodeMap.has(parentId)) {
			nodeMap.get(parentId).children.push(nodeMap.get(id));
		} else {
			// If no parent or parent not found, it's a root node
			roots.push(nodeMap.get(id));
		}
	});

	return [
		{
			id: "root",
			children: roots,
		},
	];
}
