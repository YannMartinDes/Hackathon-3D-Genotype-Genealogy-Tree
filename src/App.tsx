import { Canvas } from "react-three-fiber";
import { Scene } from "./Scene";
import { InfoWindow } from "./InfoWindow";
import { useAtom, useAtomValue } from "jotai";
import { currentNodeAtom, isFocusOnGenealogy, NodeHelper, search } from "./atom";
import { useState } from "react";

const buttonStyle = {
	padding: "10px 20px",
	background: "linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%)",
	color: "white",
	border: "none",
	borderRadius: "8px",
	cursor: "pointer",
	fontSize: "14px",
	fontWeight: "bold",
	boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
	transition: "all 0.2s ease-in-out",
};

function App() {
	const selected = useAtomValue(currentNodeAtom);
	const [focusFamily, setFocusFamily] = useAtom(isFocusOnGenealogy);

	return (
		<div style={{ width: "100%", height: "100%", backgroundColor: "gray" }}>
			<Canvas camera={{ position: [0, 0, 80] }}>
				<Scene />
			</Canvas>
			{/* UI elements */}
			<SearchComponent />
			{selected !== null ? (
				<>
					<InfoWindow>
						<h2>{selected.genotype}</h2>
						<p>ID: {selected.id}</p>
						<p>Depth: {selected.depth}</p>
						<p>Year: {selected.year}</p>
						<p>Species: {selected.species}</p>
					</InfoWindow>

					<InfoWindow top={300}>
						<div style={{ display: "flex", flexDirection: "row", gap: "2rem" }}>
							<button
								style={buttonStyle}
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
								style={buttonStyle}
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
				</>
			) : (
				<></>
			)}
		</div>
	);
}

function SearchComponent() {
	const [inputValue, setInputValue] = useState("");
	const [, setSearch] = useAtom(search);

	return (
		<InfoWindow left={20}>
			<div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
				<label htmlFor="search" style={{ fontWeight: "bold", fontSize: "1.1rem" }}>
					🔍 Search
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
						style={buttonStyle}
						onMouseOver={(e) => {
							e.currentTarget.style.transform = "scale(1.05)";
						}}
						onMouseOut={(e) => {
							e.currentTarget.style.transform = "scale(1)";
						}}
						onClick={() => {
							setSearch(inputValue);
							setInputValue(""); // Clear input after search
						}}
					>
						Search
					</button>
				</div>
			</div>
		</InfoWindow>
	);
}

export default App;
