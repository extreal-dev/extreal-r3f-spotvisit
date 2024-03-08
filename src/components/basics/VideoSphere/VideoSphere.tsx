import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export type VideoSphereProps = {
  videoId?: string;
  radius?: number;
};

const VideoSphere = (props: VideoSphereProps) => {
  const videoId = props.videoId || "video";
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoTexture, setVideoTexture] = useState<THREE.VideoTexture | null>(
    null,
  );

  useEffect(() => {
    const videoElements = document.getElementById(videoId) as HTMLVideoElement;
    videoRef.current = videoElements;

    if (videoRef.current) {
      const texture = new THREE.VideoTexture(videoRef.current);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;

      setVideoTexture(texture);
    }
  }, [props.radius]);

  return (
    <>
      {videoTexture && (
        <mesh
          visible
          position={[0, 0, 0]}
          rotation={[0, 0, 0]}
          scale={[-1, 1, 1]}
        >
          <sphereGeometry
            attach="geometry"
            args={[props.radius || 500, 60, 40]}
          />
          <meshBasicMaterial
            toneMapped={false}
            attach="material"
            color="white"
            side={THREE.BackSide}
            map={videoTexture}
            transparent
          />
        </mesh>
      )}
    </>
  );
};

export default VideoSphere;
