import { useAtomValue } from "jotai";
import { isFocusOnGenealogy, myFamilyAtom } from "./atom";
import { CameraControl } from "./CameraControl";
import { DataWithDisplay, YEAR_LIST } from "./data";
import { Node } from "./Node";
import { YearSphere } from "./YearSphere";

export function Scene() {
	const myFamily = useAtomValue(myFamilyAtom);
	const isFocusFamily = useAtomValue(isFocusOnGenealogy);

	return (
		<>
			<ambientLight />
			<pointLight position={[10, 10, 10]} />
			<CameraControl />
			{YEAR_LIST.map((year, i) => (
				<YearSphere key={year + i} year={Number(year)} gap={i} />
			))}
			{(isFocusFamily ? myFamily : DataWithDisplay).map((node) => (
				<Node key={node.id} node={node} />
			))}
		</>
	);
}
