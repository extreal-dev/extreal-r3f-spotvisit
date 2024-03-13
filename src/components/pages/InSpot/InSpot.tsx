import { Avatar } from "@/components/basics/Avatar/Avatar";
import {
  defaultAnimationMap,
  defaultAvatarMap,
} from "@/components/basics/Avatar/Avatar.function";
import useAvatarSelectStore from "@/components/basics/AvatarSelect/useAvatarSelectStore";
import IconMenu from "@/components/basics/IconMenu/IconMenu";
import ImageSphere from "@/components/basics/ImageSphere/ImageSphare";
import { HiddenVideo } from "@/components/basics/VideoSphere/HiddenVideo";
import VideoSphere from "@/components/basics/VideoSphere/VideoSphere";
import useSelectedSpotStore from "@/components/pages/SpotSelect/useSpotSelectStore";
import usePlayerInput from "@/hooks/usePlayerInput";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import styles from "./InSpot.module.css";

const InSpot = () => {
  const avatarSelectStore = useAvatarSelectStore();
  const playerInput = usePlayerInput();
  const spotSelectStore = useSelectedSpotStore();

  return (
    <>
      {spotSelectStore.spotInfo && (
        <>
          <IconMenu />
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
                <Avatar
                  avatarPath={defaultAvatarMap[avatarSelectStore.avatarType]}
                  controller={playerInput.movement}
                  animationMap={defaultAnimationMap}
                ></Avatar>
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
