export interface Node {
	children: Node[];
	id: string;
	species?: string;
	genotype?: string;
}

export const NODES: Node = {
	children: [
		{
			id: "child-1",
			children: [
				{
					id: "child-1-1",
					children: [
						{
							id: "child-1-1-1",
							children: [],
						},
					],
				},
				{
					id: "child-1-2",
					children: [
						{
							id: "child-1-2-1",
							children: [],
						},
					],
				},
			],
		},
		{
			id: "child-2",
			children: [
				{
					id: "child-2-1",
					children: [
						{
							id: "child-2-1-1",
							children: [],
						},
					],
				},
				{
					id: "child-2-2",
					children: [
						{
							id: "child-2-2-1",
							children: [
								{
									id: "child-2-2-1-1",
									children: [],
								},
							],
						},
						{
							id: "child-2-2-2",
							children: [],
						},
					],
				},
			],
		},
	],
	id: "root",
};
