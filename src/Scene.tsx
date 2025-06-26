import { useAtomValue } from "jotai";
import { isFocusOnGenealogy, myFamilyAtom, search } from "./atom";
import { CameraControl } from "./CameraControl";
import { DataWithDisplay, YEAR_LIST } from "./data";
import { Node } from "./Node";
import { YearSphere } from "./YearSphere";
import { useMemo } from "react";

export function Scene() {
	const myFamily = useAtomValue(myFamilyAtom);
	const isFocusFamily = useAtomValue(isFocusOnGenealogy);
	const searchValue = useAtomValue(search);

	const data = useMemo(() => {
		return isFocusFamily ? myFamily : DataWithDisplay;
	}, [isFocusFamily, myFamily]);

	const filterData = useMemo(() => {
		if (searchValue === undefined || searchValue === "") {
			return data;
		}
		return data.filter((node) => {
			return (
				node.genotype.toLowerCase().includes(searchValue.toLowerCase()) ||
				node.species.toLowerCase().includes(searchValue.toLowerCase()) ||
				myFamily.some((familyNode) => familyNode.id === node.id)
			);
		});
	}, [data, myFamily, searchValue]);

	return (
		<>
			<ambientLight />
			<pointLight position={[10, 10, 10]} />
			<CameraControl />
			{YEAR_LIST.map((year, i) => (
				<YearSphere key={year + i} year={Number(year)} gap={i} />
			))}
			{filterData.map((node) => (
				<Node key={node.id} node={node} />
			))}
		</>
	);
}
