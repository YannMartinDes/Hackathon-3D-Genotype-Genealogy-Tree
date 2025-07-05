import { useCallback } from "react";
import { wait } from "../App";
import { KEY_FOCUS } from "../CameraControl";
import type { INode } from "../data";
import { NodeHelper } from "../jotai/helper";
import { BUTTON_STYLE } from "./constant";

export function ChildrenList({ title, childrenList }: { title: string; childrenList: INode[] }) {
	const handleClick = useCallback(async (child: INode) => {
		NodeHelper.selectedNode(child);
		await wait(200);
		window.dispatchEvent(new KeyboardEvent("keydown", { key: KEY_FOCUS, bubbles: true }));
	}, []);

	if (childrenList.length === 0) return <></>;
	return (
		<div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
			<p>{title}</p>
			<div
				style={{
					padding: "5px 15px",
					display: "flex",
					flexDirection: "column",
					gap: "5px",
					overflowY: "auto",
					maxHeight: "250px",
				}}
			>
				{childrenList.map((child) => (
					<button
						key={child.id}
						style={{
							...BUTTON_STYLE,
							background:
								"linear-gradient(135deg,rgb(29, 119, 41) 0%,rgb(0, 255, 21) 100%)",
						}}
						onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
						onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
						onClick={() => handleClick(child)}
					>
						{child.genotype}
					</button>
				))}
			</div>
		</div>
	);
}
