import { Canvas } from "react-three-fiber";
import { Scene } from "./Scene";
import { InfoWindow } from "./InfoWindow";
import { useAtom, useAtomValue } from "jotai";
import { currentNodeAtom, isFocusOnGenealogy, NodeHelper, search, showYear } from "./atom";
import { useState } from "react";
import { dataMap } from "./data";

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

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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
			<YearSelector />
			{selected !== null ? (
				<>
					<InfoWindow width={300}>
						<h2>{selected.genotype}</h2>
						{selected.name && <p>Public name: {selected.name}</p>}
						{selected.trialName && <p>Experiment name: {selected.trialName}</p>}
						<p>ID: {selected.id}</p>
						<p>Depth: {selected.depth}</p>
						<p>Year: {selected.year}</p>
						<p>Species: {selected.species}</p>
						<p>Type: {selected.type}</p>

						{selected.generation && <p>Generation: {selected.generation}</p>}
					</InfoWindow>

					<InfoWindow top={420}>
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
					<InfoWindow top={300} left={20} width={300}>
						{selected.parent && (
							<>
								<p>Parents</p>
								<button
									style={{
										...buttonStyle,
										background:
											"linear-gradient(135deg,rgb(29, 119, 41) 0%,rgb(0, 255, 21) 100%)",
									}}
									onMouseOver={(e) => {
										e.currentTarget.style.transform = "scale(1.1)";
									}}
									onMouseOut={(e) => {
										e.currentTarget.style.transform = "scale(1)";
									}}
									onClick={async () => {
										NodeHelper.selectedNode(dataMap.get(selected.parent!)!);
										await wait(200); // wait 1s
										window.dispatchEvent(
											new KeyboardEvent("keydown", {
												key: "f",
												bubbles: true,
											})
										);
									}}
								>
									{dataMap.get(selected.parent)!.genotype ?? "Unselect"}
								</button>
							</>
						)}
						{selected.children.length > 0 && (
							<>
								<p>Children</p>
								<div
									style={{
										padding: "5px 15px",
										display: "flex",
										flexDirection: "column",
										gap: "5px",
										overflowY: "auto",
										maxHeight: "350px",
									}}
								>
									{selected.children.map((child) => (
										<button
											key={child.id}
											style={{
												...buttonStyle,
												background:
													"linear-gradient(135deg,rgb(29, 119, 41) 0%,rgb(0, 255, 21) 100%)",
											}}
											onMouseOver={(e) => {
												e.currentTarget.style.transform = "scale(1.1)";
											}}
											onMouseOut={(e) => {
												e.currentTarget.style.transform = "scale(1)";
											}}
											onClick={async () => {
												NodeHelper.selectedNode(child);
												await wait(200); // wait 1s
												window.dispatchEvent(
													new KeyboardEvent("keydown", {
														key: "f",
														bubbles: true,
													})
												);
											}}
										>
											{child.genotype}
										</button>
									))}
								</div>
							</>
						)}
					</InfoWindow>
				</>
			) : (
				<></>
			)}
		</div>
	);
}

function YearSelector() {
	const [showedYear, setShowYear] = useAtom(showYear);

	return (
		<InfoWindow top={150} left={20}>
			<div style={{ display: "flex", flexDirection: "row", gap: "2rem" }}>
				<button
					style={buttonStyle}
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
