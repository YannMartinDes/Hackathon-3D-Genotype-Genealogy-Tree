import { InfoWindow } from "./InfoWindow";

const legendItems = [
	{ label: "Children (Female)", color: "purple" },
	{ label: "Children (Male)", color: "darkgreen" },
	{ label: "Parent (Female)", color: "#FF007F" },
	{ label: "Parent (Male)", color: "blue" },
];

export default function Legend() {
	return (
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
	);
}
