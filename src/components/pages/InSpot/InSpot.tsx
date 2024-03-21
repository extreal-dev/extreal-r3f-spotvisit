import { AvatarHandle } from "@/components/basics/Avatar/Avatar";
import useAvatarSelectStore from "@/components/basics/AvatarSelect/useAvatarSelectStore";
import ImageSphere from "@/components/basics/ImageSphere/ImageSphare";
import Player from "@/components/basics/Player/Player";
import RemotePlayerGroup from "@/components/basics/RemotePlayerGroup/RemotePlayerGroup";
import { HiddenVideo } from "@/components/basics/VideoSphere/HiddenVideo";
import VideoSphere from "@/components/basics/VideoSphere/VideoSphere";
import useSelectedSpotStore from "@/components/pages/SpotSelect/useSpotSelectStore";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { MutableRefObject } from "react";
import styles from "./InSpot.module.css";

export type InSpotProps = {
  avatarRef: MutableRefObject<AvatarHandle | null>;
};

const InSpot = (props: InSpotProps) => {
  const avatarSelectStore = useAvatarSelectStore();
  const spotSelectStore = useSelectedSpotStore();

  return (
    <>
      {spotSelectStore.spotInfo && (
        <>
          <div className={styles.canvasDiv}>
            <Canvas linear={true} flat={true}>
              {spotSelectStore.spotInfo.sphericalVideoUrl ? (
                <VideoSphere videoId="video" radius={100} />
              ) : (
                <ImageSphere
                  imageSourceUrl={spotSelectStore.spotInfo.sphericalImageUrl}
                />
              )}
              <OrbitControls />
              <ambientLight intensity={7} />
              {avatarSelectStore.avatarType && (
                <>
                  <Player avatarRef={props.avatarRef} />
                  <RemotePlayerGroup avatarRef={props.avatarRef} />
                </>
              )}
            </Canvas>
          </div>
          <div style={{ display: "none" }}>
            <HiddenVideo
              videoSourceUrl={spotSelectStore.spotInfo.sphericalVideoUrl}
              videoId="video"
            />
          </div>
        </>
      )}
    </>
  );
};

export default InSpot;
