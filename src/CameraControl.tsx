/* eslint-disable @typescript-eslint/no-explicit-any */
import { OrbitControls } from "@react-three/drei";
import { useAtomValue } from "jotai";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "react-three-fiber";
import { Box3, MOUSE, PerspectiveCamera, Vector3 } from "three";
import { currentNodeAtom } from "./atom";
import { DataWithDisplay, type INode } from "./data";

function easeInOutCubic(t: number) {
	return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function getAllChildren(node: INode): INode[] {
	const nodes = node.children.map((a) => getAllChildren(a)).flat();
	return [node, ...nodes];
}

function getAllPArent(node: INode): INode[] {
	if (!node.parentNode) return [];
	const nodes = getAllPArent(node.parentNode);
	return [node, ...nodes];
}

export const KEY_FOCUS = "7";

export function CameraControl() {
	const controls = useRef<any>(null);
	const { camera }: { camera: PerspectiveCamera } = useThree();
	const [, setFocusPressed] = useState(false);
	const selected = useAtomValue(currentNodeAtom);

	const focusProgress = useRef(1);
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

	const focus = useCallback(
		(nodes: INode[]) => {
			setFocusPressed(true);
			if (nodes.length === 0) return;
			focusProgress.current = 0;
			const box = new Box3();
			startPosition.current.copy(camera.position);
			startTarget.current.copy(controls.current.target);
			nodes.forEach((n) => box.expandByPoint(n.position));
			const center = new Vector3();
			box.getCenter(center);
			const size = new Vector3();
			box.getSize(size);
			const maxDim = Math.max(size.x, size.y, size.z);
			// Determine the distance needed to fit the bounding box in view
			const fov = camera.fov * (Math.PI / 180);
			const fitHeightDistance = maxDim / (2 * Math.tan(fov / 2));
			const fitWidthDistance = fitHeightDistance / camera.aspect;
			const distance = 2 * Math.max(fitHeightDistance, fitWidthDistance); // Add margin

			// Direction from camera to center
			const direction = new Vector3()
				.subVectors(camera.position, controls.current.target)
				.normalize();

			targetTarget.current.copy(center);
			targetPosition.current.copy(center.clone().add(direction.multiplyScalar(distance)));
		},
		[focusProgress.current, targetTarget.current, targetPosition.current]
	);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === KEY_FOCUS && selected && controls.current) {
				setFocusPressed(true);
				focusProgress.current = 0;

				// Save start position/target
				startPosition.current.copy(camera.position);
				startTarget.current.copy(controls.current.target);

				// Compute new focus position/target
				const target = selected.position.clone();
				const direction = target.clone().sub(camera.position).normalize();
				const distance = 20;

				targetTarget.current.copy(target);
				targetPosition.current.copy(
					target.clone().add(direction.multiplyScalar(-distance))
				);
			} else if (e.key === "8" && controls.current) {
				focus(DataWithDisplay);
			} else if (e.key === "9" && selected && controls.current) {
				focus([...getAllChildren(selected), ...getAllPArent(selected)]);
			}
		};

		const handleKeyUp = (e: KeyboardEvent) => {
			if (e.key === KEY_FOCUS) setFocusPressed(false);
		};

		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
		};
	}, [camera, controls, selected, focus]);

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
	});

	return <OrbitControls ref={controls} />;
}
