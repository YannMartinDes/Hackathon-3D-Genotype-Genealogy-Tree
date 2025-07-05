import { useAtomValue } from "jotai";
import { ChildrenList } from "./ChildrenList";
import { InfoWindow } from "./InfoWindow";
import { ParentButtons } from "./ParentButtons";
import { currentNodeAtom } from "../jotai/atom";

export function GenealogyInfo() {
	const selected = useAtomValue(currentNodeAtom);

	if (!selected) {
		return <></>;
	}
	return (
		<InfoWindow top={400} width={400}>
			<ParentButtons selected={selected} />
			<div style={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
				<ChildrenList title="Children (Female)" childrenList={selected.childrenF} />
				<ChildrenList title="Children (Male)" childrenList={selected.childrenM} />
			</div>
		</InfoWindow>
	);
}
