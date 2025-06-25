import { CameraControl } from "./CameraControl";
import { DataWithDisplay } from "./data";
import { Node } from "./Node";
import { YearSphere } from "./YearSphere";

export function Scene() {
	const years = [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010];

	return (
		<>
			<ambientLight />
			<pointLight position={[10, 10, 10]} />
			<CameraControl />
			{years.map((year, i) => (
				<YearSphere key={year + i} year={year} gap={i} />
			))}
			{DataWithDisplay.map((node) => (
				<Node key={node.id} node={node} />
			))}
		</>
	);
}
