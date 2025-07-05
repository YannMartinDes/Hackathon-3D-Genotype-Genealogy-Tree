import { useAtom } from "jotai";
import { useState, useCallback } from "react";
import { KEY_FOCUS } from "../CameraControl";
import { search, filteredDataAtom } from "../jotai/atom";
import { NodeHelper } from "../jotai/helper";
import { store } from "../utils";
import { BUTTON_STYLE } from "./constant";
import { InfoWindow } from "./InfoWindow";
import { wait } from "../App";

export function SearchComponent() {
	const [inputValue, setInputValue] = useState("");
	const [, setSearch] = useAtom(search);
	const [filtered] = useAtom(filteredDataAtom);

	const onSearch = useCallback(() => {
		const a = store.get(filteredDataAtom);
		if (a.length > 0) {
			NodeHelper.selectedNode(a[0]);
			wait(200).then(() => {
				window.dispatchEvent(
					new KeyboardEvent("keydown", {
						key: KEY_FOCUS,
						bubbles: true,
					})
				);
			});
		}
	}, []);

	return (
		<InfoWindow left={20}>
			<div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
				<label htmlFor="search" style={{ fontWeight: "bold", fontSize: "1.1rem" }}>
					{`🔍 Search  ${filtered.length ? `(${filtered.length} results)` : ""}`}
				</label>
				<div style={{ display: "flex", flexDirection: "row", gap: "0.5rem" }}>
					<input
						id="search"
						type="text"
						placeholder="Enter node ID or genotype..."
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						style={{
							padding: "0.5rem",
							borderRadius: "8px",
							border: "1px solid #ccc",
							fontSize: "1rem",
							width: "90%",
						}}
					/>
					<button
						style={BUTTON_STYLE}
						onMouseOver={(e) => {
							e.currentTarget.style.transform = "scale(1.05)";
						}}
						onMouseOut={(e) => {
							e.currentTarget.style.transform = "scale(1)";
						}}
						onClick={async () => {
							setSearch(inputValue);
							onSearch();
						}}
					>
						Search
					</button>
				</div>
			</div>
		</InfoWindow>
	);
}
