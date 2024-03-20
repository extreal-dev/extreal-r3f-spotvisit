import { defaultAvatarFaceImageMap } from "@/components/basics/Avatar/Avatar.function";
import useAvatarSelectStore from "@/components/basics/AvatarSelect/useAvatarSelectStore";
import useMultiPlayChannelStore from "@/components/basics/Multiplay/useMultiplayChannelStore";
import useRemotePlayerInfoMapStore from "@/components/basics/RemotePlayerGroup/useRemotePlayerGroupStore";
import {
  RoomAudioRenderer,
  useEnsureRoom,
  useParticipants,
} from "@livekit/components-react";
import { Avatar, Col, Progress, Row } from "antd";
import { LocalParticipant, RemoteParticipant } from "livekit-client";
import { useEffect } from "react";
import { IoMdMic, IoMdMicOff } from "react-icons/io";
import styles from "./VoiceChatPanel.module.css";

type VoiceChatFaceInfo = {
  connectId: string;
  playerName: string;
  avatarType: string;
  isLocal: boolean;
  audioLevel: number;
  audioMute: boolean;
};

export type VoiceChatFaceProps = {
  participant: VoiceChatFaceInfo;
  toggleMute?: (val: boolean) => void;
};
const VoiceChatFace = (props: VoiceChatFaceProps) => {
  const participant = props.participant;
  const onClick = props.toggleMute
    ? () => {
        props.toggleMute!(!participant.audioMute);
      }
    : undefined;

  const avatarClassName = `${styles.participant} ${
    participant.audioLevel > 0 ? styles.participantVoiceChatActive : ""
  }`;

  return (
    <>
      <Row justify="start" wrap={false}>
        <Col>
          <Avatar
            src={defaultAvatarFaceImageMap[participant.avatarType]}
            size="large"
            className={avatarClassName}
          />
        </Col>
        <Col className="columnCenter">
          <p className={styles.participantName}>{participant.playerName}</p>
          <Progress
            className={styles.progress}
            percent={100 * participant.audioLevel}
            showInfo={false}
          />
        </Col>
        {props.toggleMute && (
          <Col>
            {participant.audioMute ? (
              <IoMdMicOff
                className={styles.micOffIcon}
                onClick={onClick}
                onTouchEnd={onClick}
              />
            ) : (
              <IoMdMic
                className={styles.micOnIcon}
                onClick={onClick}
                onTouchEnd={onClick}
              />
            )}
          </Col>
        )}
      </Row>
    </>
  );
};

export type RemoteVoiceChatFaceProps = {
  rawParticipant: RemoteParticipant;
};
const RemoteVoiceChatFace = (props: RemoteVoiceChatFaceProps) => {
  const remotePlayerInfoMap = useRemotePlayerInfoMapStore();
  const { rawParticipant } = props;
  const id = rawParticipant.identity;
  const remotePlayerInfo = remotePlayerInfoMap.getItem(id);
  const tracks = rawParticipant.audioTrackPublications;
  let isMuted = false;
  for (const key of tracks.keys()) {
    const track = tracks.get(key);
    if (track?.isMuted) {
      isMuted = true;
      break;
    }
  }
  const participantInfo: VoiceChatFaceInfo = {
    connectId: id,
    playerName: remotePlayerInfo ? remotePlayerInfo.playerName : "Loading...",
    avatarType: remotePlayerInfo ? remotePlayerInfo.avatarType : "No Image",
    isLocal: false,
    audioLevel: rawParticipant.audioLevel,
    audioMute: !rawParticipant.isMicrophoneEnabled || isMuted,
  };

  useEffect(() => {
    participantInfo.playerName = remotePlayerInfo?.playerName
      ? remotePlayerInfo.playerName
      : id;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remotePlayerInfo?.playerName]);

  return <VoiceChatFace participant={participantInfo} />;
};

export type LocalVoiceChatFaceProps = {
  rawParticipant: LocalParticipant;
};
const LocalVoiceChatFace = (props: LocalVoiceChatFaceProps) => {
  const { rawParticipant } = props;
  const avatarSelectStore = useAvatarSelectStore();
  const tracks = rawParticipant.audioTrackPublications;
  let isMuted = false;
  for (const key of tracks.keys()) {
    const track = tracks.get(key);
    if (track?.isMuted) {
      isMuted = true;
      break;
    }
  }

  const participantInfo: VoiceChatFaceInfo = {
    connectId: rawParticipant.identity,
    playerName: avatarSelectStore.playerName,
    avatarType: avatarSelectStore.avatarType,
    isLocal: true,
    audioLevel: rawParticipant.audioLevel,
    audioMute: !rawParticipant.isMicrophoneEnabled || isMuted,
  };

  const toggleMute = (val: boolean) => {
    for (const key of tracks.keys()) {
      const track = tracks.get(key);
      val ? track?.mute() : track?.unmute();
    }
  };

  const channel = useMultiPlayChannelStore();
  useEffect(() => {
    if (channel.isConnected) {
      for (const key of tracks.keys()) {
        const track = tracks.get(key);
        track?.mute();
      }
    }
  }, [channel.isConnected, tracks]);

  return (
    <VoiceChatFace participant={participantInfo} toggleMute={toggleMute} />
  );
};

const VoiceChatPanel = () => {
  const channel = useMultiPlayChannelStore();
  const room = useEnsureRoom();
  const rawParticipants = useParticipants({ room });
  const remotePlayerInfoMap = useRemotePlayerInfoMapStore();
  const exists = rawParticipants.map((p) => p.identity);

  useEffect(() => {
    const keys = remotePlayerInfoMap.items.keys();
    for (const key of keys) {
      if (!exists.includes(key)) {
        remotePlayerInfoMap.removeItem(key);
      }
    }
  }, [exists, remotePlayerInfoMap]);

  if (!channel.isConnected) {
    return <></>;
  }

  return (
    <>
      <RoomAudioRenderer />
      <div className={styles.voiceChatPanel}>
        {rawParticipants.map((p) => {
          return p.isLocal ? (
            <LocalVoiceChatFace
              key={p.identity}
              rawParticipant={p as LocalParticipant}
            />
          ) : (
            <RemoteVoiceChatFace
              key={p.identity}
              rawParticipant={p as RemoteParticipant}
            />
          );
        })}
      </div>
    </>
  );
};

export default VoiceChatPanel;
