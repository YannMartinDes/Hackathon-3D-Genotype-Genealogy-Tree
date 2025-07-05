import { useAtomValue } from "jotai";
import { filteredDataAtom, showYear } from "./jotai/atom";
import { CameraControl } from "./CameraControl";
import { YEAR_LIST } from "./data";
import { Node } from "./Node";
import { YearSphere } from "./components/YearSphere";

export function Scene() {
	const yearDisplay = useAtomValue(showYear);
	const filterData = useAtomValue(filteredDataAtom);

	return (
		<>
			<ambientLight />
			<pointLight position={[10, 10, 10]} />
			<CameraControl />
			{yearDisplay &&
				YEAR_LIST.map((year, i) => (
					<YearSphere key={year + i} year={Number(year)} gap={i} />
				))}
			{filterData.map((node) => (
				<Node key={node.id} node={node} />
			))}
		</>
	);
}
