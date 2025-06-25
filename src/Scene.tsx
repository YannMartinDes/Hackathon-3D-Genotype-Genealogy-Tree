import { useState } from "react";
import { Vector3 } from "three";
import { Box } from "./Box";
import { CameraControl } from "./CameraControl";

export function Scene() {
  const [selectedBox, setSelectedBox] = useState<number | null>(null);
  const boxes = [
    [0, 0, 0],
    [3, 0, 0],
    [-3, 0, 0],
  ] as [number, number, number][];

  const target = selectedBox !== null ? new Vector3(...boxes[selectedBox]) : null;

  return (
    <>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      {boxes.map((pos, i) => (
        <Box
          key={i}
          position={pos}
          selected={selectedBox === i}
          onSelect={() => setSelectedBox(i)}
        />
      ))}
      <CameraControl target={target} />
    </>
  );
}