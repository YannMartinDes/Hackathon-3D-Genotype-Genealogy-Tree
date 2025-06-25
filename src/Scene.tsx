import { CameraControl } from "./CameraControl";
import { Node } from "./Node";
import { YearSphere } from "./YearSphere";
import { NODES } from "./data";

export function Scene() {
	const years = [2000, 2001, 2002];

	return (
		<>
			<ambientLight />
			<pointLight position={[10, 10, 10]} />
			<CameraControl />
			{years.map((year, i) => (
				<YearSphere year={year} gap={i} />
			))}
			<Node current={NODES} deep={0} sibling={0} />
		</>
	);
}
