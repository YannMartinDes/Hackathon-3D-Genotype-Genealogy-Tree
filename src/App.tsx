import { Canvas } from "react-three-fiber";
import { Scene } from "./Scene";

function App() {
	return (
		<div style={{ width: "100%", height: "100%", backgroundColor: "gray" }}>
			<Canvas camera={{ position: [0, 0, 80] }}>
				<Scene />
			</Canvas>
		</div>
	);
}

export default App;
