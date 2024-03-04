import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { CharacterController } from "./usePlayerInput";

const useUpdateMotion = (
  gltf: GLTF | null,
  setAnimation: (motion: string) => void,
  controller?: CharacterController,
) => {
  const currentAnimation = useRef("");

  const updateMotion = (control: CharacterController) => {
    if (!gltf) return;
    if (!setAnimation) return;
    if (!control) return;

    let nextMotion = "Idle";
    if (control.jump || gltf.scene.position.y > 0) {
      nextMotion = "Jump";
    } else if (control.running) {
      nextMotion = "Running";
    } else if (control.forward || control.backward) {
      nextMotion = "Walking";
    }
    if (currentAnimation.current !== nextMotion) {
      setAnimation(nextMotion);
      currentAnimation.current = nextMotion;
    }
  };

  useFrame(() => {
    if (!controller) return;
    updateMotion(controller);
  });
};

export default useUpdateMotion;
