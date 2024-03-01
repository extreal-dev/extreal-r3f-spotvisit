import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { GLTF } from "three/addons/loaders/GLTFLoader.js";
import { CharacterController } from "./usePlayerInput";

const useUpdateTransform = (
  gltf: GLTF | null,
  controller: CharacterController | undefined,
) => {
  const updateTransform = (delta: number) => {
    if (!gltf) return;
    if (!controller) return;

    const walkSpeed = 3.0;
    const runMultiplier = 2.0;
    const rotationSpeed = 3.0;

    const vrm = gltf.scene;
    const forwardDirection = new THREE.Vector3(
      -Math.sin(vrm.rotation.y),
      0,
      -Math.cos(vrm.rotation.y),
    );
    const moveSpeed = controller.running
      ? walkSpeed * runMultiplier
      : walkSpeed;

    const moveVector = new THREE.Vector3();
    let rotateAngle = 0.0;
    if (controller.forward || controller.backward) {
      moveVector.addScaledVector(
        forwardDirection,
        moveSpeed * (controller.forward ? -1 : 1) * delta,
      );
    }
    if (controller.left || controller.right) {
      rotateAngle += rotationSpeed * (controller.left ? 1 : -1) * delta;
    }
    if (controller.jump) {
      vrm.position.y += 0.07;
      controller.inAirCount -= 1;
      if (controller.inAirCount === 15) {
        controller.jump = false;
      }
    } else {
      vrm.rotation.x = 0;
      if (vrm.position.y > 0) {
        vrm.position.y -= 0.07;
        controller.inAirCount -= 1;
      }
    }
    vrm.position.add(moveVector);
    vrm.rotation.y += rotateAngle;
  };

  useFrame((_, delta) => {
    updateTransform(delta);
  });
};

export default useUpdateTransform;
