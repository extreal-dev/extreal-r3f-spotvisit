import { useFrame, useThree } from "@react-three/fiber";
import { useState } from "react";
import * as THREE from "three";
import { GLTF } from "three/addons/loaders/GLTFLoader.js";
import { CharacterController } from "./usePlayerInput";

const useUpdateTransform = (
  gltf: GLTF | null,
  controller: CharacterController | undefined,
) => {
  const { camera } = useThree();
  const [previousPosition, setPreviousPosition] = useState(new THREE.Vector3());

  // For intuitive control, directions of Avatar movements are based on rotation of the camera.
  // e.g. If user inputs left, Avatar moves to the left of the camera.
  const updateTransform = (delta: number) => {
    if (!gltf) return;
    if (!controller) return;

    const walkSpeed = 4.0;
    const runMultiplier = 2.0;
    const vrm = gltf.scene;

    const moveSpeed = controller.running
      ? walkSpeed * runMultiplier
      : walkSpeed;

    // Camera's direction to the left
    const cameraLeftDirection = camera
      .getWorldDirection(new THREE.Vector3())
      .cross(camera.up)
      .normalize();

    const moveVector = new THREE.Vector3();

    if (controller.left || controller.right) {
      moveVector.addScaledVector(
        cameraLeftDirection,
        moveSpeed * (controller.left ? -1 : 1) * delta,
      );
    }

    // Calculate the movement vector for forward/backward movement
    if (controller.forward || controller.backward) {
      // Move forward or backward relative to the camera at a constant speed regardless of FPS
      moveVector.addScaledVector(
        // Camera's forward direction
        cameraLeftDirection.cross(camera.up),
        moveSpeed * (controller.forward ? -1 : 1) * delta,
      );
    }

    if (controller.jump) {
      vrm.position.y += 0.07;
      controller.inAirCount -= 1;
      if (controller.inAirCount === 15) {
        controller.jump = false;
      }
    } else {
      if (vrm.position.y > 0) {
        vrm.position.y -= 0.07;
      }
      if (controller.inAirCount > 0) {
        controller.inAirCount -= 1;
      }
    }

    // Save the character's position before updating
    const currentPosition = vrm.position.clone();
    vrm.position.add(moveVector);

    // Calculate the character's rotation due to movement
    // The direction of movement based on the position in the previous frame and the current frame
    if (
      previousPosition.x !== currentPosition.x ||
      previousPosition.z !== currentPosition.z
    ) {
      const direction = currentPosition
        .clone()
        .sub(previousPosition)
        .normalize();
      // Add Math.PI to reverse the direction to handle with VRM v1.0
      const angle = Math.atan2(direction.x, direction.z) + Math.PI;
      vrm.rotation.y = angle;
      // Set current position as the previous position
      setPreviousPosition(currentPosition);
    }
  };

  useFrame((_, delta) => {
    updateTransform(delta);
  });
};

export default useUpdateTransform;
