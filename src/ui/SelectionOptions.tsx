import { useAtom } from "jotai";
import { isFocusOnGenealogy } from "../jotai/atom";
import { NodeHelper } from "../jotai/helper";
import { BUTTON_STYLE } from "./constant";
import { InfoWindow } from "./InfoWindow";

export default function SelectionOptions() {
	const [focusFamily, setFocusFamily] = useAtom(isFocusOnGenealogy);

	return (
		<InfoWindow top={250} left={20}>
			<div style={{ display: "flex", flexDirection: "row", gap: "2rem" }}>
				<button
					style={BUTTON_STYLE}
					onMouseOver={(e) => {
						e.currentTarget.style.transform = "scale(1.1)";
					}}
					onMouseOut={(e) => {
						e.currentTarget.style.transform = "scale(1)";
					}}
					onClick={() => setFocusFamily(!focusFamily)}
				>
					{focusFamily ? "Unfocus genealogy" : "Focus genealogy"}
				</button>
				<button
					style={BUTTON_STYLE}
					onMouseOver={(e) => {
						e.currentTarget.style.transform = "scale(1.1)";
					}}
					onMouseOut={(e) => {
						e.currentTarget.style.transform = "scale(1)";
					}}
					onClick={() => NodeHelper.unselectNode()}
				>
					Unselect
				</button>
			</div>
		</InfoWindow>
	);
}
