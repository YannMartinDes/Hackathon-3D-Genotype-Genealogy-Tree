import { useAtomValue } from "jotai";
import { Canvas } from "react-three-fiber";
import { Scene } from "./Scene";
import { currentNodeAtom } from "./jotai/atom";
import { GenealogyInfo } from "./ui/GenealogyInfo";
import InfoPanel from "./ui/InfoPanel";
import Legend from "./ui/Legend";
import { SearchComponent } from "./ui/SearchComponent";
import SelectionOptions from "./ui/SelectionOptions";
import { YearToggle } from "./ui/YearToggle";

// eslint-disable-next-line react-refresh/only-export-components
export const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function App() {
	const selected = useAtomValue(currentNodeAtom);

	return (
		<div style={{ width: "100%", height: "100%", backgroundColor: "gray" }}>
			<Canvas camera={{ position: [0, 0, 80] }}>
				<Scene />
			</Canvas>
			{/* UI elements */}
			<SearchComponent />
			<YearToggle />
			<Legend />
			{selected !== null && (
				<>
					<InfoPanel />
					<SelectionOptions />
					<GenealogyInfo />
				</>
			)}
		</div>
	);
}

export default App;
