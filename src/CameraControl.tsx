import { OrbitControls } from "@react-three/drei";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "react-three-fiber";
import { MOUSE, Vector3 } from "three";

export function CameraControl({ target }: { target: Vector3 | null }) {
	const controls = useRef<any>(null);
	const { camera } = useThree();
	const [focusPressed, setFocusPressed] = useState(false);

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
			if (e.key === "f") setFocusPressed(true);
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
	}, []);

	useCallback(() => {}, []);

	useEffect(() => {
		if (target && controls.current) {
			// Smoothly interpolate the target position
			controls.current.target.copy(target);
			camera.lookAt(target);

			const direction = target.clone().sub(camera.position).normalize();

			// Move the camera back along this direction (zoom out)
			const distance = 10; // Adjust this to control how far the camera pulls back
			const newPos = target.clone().add(direction.multiplyScalar(-distance));

			camera.position.copy(newPos);
			controls.current.update();
		}
	}, [focusPressed]);

	useFrame(() => {});

	return <OrbitControls ref={controls} />;
}
