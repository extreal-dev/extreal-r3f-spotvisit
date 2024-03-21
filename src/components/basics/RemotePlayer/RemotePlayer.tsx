import { Avatar, AvatarHandle } from "@/components/basics/Avatar/Avatar";
import {
  defaultAnimationMap,
  defaultAvatarMap,
} from "@/components/basics/Avatar/Avatar.function";
import RemotePlayerInfoMessage from "@/components/basics/Player/PlayerInfoMessage";
import useRemotePlayerInfoMapStore from "@/components/basics/RemotePlayerGroup/useRemotePlayerGroupStore";
import useSelectedSpotStore from "@/components/pages/SpotSelect/useSpotSelectStore";
import { useRef } from "react";

export type RemotePlayerProps = {
  playerId: string;
  remotePlayerInfoMsg: RemotePlayerInfoMessage | undefined;
};

const RemotePlayer = (props: RemotePlayerProps) => {
  const { playerId, remotePlayerInfoMsg } = props;
  const remotePlayerInfoMap = useRemotePlayerInfoMapStore();
  const selectedspotStore = useSelectedSpotStore();
  const avatarRef = useRef<AvatarHandle | null>(null);
  let playerInfo = remotePlayerInfoMap.getItem(playerId);

  if (!playerInfo) {
    console.debug("playerInfo is not defined");
    return <>error</>;
  }
  if (playerInfo.spotKey !== selectedspotStore.spotInfo?.id) {
    return <></>;
  }
  if (remotePlayerInfoMsg?.remotePlayerInfo) {
    playerInfo = remotePlayerInfoMsg.remotePlayerInfo;
  }

  return (
    <>
      <Avatar
        ref={avatarRef}
        avatarPath={
          defaultAvatarMap[playerInfo.avatarType] ??
          "public/avatars/michelle.vrm"
        }
        animationMap={defaultAnimationMap}
        controller={playerInfo.controller}
        currentMotion={playerInfo.motion}
        remotePosition={playerInfo.position}
        remoteRotation={playerInfo.rotation}
      />
    </>
  );
};

export default RemotePlayer;
