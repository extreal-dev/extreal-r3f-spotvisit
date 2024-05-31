import { VRMLoaderPlugin, VRMUtils } from "@pixiv/three-vrm";
import { useEffect, useState } from "react";
import {
  GLTF,
  GLTFLoader,
  GLTFParser,
} from "three/addons/loaders/GLTFLoader.js";

/**
 * Properties interface for the `useLoadVRM` hook.
 */
interface UseLoadVRMProps {
  /** Path to the avatar's VRM file to be loaded. */
  avatarPath: string;
}

/**
 * Custom hook to load VRM models using `three` and `@pixiv/three-vrm`.
 *
 * @param props Properties containing the path to the VRM file.
 * @returns An object containing the loaded glTF model, progress percentage, and any potential error.
 */
function useLoadVRM(props: UseLoadVRMProps) {
  const [progress, setProgress] = useState<number>(0);
  const [gltf, setGLTF] = useState<GLTF | null>(null);
  const [error, setError] = useState<ErrorEvent | null>(null);

  useEffect(() => {
    const loader = new GLTFLoader();
    loader.crossOrigin = "anonymous";
    loader.register((parser: GLTFParser) => {
      return new VRMLoaderPlugin(parser, {
        autoUpdateHumanBones: true,
      });
    });
    loader.load(
      props.avatarPath,
      (loadedGltf: GLTF) => {
        console.log("Avatar loaded:%o", loadedGltf);
        setGLTF(loadedGltf);
      },
      (xhr) => {
        const calculatedProgress = ((xhr.loaded / xhr.total) * 100).toFixed(2);
        setProgress(parseFloat(calculatedProgress));
      },
      (error) => {
        const errorEvent = error as ErrorEvent;
        console.error(errorEvent.message);
        setError(errorEvent);
      },
    );
    return () => {
      if (!gltf) return;
      const vrm = gltf.userData.vrm;
      VRMUtils.deepDispose(vrm.scene);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.avatarPath]);

  return {
    gltf,
    progress,
    error,
  };
}

export default useLoadVRM;
