import { loadMixamoAnimation } from "@/hooks/loadMixamoAnimation";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { AnimationClip } from "three";
import { GLTF } from "three/addons/loaders/GLTFLoader.js";

/**
 * VRMAnimationProps interface for useVRMAnimation.
 */
export interface VRMAnimationProps {
  gltf: GLTF | null;
  avatarRef: React.MutableRefObject<THREE.Group | null>;
  animationMap?: { [name: string]: string };
}

export interface MotionMap {
  [key: string]: AnimationClip;
}

/**
 * Load animations for a given GLTF model and animation map.
 * @param gltf - The GLTF model.
 * @param animationMap - Map of animation names to URLs.
 * @returns A map of animation clips.
 */
export const loadAnimations = async (
  gltf: GLTF,
  animationMap: { [name: string]: string },
): Promise<MotionMap> => {
  const vrm = gltf.userData.vrm;
  const clips: MotionMap = {};

  for (const key in animationMap) {
    const clip = await loadMixamoAnimation(animationMap[key], vrm, false);
    if (clip) {
      clip.name = key;
      clips[key] = clip;
      // Add the animation clip to the GLTF model's animations
      gltf.animations.push(clip);
      console.log(`Loaded ${key} animation`);
    } else {
      console.error(`Failed to load ${key} animation`);
    }
  }

  return clips;
};

/**
 * Transition between two animations with a crossfade.
 * @param mixer - The THREE.AnimationMixer to play animations on.
 * @param animations - List of animations available.
 * @param currentMotion - The name of the currently playing animation.
 * @param nextMotion - The name of the next animation to play.
 */
export const transitAnimation = (
  mixer: THREE.AnimationMixer,
  animations: AnimationClip[],
  currentMotion: string,
  nextMotion: string,
) => {
  if (!mixer || animations.length === 0) return;
  const crossFadeTime = 0.2;

  const currentClip = animations.find((clip) => clip.name === currentMotion);
  const nextClip = animations.find((clip) => clip.name === nextMotion);
  if (!currentClip || !nextClip) return;
  const currentAction = mixer.clipAction(currentClip);
  const nextAction = mixer.clipAction(nextClip);

  if (currentAction && nextAction) {
    nextAction.enabled = true;
    nextAction.play();
    currentAction.reset().play();
    currentAction.crossFadeTo(nextAction, crossFadeTime, true);
  }
};

/**
 * Custom hook to handle VRM animations.
 * @param props - The properties for the hook.
 * @returns A function to set the current animation.
 */
export const useVRMAnimation = (props: VRMAnimationProps) => {
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const { gltf, avatarRef } = props;
  const [animationGltf, setAnimationGltf] = useState<GLTF | null>(null);

  const [currentAnimation, setCurrentAnimation] = useState<string>("Idle");
  const prevAnimationRef = useRef<string>("Idle");

  // Load animations when gltf or animationMap changes.
  useEffect(() => {
    if (!gltf || !props.animationMap) return;
    loadAnimations(gltf, props.animationMap).then((loadedAnimations) => {
      setAnimationGltf({
        ...gltf,
        animations: Object.values(loadedAnimations),
      });
    });
  }, [gltf, props.animationMap]);

  // Setup animation mixer and crossfade animations when animationGltf changes.
  useEffect(() => {
    if (
      !avatarRef.current ||
      !animationGltf ||
      !prevAnimationRef.current ||
      !currentAnimation ||
      animationGltf.animations.length <= 0
    )
      return;

    mixerRef.current = new THREE.AnimationMixer(avatarRef.current);
    transitAnimation(
      mixerRef.current,
      animationGltf.animations,
      prevAnimationRef.current,
      currentAnimation,
    );

    return () => {
      if (!mixerRef.current) return;
      mixerRef.current.stopAllAction();
    };
  }, [animationGltf, avatarRef, currentAnimation]);

  // Update animation mixer and VRM on every frame.
  useFrame((_, delta) => {
    if (!mixerRef.current || !animationGltf) return;

    // Transition animations using crossfade if the current animation changes.
    if (currentAnimation !== prevAnimationRef.current) {
      transitAnimation(
        mixerRef.current,
        animationGltf.animations,
        prevAnimationRef.current,
        currentAnimation,
      );
      prevAnimationRef.current = currentAnimation;
    }

    mixerRef.current.update(delta);
    const vrm = animationGltf.userData.vrm;
    vrm.update(delta);
  });

  return setCurrentAnimation;
};

export default useVRMAnimation;
