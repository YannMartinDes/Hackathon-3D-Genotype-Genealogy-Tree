export function InfoWindow({
	children,
	top,
	right,
	left,
	width,
}: {
	children: React.ReactNode;
	top?: number;
	right?: number;
	left?: number;
	width?: number;
}) {
	return (
		<div
			style={{
				position: "fixed",
				top: top ?? 20,
				right: right ?? 20,
				left: left ?? "auto",
				width: width ?? "fit-content",
				padding: 20,
				backgroundColor: "rgba(0,0,0,0.7)",
				color: "white",
				borderRadius: 8,
				fontFamily: "sans-serif",
				zIndex: 1000,
				boxShadow: "0 0 10px rgba(0,0,0,0.5)",
				userSelect: "none",
			}}
		>
			{children}
		</div>
	);
}
