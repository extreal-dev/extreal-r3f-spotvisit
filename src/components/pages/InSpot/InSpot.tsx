import { AvatarHandle } from "@/components/basics/Avatar/Avatar";
import useAvatarSelectStore from "@/components/basics/AvatarSelect/useAvatarSelectStore";
import ImageSphere from "@/components/basics/ImageSphere/ImageSphare";
import Player from "@/components/basics/Player/Player";
import RemotePlayerGroup from "@/components/basics/RemotePlayerGroup/RemotePlayerGroup";
import ThirdPersonCamera from "@/components/basics/ThirdPersonCamera/ThirdPersonCamera";
import { HiddenVideo } from "@/components/basics/VideoSphere/HiddenVideo";
import VideoSphere from "@/components/basics/VideoSphere/VideoSphere";
import { VirtualJoyStick } from "@/components/basics/VirtualJoyStick/VirtualJoyStick";
import useSelectedSpotStore from "@/components/pages/SpotSelect/useSpotSelectStore";
import useVirtualJoyStickPlayerInput from "@/hooks/useVirtualJoyStickPlayerInput";
import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import styles from "./InSpot.module.css";

const InSpot = () => {
  const avatarSelectStore = useAvatarSelectStore();
  const spotSelectStore = useSelectedSpotStore();
  const { playerInput, handleJoystickData, startJump } =
    useVirtualJoyStickPlayerInput();
  const avatarRef = useRef<AvatarHandle | null>(null);

  return (
    <>
      {spotSelectStore.spotInfo && (
        <>
          <VirtualJoyStick handle={handleJoystickData} startJump={startJump} />
          <div className={styles.canvasDiv}>
            <Canvas linear={true} flat={true}>
              {spotSelectStore.spotInfo.sphericalVideoUrl ? (
                <VideoSphere videoId="video" radius={100} />
              ) : (
                <ImageSphere
                  imageSourceUrl={spotSelectStore.spotInfo.sphericalImageUrl}
                />
              )}
              <ambientLight intensity={7} />
              <ThirdPersonCamera
                movement={playerInput.movement}
                avatarRef={avatarRef}
              />
              {avatarSelectStore.avatarType && (
                <>
                  <Player
                    avatarRef={avatarRef}
                    movement={playerInput.movement}
                  />
                  <RemotePlayerGroup avatarRef={avatarRef} />
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
