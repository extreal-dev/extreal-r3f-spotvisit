import * as THREE from "three";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import { VRM, VRMHumanBoneName } from "@pixiv/three-vrm";
import { mixamoVRMRigMap } from "./mixamoVRMRigMap";

/**
 * Load a Mixamo animation, convert it for use with three-vrm, and return the converted animation.
 *
 * @param url - URL of the Mixamo animation data.
 * @param vrm - Target VRM instance.
 * @param applyRootMotion - Whether to apply root motion. Default is true.
 * @returns A promise containing the converted AnimationClip.
 */
export const loadMixamoAnimation = async (
    url: string,
    vrm: VRM,
    applyRootMotion: boolean = true
): Promise<THREE.AnimationClip> => {
    const loader = new FBXLoader();
    const asset = await loader.loadAsync(url);
    return convertAssetToVrmAnimation(asset, vrm, applyRootMotion);
};

/**
 * Prepare variables required for the animation conversion process.
 *
 * @param asset - Asset containing the animation data.
 * @param vrm - Target VRM instance.
 * @returns Object containing variables for conversion.
 */
const prepareVariablesForConversion = (asset: THREE.Group, vrm: VRM) => {
    const restRotationInverse = new THREE.Quaternion();
    const parentRestWorldRotation = new THREE.Quaternion();
    const quatBuffer = new THREE.Quaternion();

    const motionHipsNode = asset.getObjectByName("mixamorigHips");
    const vrmHipsNode = vrm.humanoid?.getNormalizedBoneNode("hips");

    if (!motionHipsNode || !vrmHipsNode) throw new Error("Cannot retrieve nodes for motion or VRM hips.");

    const motionHipsHeight = motionHipsNode.position.y;
    const vrmHipsY = vrmHipsNode.getWorldPosition(new THREE.Vector3()).y;
    const vrmRootY = vrm.scene.getWorldPosition(new THREE.Vector3()).y;
    const vrmHipsHeight = Math.abs(vrmHipsY - vrmRootY);
    const hipsPositionScale = vrmHipsHeight / motionHipsHeight;

    return { restRotationInverse, parentRestWorldRotation, quatBuffer, hipsPositionScale };
};

/**
 * Convert the given asset's animation to a VRM compatible animation.
 *
 * @param asset - Asset containing the animation data.
 * @param vrm - Target VRM instance.
 * @param applyRootMotion - Whether to apply root motion. Default is true.
 * @returns A promise containing the converted AnimationClip.
 */
const convertAssetToVrmAnimation = async (
    asset: THREE.Group,
    vrm: VRM,
    applyRootMotion: boolean = true
): Promise<THREE.AnimationClip> => {
    const clip = THREE.AnimationClip.findByName(asset.animations, "mixamo.com");
    const tracks: THREE.KeyframeTrack[] = [];

    const { restRotationInverse, parentRestWorldRotation, quatBuffer, hipsPositionScale } =
        prepareVariablesForConversion(asset, vrm);

    for (const track of clip.tracks) {
        const [mixamoRigName, propertyName] = track.name.split(".");
        const vrmBoneName = mixamoVRMRigMap[mixamoRigName] as VRMHumanBoneName;
        const vrmNode = vrm.humanoid?.getNormalizedBoneNode(vrmBoneName);
        if (!vrmNode) continue;

        const vrmNodeName = vrmNode.name;
        const mixamoRigNode = asset.getObjectByName(mixamoRigName);
        if (!mixamoRigNode || !mixamoRigNode.parent) continue;

        mixamoRigNode.getWorldQuaternion(restRotationInverse).invert();
        mixamoRigNode.parent.getWorldQuaternion(parentRestWorldRotation);

        if (track instanceof THREE.QuaternionKeyframeTrack) {
            adjustQuaternions(track, quatBuffer, parentRestWorldRotation, restRotationInverse);
            tracks.push(createQuaternionKeyframeTrack(track, vrmNodeName, propertyName, vrm.meta?.metaVersion));
        } else if (track instanceof THREE.VectorKeyframeTrack && !(propertyName === "position" && !applyRootMotion)) {
            tracks.push(
                createVectorKeyframeTrack(track, vrmNodeName, propertyName, hipsPositionScale, vrm.meta?.metaVersion)
            );
        }
    }

    return Promise.resolve(new THREE.AnimationClip("vrmAnimation", clip.duration, tracks));
};

/**
 * Adjust quaternions using the provided rotations.
 *
 * @param track - Quaternion track to adjust.
 * @param _quatA - Buffer quaternion for calculations.
 * @param parentRestWorldRotation - Parent's rest world rotation.
 * @param restRotationInverse - Inverse of rest rotation.
 */
const adjustQuaternions = (
    track: THREE.QuaternionKeyframeTrack,
    _quatA: THREE.Quaternion,
    parentRestWorldRotation: THREE.Quaternion,
    restRotationInverse: THREE.Quaternion
) => {
    for (let i = 0; i < track.values.length; i += 4) {
        const flatQuaternion = track.values.slice(i, i + 4);
        _quatA.fromArray(flatQuaternion).premultiply(parentRestWorldRotation).multiply(restRotationInverse);
        _quatA.toArray(flatQuaternion);

        flatQuaternion.forEach((v, index) => {
            track.values[index + i] = v;
        });
    }
};

/**
 * Create and return a new quaternion keyframe track.
 *
 * @param track - Original quaternion track.
 * @param nodeName - Target node name.
 * @param propertyName - Property name to animate.
 * @param metaVersion - VRM metadata version.
 * @returns A new QuaternionKeyframeTrack.
 */
const createQuaternionKeyframeTrack = (
    track: THREE.QuaternionKeyframeTrack,
    nodeName: string,
    propertyName: string,
    metaVersion?: string
) => {
    const values = track.values.map((v, i) => (metaVersion === "0" && i % 2 === 0 ? -v : v));
    return new THREE.QuaternionKeyframeTrack(`${nodeName}.${propertyName}`, track.times, values);
};

/**
 * Create and return a new vector keyframe track with the given adjustments.
 *
 * @param track - Original vector keyframe track.
 * @param nodeName - Target node name.
 * @param propertyName - Property name to animate.
 * @param scale - Scaling factor for vector values.
 * @param metaVersion - VRM metadata version.
 * @returns A new VectorKeyframeTrack.
 */
const createVectorKeyframeTrack = (
    track: THREE.VectorKeyframeTrack,
    nodeName: string,
    propertyName: string,
    scale: number,
    metaVersion?: string
) => {
    const values = track.values.map((v, i) => (metaVersion === "0" && i % 3 !== 1 ? -v : v) * scale);
    return new THREE.VectorKeyframeTrack(`${nodeName}.${propertyName}`, track.times, values);
};
