import { useState } from "react";
import { Vector3 } from "three";
import { CameraControl } from "./CameraControl";
import { Node } from "./Node";
import { NODES } from "./data";

export function Scene() {
	const [selectedBox, setSelectedBox] = useState<number | null>(null);
	const boxes = [
		[0, 0, 0],
		[3, 0, 0],
		[-3, 0, 0],
	] as [number, number, number][];

	const target = selectedBox !== null ? new Vector3(...boxes[selectedBox]) : null;

	return (
		<>
			<ambientLight />
			<pointLight position={[10, 10, 10]} />
			<CameraControl target={target} />
			<Node current={NODES} deep={0} />
		</>
	);
}
