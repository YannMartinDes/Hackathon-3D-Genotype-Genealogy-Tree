import { Canvas } from "react-three-fiber";
import { Scene } from "./Scene";
import { InfoWindow } from "./InfoWindow";

function App() {
	return (
		<div style={{ width: "100%", height: "100%", backgroundColor: "gray" }}>
			<Canvas camera={{ position: [0, 0, 80] }}>
				<Scene />
			</Canvas>
			<InfoWindow>
				<h2>Infos Node</h2>
				<p>ID: 123</p>
				<p>Depth: 2</p>
				{/* Tu peux mettre n’importe quoi ici */}
			</InfoWindow>
		</div>
	);
}

export default App;
