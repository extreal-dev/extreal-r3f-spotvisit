import { useEffect, useState } from "react";
import * as THREE from "three";

export interface CharacterController {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  running: boolean;
  jump: boolean;
  inAirCount: number;
  cameraPosition: THREE.Vector3;
}

const usePlayerInput = () => {
  const [movement, setMovement] = useState<CharacterController>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    running: false,
    jump: false,
    inAirCount: 0,
    cameraPosition: new THREE.Vector3(),
  } as CharacterController);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (
      [" ", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(
        event.key,
      ) &&
      event.target == document.body
    ) {
      event.preventDefault();
    }
    setMovement((currentMovement) => {
      const nextMovement = { ...currentMovement };
      if (["w", "W", "ArrowUp"].includes(event.key)) {
        nextMovement.forward = true;
      }
      if (["s", "S", "ArrowDown"].includes(event.key)) {
        nextMovement.backward = true;
      }
      if (["a", "A", "ArrowLeft"].includes(event.key)) {
        nextMovement.left = true;
      }
      if (["d", "D", "ArrowRight"].includes(event.key)) {
        nextMovement.right = true;
      }
      if (["Shift"].includes(event.key)) {
        nextMovement.running =
          nextMovement.forward ||
          nextMovement.backward ||
          nextMovement.left ||
          nextMovement.right;
      }
      if ([" "].includes(event.key) && currentMovement.inAirCount <= 0) {
        nextMovement.jump = true;
        nextMovement.inAirCount = 30;
      }
      return nextMovement;
    });
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    setMovement((currentMovement) => {
      const nextMovement = { ...currentMovement };

      if (["w", "W", "ArrowUp"].includes(event.key)) {
        nextMovement.forward = false;
      }
      if (["s", "S", "ArrowDown"].includes(event.key)) {
        nextMovement.backward = false;
      }
      if (["a", "A", "ArrowLeft"].includes(event.key)) {
        nextMovement.left = false;
      }
      if (["d", "D", "ArrowRight"].includes(event.key)) {
        nextMovement.right = false;
      }
      if (["Shift"].includes(event.key)) {
        nextMovement.running = false;
      }
      return nextMovement;
    });
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return { movement, setMovement };
};

export default usePlayerInput;
