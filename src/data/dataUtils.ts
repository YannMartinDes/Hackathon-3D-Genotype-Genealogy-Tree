type RawItem = {
	"Data identifier (DATA_ID)": number;
	"Genotype name (C0001)": string;
	"Species (C0002)": string;
	"Female data ID (FEMALE_DATA_ID)": number | "" | null;
	"Registration year (C0159)": number;
};

type TransformedItem = {
	id: number;
	species: string;
	genotype: string;
	year: number;
	depth: number;
	parent: number | null;
};

export function transformDataset(rawData: RawItem[]): TransformedItem[] {
	const dataById = new Map<number, RawItem>();
	const depthCache = new Map<number, number>();

	// Indexer les données pour lookup rapide
	rawData.forEach((item) => {
		dataById.set(item["Data identifier (DATA_ID)"], item);
	});

	function calculateDepth(item: RawItem): number {
		const id = item["Data identifier (DATA_ID)"];
		if (depthCache.has(id)) {
			return depthCache.get(id)!;
		}

		const parentId = item["Female data ID (FEMALE_DATA_ID)"];
		if (typeof parentId !== "number" || !dataById.has(parentId)) {
			depthCache.set(id, 0);
			return 0;
		}

		const parentItem = dataById.get(parentId)!;
		const depth = calculateDepth(parentItem) + 1;
		depthCache.set(id, depth);
		return depth;
	}

	// Mapper vers le format transformé
	const transformed: TransformedItem[] = rawData.map((item) => {
		return {
			id: item["Data identifier (DATA_ID)"],
			species: item["Species (C0002)"],
			genotype: item["Genotype name (C0001)"],
			year: item["Registration year (C0159)"],
			depth: calculateDepth(item),
			parent:
				typeof item["Female data ID (FEMALE_DATA_ID)"] === "number"
					? item["Female data ID (FEMALE_DATA_ID)"]
					: null,
		};
	});

	return transformed;
}
