import { CameraControl } from "./CameraControl";
import { Node } from "./Node";
import { NODES } from "./data";

export function Scene() {
	return (
		<>
			<ambientLight />
			<pointLight position={[10, 10, 10]} />
			<CameraControl />
			<Node current={NODES} deep={0} sibling={0} parent={null} />
		</>
	);
}
