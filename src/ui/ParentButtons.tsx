import { useCallback } from "react";
import { wait } from "../App";
import { KEY_FOCUS } from "../CameraControl";
import { type INode, NODE_DATA_MAP } from "../data";
import { NodeHelper } from "../jotai/helper";
import { BUTTON_STYLE } from "./constant";

export function ParentButtons({ selected }: { selected: INode }) {
	const handleClick = useCallback(async (nodeId: number) => {
		NodeHelper.selectedNode(NODE_DATA_MAP.get(nodeId)!);
		await wait(200);
		window.dispatchEvent(new KeyboardEvent("keydown", { key: KEY_FOCUS, bubbles: true }));
	}, []);

	if (!(selected.parent || selected.male)) return <></>;
	return (
		<>
			<p>Parents</p>
			<div style={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
				{selected.parent && (
					<button
						style={{
							...BUTTON_STYLE,
							background:
								"linear-gradient(135deg,rgb(214, 65, 219) 0%,rgb(236, 164, 233)100%)",
						}}
						onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
						onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
						onClick={() => handleClick(selected.parent!)}
					>
						{NODE_DATA_MAP.get(selected.parent)?.genotype ?? "Unselect"}
					</button>
				)}
				{selected.male && (
					<button
						style={{
							...BUTTON_STYLE,
							background:
								"linear-gradient(135deg,rgb(46, 12, 172) 0%,rgb(4, 194, 241) 100%)",
						}}
						onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
						onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
						onClick={() => handleClick(selected.male!)}
					>
						{NODE_DATA_MAP.get(selected.male)?.genotype ?? "Unselect"}
					</button>
				)}
			</div>
		</>
	);
}
