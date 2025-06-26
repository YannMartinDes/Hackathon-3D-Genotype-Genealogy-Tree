import { useAtom, useAtomValue } from "jotai";
import { useCallback, useState } from "react";
import { Canvas } from "react-three-fiber";
import {
	currentNodeAtom,
	filteredDataAtom,
	isFocusOnGenealogy,
	NodeHelper,
	search,
	showYear,
} from "./atom";
import { dataMap } from "./data";
import { InfoWindow } from "./InfoWindow";
import { Scene } from "./Scene";
import { store } from "./utils";

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

const legendItems = [
	{ label: "Children (Female)", color: "purple" },
	{ label: "Children (Male)", color: "darkgreen" },
	{ label: "Parent (Female)", color: "#FF007F" },
	{ label: "Parent (Male)", color: "blue" },
];

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
			<InfoWindow left={20} top={700}>
				<div
					style={{
						display: "flex",
						gap: "1rem",
						flexDirection: "column",
						padding: "0.5rem",
					}}
				>
					{legendItems.map((item) => (
						<div key={item.label} style={{ display: "flex", alignItems: "center" }}>
							<div
								style={{
									width: 16,
									height: 16,
									backgroundColor: item.color,
									marginRight: 8,
									borderRadius: 4,
									border: "1px solid #333",
								}}
							/>
							<span style={{ fontSize: "0.9rem" }}>{item.label}</span>
						</div>
					))}
				</div>
			</InfoWindow>
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

					<InfoWindow top={250} left={20}>
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
					<InfoWindow top={350} width={400}>
						{(selected.parent || selected.male) && (
							<>
								<p>Parents</p>
								<div
									style={{
										display: "flex",
										flexDirection: "row",
										gap: "1rem",
									}}
								>
									{selected.parent && (
										<button
											style={{
												...buttonStyle,
												background:
													"linear-gradient(135deg,rgb(214, 65, 219) 0%,rgb(236, 164, 233)100%)",
											}}
											onMouseOver={(e) => {
												e.currentTarget.style.transform = "scale(1.1)";
											}}
											onMouseOut={(e) => {
												e.currentTarget.style.transform = "scale(1)";
											}}
											onClick={async () => {
												NodeHelper.selectedNode(
													dataMap.get(selected.parent!)!
												);
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
									)}
									{selected.male && (
										<button
											style={{
												...buttonStyle,
												background:
													"linear-gradient(135deg,rgb(46, 12, 172) 0%,rgb(4, 194, 241) 100%)",
											}}
											onMouseOver={(e) => {
												e.currentTarget.style.transform = "scale(1.1)";
											}}
											onMouseOut={(e) => {
												e.currentTarget.style.transform = "scale(1)";
											}}
											onClick={async () => {
												NodeHelper.selectedNode(
													dataMap.get(selected.male!)!
												);
												await wait(200); // wait 1s
												window.dispatchEvent(
													new KeyboardEvent("keydown", {
														key: "f",
														bubbles: true,
													})
												);
											}}
										>
											{dataMap.get(selected.male)!.genotype ?? "Unselect"}
										</button>
									)}
								</div>
							</>
						)}
						<div
							style={{
								display: "flex",
								flexDirection: "row",
								gap: "1rem",
							}}
						>
							{selected.childrenF.length > 0 && (
								<div
									style={{
										display: "flex",
										flexDirection: "column",
										gap: "1rem",
									}}
								>
									<p>Children (Female)</p>
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
										{selected.childrenF.map((child) => (
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
								</div>
							)}
							{selected.childrenM.length > 0 && (
								<div
									style={{
										display: "flex",
										flexDirection: "column",
										gap: "1rem",
									}}
								>
									<p>Children (Male)</p>
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
										{selected.childrenM.map((child) => (
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
								</div>
							)}
						</div>
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
	const [filtered] = useAtom(filteredDataAtom);

	const onSearch = useCallback(() => {
		const a = store.get(filteredDataAtom);
		if (a.length > 0) {
			NodeHelper.selectedNode(a[0]);
			wait(200).then(() => {
				window.dispatchEvent(
					new KeyboardEvent("keydown", {
						key: "f",
						bubbles: true,
					})
				);
			});
		}
	}, [filteredDataAtom]);

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
						style={buttonStyle}
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

export default App;
