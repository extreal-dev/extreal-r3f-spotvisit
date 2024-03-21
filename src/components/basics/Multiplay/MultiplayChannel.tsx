import { AvatarHandle } from "@/components/basics/Avatar/Avatar";
import useMultiPlayChannelStore from "@/components/basics/Multiplay/useMultiplayChannelStore";
import usePlayerInfoStore from "@/components/basics/Player/usePlayerStore";
import VoiceChatPanel from "@/components/basics/VoiceChatPanel/VoiceChatPanel";
import MultiplayUtil from "@/libs/util/MultiplayUtil";
import { ReceivedDataMessage } from "@livekit/components-core";
import {
  LiveKitRoom,
  useConnectionState,
  useDataChannel,
} from "@livekit/components-react";
import { ConnectionState } from "livekit-client";
import { MutableRefObject, useEffect, useState } from "react";

export type MultiplayChannelProps = {
  livekitServerUrl: string;
  accessTokenUrl: string;
  avatarRef: MutableRefObject<AvatarHandle | null>;
};

export type MultiplayChannelComponentProps = {
  groupName: string;
  playerId: string;
  onConnectedCallback?: (groupName: string, playerId: string) => void;
  onDisconnectedCallback?: (groupName: string, playerId: string) => void;
};

const MultiplayChannelComponent = (props: MultiplayChannelComponentProps) => {
  const channel = useMultiPlayChannelStore();

  const { groupName, playerId, onConnectedCallback, onDisconnectedCallback } =
    props;

  const { send } = useDataChannel(
    groupName,
    (msg: ReceivedDataMessage<string>) => {
      const payload = new TextDecoder().decode(msg.payload);
      console.debug(
        "onMessage[%o]: from: %o, %s",
        msg.topic,
        msg.from?.identity,
        payload,
      );
      channel.enqueueResponse(payload);
    },
  );
  const state = useConnectionState();

  useEffect(() => {
    if (state === ConnectionState.Connected) {
      if (onConnectedCallback) {
        onConnectedCallback(groupName, playerId);
        channel.setConnected(true);
        channel.setGroupName(groupName);
        channel.setPlayerId(playerId);
      }
    } else if (state === ConnectionState.Disconnected) {
      if (onDisconnectedCallback) {
        onDisconnectedCallback(groupName, playerId);
        channel.setGroupName(undefined);
        channel.setPlayerId(undefined);
        channel.setConnected(false);
      }
    }
    channel.setConnectStatus(state);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  useEffect(() => {
    if (state === ConnectionState.Connected) {
      for (let i = 0; i < channel.requestQueue.length; i++) {
        const payload = channel.dequeueRequest();
        const msg = new TextEncoder().encode(payload);
        console.debug("Send Msg: ", payload);
        send(msg, {});
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, channel.requestQueue.length]);

  return <></>;
};

const MultiplayChannel = (props: MultiplayChannelProps) => {
  const [accessToken, setAccessToken] = useState("");
  const { livekitServerUrl, accessTokenUrl } = props;
  const playerInfo = usePlayerInfoStore();
  const connect = playerInfo.multiplayConnect;
  const audio = playerInfo.multiplayAudio;
  const groupName = playerInfo.multiplayGroupName ?? "";
  const playerId = playerInfo.multiplayPlayerId ?? "";

  const onJoinCallback = () => {
    console.debug("Join, Connected.");
  };
  const onLeaveCallback = () => {
    playerInfo.setMultiplayGroupName("");
    playerInfo.setMultiplayPlayerId("");
    playerInfo.setMultiplayAudio(false);
    playerInfo.setMultiplayConnect(false);
    console.debug("Leave, Disconnected.");
  };

  useEffect(() => {
    if (connect) {
      (async () => {
        const ac = await MultiplayUtil.getAccessToken(
          accessTokenUrl,
          groupName,
          playerId,
        );
        setAccessToken(ac ?? "");
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connect]);

  return (
    <>
      <LiveKitRoom
        serverUrl={livekitServerUrl}
        token={accessToken}
        onConnected={() => {
          console.debug("[LiveKitRoom] Connected");
        }}
        onDisconnected={() => {
          console.debug("[LiveKitRoom] Disconnected");
        }}
        connect={connect}
        audio={audio}
        video={false}
      >
        <MultiplayChannelComponent
          groupName={groupName}
          playerId={playerId}
          onConnectedCallback={onJoinCallback}
          onDisconnectedCallback={onLeaveCallback}
        />
        <VoiceChatPanel />
      </LiveKitRoom>
    </>
  );
};

export default MultiplayChannel;
