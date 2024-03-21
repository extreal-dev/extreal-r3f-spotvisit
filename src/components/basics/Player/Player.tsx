import { Avatar, AvatarHandle } from "@/components/basics/Avatar/Avatar";
import {
  defaultAnimationMap,
  getAvatarPath,
} from "@/components/basics/Avatar/Avatar.function";
import useAvatarSelectStore from "@/components/basics/AvatarSelect/useAvatarSelectStore";
import useMultiPlayChannelStore from "@/components/basics/Multiplay/useMultiplayChannelStore";
import RemotePlayerInfoMessage, {
  RemotePlayerInfoMessageType,
} from "@/components/basics/Player/PlayerInfoMessage";
import useSelectedSpotStore from "@/components/pages/SpotSelect/useSpotSelectStore";
import usePlayerInput from "@/hooks/usePlayerInput";
import { MutableRefObject, useCallback, useEffect } from "react";

export interface PlayerProps {
  avatarRef: MutableRefObject<AvatarHandle | null>;
}

const Player = (props: PlayerProps) => {
  const avatarSelectStore = useAvatarSelectStore();
  const selectedSpotStore = useSelectedSpotStore();
  const playerInput = usePlayerInput();
  const channel = useMultiPlayChannelStore();
  const { avatarRef } = props;

  const enqueueUpdate = useCallback(
    (type: RemotePlayerInfoMessageType) => {
      if (
        channel.isConnected &&
        channel.playerId &&
        selectedSpotStore.spotInfo &&
        avatarRef.current
      ) {
        const msg = RemotePlayerInfoMessage.toPayload(
          channel.playerId,
          type,
          avatarSelectStore.playerName,
          avatarSelectStore.avatarType,
          avatarRef.current,
          selectedSpotStore.spotInfo.id,
        );

        channel.enqueueRequest(msg);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      channel.isConnected,
      channel.playerId,
      selectedSpotStore.spotInfo,
      avatarSelectStore.avatarType,
      avatarSelectStore.playerName,
    ],
  );

  useEffect(() => {
    if (channel.isConnected) {
      enqueueUpdate(RemotePlayerInfoMessageType.NEW);
    }
  }, [channel.isConnected, enqueueUpdate]);

  useEffect(() => {
    if (channel.isConnected) {
      enqueueUpdate(RemotePlayerInfoMessageType.MOVE);
    }
  }, [
    playerInput.movement.forward,
    playerInput.movement.backward,
    playerInput.movement.left,
    playerInput.movement.right,
    playerInput.movement.running,
    playerInput.movement.jump,
    channel.isConnected,
    enqueueUpdate,
  ]);

  useEffect(() => {
    if (channel.isConnected) {
      enqueueUpdate(RemotePlayerInfoMessageType.CHANGE);
    }
  }, [
    channel.isConnected,
    avatarSelectStore.avatarType,
    avatarSelectStore.playerName,
    enqueueUpdate,
  ]);

  return (
    <>
      <Avatar
        ref={props.avatarRef}
        avatarPath={getAvatarPath(avatarSelectStore.avatarType)}
        animationMap={defaultAnimationMap}
        controller={playerInput.movement}
      />
    </>
  );
};

export default Player;
