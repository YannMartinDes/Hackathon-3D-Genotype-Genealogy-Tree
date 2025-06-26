import { Canvas } from "react-three-fiber";
import { Scene } from "./Scene";
import { InfoWindow } from "./InfoWindow";
import { useAtomValue } from "jotai";
import { currentNodeAtom } from "./Atom";

function App() {
	const selected = useAtomValue(currentNodeAtom);

	return (
		<div style={{ width: "100%", height: "100%", backgroundColor: "gray" }}>
			<Canvas camera={{ position: [0, 0, 80] }}>
				<Scene />
			</Canvas>
			{selected !== null ? (
				<InfoWindow>
					<h2>Infos Node</h2>
					<p>ID: {selected.id}</p>
					<p>Depth: {selected.depth}</p>
					{/* Tu peux mettre n’importe quoi ici */}
				</InfoWindow>
			) : (
				<></>
			)}
		</div>
	);
}

export default App;
