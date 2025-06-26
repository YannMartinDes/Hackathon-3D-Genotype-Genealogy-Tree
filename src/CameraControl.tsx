/* eslint-disable @typescript-eslint/no-explicit-any */
import { OrbitControls } from "@react-three/drei";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "react-three-fiber";
import { MOUSE, Vector3 } from "three";
import { useAtomValue } from "jotai";
import { currentNodeAtom } from "./Atom";

function easeInOutCubic(t: number) {
	return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
export function CameraControl() {
	const controls = useRef<any>(null);
	const { camera } = useThree();
	const [focusPressed, setFocusPressed] = useState(false);
	const focusProgress = useRef(1);
	const selected = useAtomValue(currentNodeAtom);
	const startPosition = useRef(new Vector3());
	const startTarget = useRef(new Vector3());
	const targetPosition = useRef(new Vector3());
	const targetTarget = useRef(new Vector3());

	useEffect(() => {
		if (controls.current) {
			// Set custom mouse button controls
			controls.current.mouseButtons = {
				LEFT: MOUSE.PAN,
				MIDDLE: MOUSE.PAN,
				RIGHT: MOUSE.DOLLY,
			};
		}
	}, []);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "f" && selected?.ref && controls.current) {
				setFocusPressed(true);
				setFocusProgress(0);

				// Save start position/target
				startPosition.current.copy(camera.position);
				startTarget.current.copy(controls.current.target);

				// Compute new focus position/target
				const target = selected.ref.position.clone();
				const direction = target.clone().sub(camera.position).normalize();
				const distance = 20;

				targetTarget.current.copy(target);
				targetPosition.current.copy(
					target.clone().add(direction.multiplyScalar(-distance))
				);
			}
		};

		const handleKeyUp = (e: KeyboardEvent) => {
			if (e.key === "f") setFocusPressed(false);
		};

		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
		};
	}, [camera, controls, selected]);

	// Smooth animation per frame
	useFrame((_, delta) => {
		if (focusProgress.current < 1) {
			const next = Math.min(focusProgress.current + delta * 2, 1); // duration control
			const t = easeInOutCubic(next);

			// Interpolate camera position and controls target
			camera.position.lerpVectors(startPosition.current, targetPosition.current, t);
			controls.current.target.lerpVectors(startTarget.current, targetTarget.current, t);

			controls.current.update();
			focusProgress.current = next;
		}
		console.log(focusProgress.current);
	});

	return <OrbitControls ref={controls} />;
}
