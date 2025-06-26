import { useMemo } from "react";
import { CameraControl } from "./CameraControl";
import { DataWithDisplay, nodesYears } from "./data";
import { Node } from "./Node";
import { YearSphere } from "./YearSphere";
import { useAtomValue } from "jotai";
import { isFocusOnGenealogy, myFamilyAtom } from "./Atom";

export function Scene() {
	const years = useMemo(() => Object.keys(nodesYears).map((year) => Number(year)), [nodesYears]);

	const myFamily = useAtomValue(myFamilyAtom);
	const isFocusFamily = useAtomValue(isFocusOnGenealogy);

	return (
		<>
			<ambientLight />
			<pointLight position={[10, 10, 10]} />
			<CameraControl />
			{years.map((year, i) => (
				<YearSphere key={year + i} year={Number(year)} gap={i} />
			))}
			{(isFocusFamily ? myFamily : DataWithDisplay).map((node) => (
				<Node key={node.id} node={node} />
			))}
		</>
	);
}
