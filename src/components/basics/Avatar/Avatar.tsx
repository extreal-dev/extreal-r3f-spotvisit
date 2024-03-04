import { CharacterController } from "@/hooks/usePlayerInput";
import useUpdateMotion from "@/hooks/useUpdateMotion";
import useUpdateTransform from "@/hooks/useUpdateTransform";
import useLoadVRM from "@/hooks/useVRM";
import useVRMAnimation from "@/hooks/useVRMAnimation";
import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  Dispatch,
  SetStateAction,
  Suspense,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import * as THREE from "three";

/**
 * Avatar properties interface.
 */
export interface AvatarProps {
  /** Path to the avatar's VRM file. */
  avatarPath: string;
  /** Mapping between animation names and their respective paths. */
  animationMap?: { [name: string]: string };
  /** Name of the currently active animation. */
  currentMotion?: string;
  controller?: CharacterController;
  onLoad?: () => void;
  remotePosition?: THREE.Vector3;
  remoteRotation?: THREE.Euler;
}

export type AvatarHandle = {
  getGltf: () => THREE.Group | undefined;
  getAvatar: () => THREE.Object3D | undefined;
  getPosition: () => THREE.Vector3 | undefined;
  getRotation: () => THREE.Euler | undefined;
  getCurrentMotion: () => string;
  getController: () => CharacterController;
  setMotion: Dispatch<SetStateAction<string>>;
  setPosition: (val: THREE.Vector3) => void;
};

/**
 * `Avatar` component for displaying VRM avatars with optional animations.
 *
 * @/param props Properties for the Avatar component.
 * @/returns Rendered Avatar component.
 */
export const Avatar = forwardRef((props: AvatarProps, ref) => {
  const { gltf, progress, error } = useLoadVRM({
    avatarPath: props.avatarPath,
  });
  const avatarRef = useRef<THREE.Group | null>(null);

  const setAnimation = useVRMAnimation({
    gltf,
    avatarRef,
    animationMap: props.animationMap,
  });
  useEffect(() => {
    if (!gltf) return;
    if (props.animationMap && setAnimation && props.currentMotion) {
      setAnimation(props.currentMotion);
    }
  }, [gltf, setAnimation, props.animationMap, props.currentMotion]);

  useImperativeHandle(ref, () => ({
    getGltf: () => gltf,
    getAvatar: () => gltf?.scene,
    getPosition: () => gltf?.scene.position,
    getRotation: () => gltf?.scene.rotation,
    getCurrentMotion: () => props.currentMotion,
    getController: () => props.controller,
    setMotion: setAnimation,
    setPosition: setPosition,
  }));

  const isLoaded = useRef(false);
  const onLoad = props.onLoad;
  useEffect(() => {
    if (!gltf) return;
    if (!isLoaded.current) {
      if (onLoad) {
        onLoad();
      }
      if (gltf.scene) {
        if (props.remotePosition) {
          gltf.scene.position.copy(props.remotePosition);
        }
        if (props.remoteRotation)
          gltf.scene.rotation.copy(props.remoteRotation);
      }
      isLoaded.current = true;
    }
  }, [gltf, onLoad]);

  const setPosition = (pos: THREE.Vector3) => {
    gltf?.scene.position.copy(pos);
  };

  useUpdateTransform(gltf, props.controller);
  useUpdateMotion(gltf, setAnimation, props.controller);

  const [prevRemotePosition, setPrevRemotePosition] =
    useState<THREE.Vector3 | null>(null);
  const [prevRemoteRotation, setPrevRemoteRotation] =
    useState<THREE.Euler | null>(null);

  useFrame(() => {
    if (!gltf) {
      return;
    }
    const lerpFactor = 0.1;
    if (props.remotePosition && props.remotePosition !== prevRemotePosition) {
      const vrm = gltf.scene;
      vrm.position.lerp(props.remotePosition, lerpFactor);
      setPrevRemotePosition(props.remotePosition);
    }
    if (props.remoteRotation && props.remoteRotation !== prevRemoteRotation) {
      const vrm = gltf.scene;
      vrm.rotation.copy(props.remoteRotation);
      setPrevRemoteRotation(props.remoteRotation);
    }
  });

  return (
    <>
      <Suspense fallback={null}>
        {error ? (
          <Html center>
            <span style={{ color: "red" }}>Error: {error.message}</span>
          </Html>
        ) : gltf ? (
          <group ref={avatarRef}>
            <primitive object={gltf.scene} />
          </group>
        ) : (
          <Html center>
            <span style={{ color: "white" }}>Loading: {progress}</span>
          </Html>
        )}
      </Suspense>
    </>
  );
});

Avatar.displayName = "Avatar";
