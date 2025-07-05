import { useAtom } from "jotai";
import { showYear } from "../jotai/atom";
import { InfoWindow } from "./InfoWindow";
import { BUTTON_STYLE } from "./constant";

export function YearToggle() {
	const [showedYear, setShowYear] = useAtom(showYear);

	return (
		<InfoWindow top={150} left={20}>
			<div style={{ display: "flex", flexDirection: "row", gap: "2rem" }}>
				<button
					style={BUTTON_STYLE}
					onMouseOver={(e) => {
						e.currentTarget.style.transform = "scale(1.1)";
					}}
					onMouseOut={(e) => {
						e.currentTarget.style.transform = "scale(1)";
					}}
					onClick={() => setShowYear(!showedYear)}
				>
					{showedYear ? "Hide Year circle" : "Show Year circle"}
				</button>
			</div>
		</InfoWindow>
	);
}
