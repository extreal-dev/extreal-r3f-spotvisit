import { useTexture } from "@react-three/drei";
import React from "react";
import * as THREE from "three";

export type ImageSphereProps = {
  imageSourceUrl: string;
};

const ImageSphere: React.FC<ImageSphereProps> = (props: ImageSphereProps) => {
  const imageTexture = useTexture(props.imageSourceUrl);
  return (
    <>
      {imageTexture && (
        <mesh scale={[100, 100, 100]}>
          <sphereGeometry />
          <meshBasicMaterial side={THREE.BackSide} map={imageTexture} />
        </mesh>
      )}
    </>
  );
};

export default ImageSphere;
