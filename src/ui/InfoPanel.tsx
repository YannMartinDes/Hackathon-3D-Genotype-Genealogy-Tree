import { InfoWindow } from "./InfoWindow";
import { useAtomValue } from "jotai";
import { currentNodeAtom } from "../jotai/atom";

export default function InfoPanel() {
	const selected = useAtomValue(currentNodeAtom);

	if (!selected) {
		return <></>;
	}
	return (
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
	);
}
