import { AvatarHandle } from "@/components/basics/Avatar/Avatar";
import useAvatarSelectStore from "@/components/basics/AvatarSelect/useAvatarSelectStore";
import ImageSphere from "@/components/basics/ImageSphere/ImageSphare";
import Player from "@/components/basics/Player/Player";
import usePlayerInfoStore from "@/components/basics/Player/usePlayerStore";
import RemotePlayerGroup from "@/components/basics/RemotePlayerGroup/RemotePlayerGroup";
import ThirdPersonCamera from "@/components/basics/ThirdPersonCamera/ThirdPersonCamera";
import { HiddenVideo } from "@/components/basics/VideoSphere/HiddenVideo";
import VideoSphere from "@/components/basics/VideoSphere/VideoSphere";
import { VirtualJoyStick } from "@/components/basics/VirtualJoyStick/VirtualJoyStick";
import useVirtualJoyStickPlayerInput from "@/hooks/useVirtualJoyStickPlayerInput";
import { Grid } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import styles from "./InSpot.module.css";

const InSpot = () => {
  const avatarSelectStore = useAvatarSelectStore();
  const playerInfo = usePlayerInfoStore();
  const { playerInput, handleJoystickData, startJump } =
    useVirtualJoyStickPlayerInput();
  const avatarRef = useRef<AvatarHandle | null>(null);

  return (
    <>
      {playerInfo.spotInfo && (
        <>
          <VirtualJoyStick handle={handleJoystickData} startJump={startJump} />
          <div className={styles.canvasDiv}>
            <Canvas linear={true} flat={true}>
              {playerInfo.spotInfo.sphericalVideoUrl ? (
                <VideoSphere videoId="video" radius={100} />
              ) : (
                <ImageSphere
                  imageSourceUrl={playerInfo.spotInfo.sphericalImageUrl}
                />
              )}
              <ambientLight intensity={5} />
              <ThirdPersonCamera
                movement={playerInput.movement}
                setMovement={playerInput.setMovement}
                avatarRef={avatarRef}
              />
              {/* Floor showing the range within VideoSphere */}
              <Grid
                cellSize={1}
                cellThickness={0.3}
                cellColor={"gray"}
                sectionSize={0}
                sectionThickness={0}
                sectionColor={"gray"}
                args={[30, 30]}
                fadeDistance={120}
                fadeStrength={1}
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
          {playerInfo.spotInfo.sphericalVideoUrl && (
            <div>
              <HiddenVideo
                videoSourceUrl={playerInfo.spotInfo.sphericalVideoUrl}
                videoId="video"
              />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default InSpot;
