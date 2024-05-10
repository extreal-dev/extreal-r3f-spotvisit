import useMultiplayChannelStore from "@/components/basics/Multiplay/useMultiplayChannelStore";
import useParticipantInfoMapStore from "@/components/basics/ParticipantInfoGroup/useParticipantInfoMapStore";
import useRemotePlayerInfoMapStore from "@/components/basics/RemotePlayerGroup/useRemotePlayerGroupStore";
import {
  RoomAudioRenderer,
  useEnsureRoom,
  useParticipants,
} from "@livekit/components-react";
import { Button } from "antd";
import { LocalParticipant } from "livekit-client";
import { useCallback, useEffect, useState } from "react";
import { IoMdMic, IoMdMicOff } from "react-icons/io";
import styles from "./ParticipantInfoGroup.module.css";

export type MuteButtonProps = {
  participant: LocalParticipant;
};
const MuteButton = (props: MuteButtonProps) => {
  const participant = props.participant;
  const [isMuted, setIsMuted] = useState(participant.isMicrophoneEnabled);
  const tracks = participant.audioTrackPublications;
  const toggleMute = useCallback(() => {
    const newMuted = !isMuted;
    for (const key of tracks.keys()) {
      const track = tracks.get(key);
      newMuted ? track?.mute() : track?.unmute();
    }
    setIsMuted(newMuted);
  }, [isMuted, tracks]);

  const channel = useMultiplayChannelStore();
  useEffect(() => {
    if (channel.isConnected) {
      for (const key of tracks.keys()) {
        const track = tracks.get(key);
        track?.mute();
      }
    }
  }, [channel.isConnected, tracks]);

  return (
    <>
      <div className={styles.muteButtonDiv}>
        {isMuted ? (
          <Button
            size="middle"
            icon={<IoMdMicOff className={styles.micOffIcon} />}
            shape="circle"
            onClick={toggleMute}
            // Prevent to open modal by space key
            onKeyDown={(e) => e.preventDefault()}
          />
        ) : (
          <Button
            size="middle"
            icon={<IoMdMic className={styles.micOnIcon} />}
            shape="circle"
            onClick={toggleMute}
            // Prevent to open modal by space key
            onKeyDown={(e) => e.preventDefault()}
          />
        )}
      </div>
    </>
  );
};

const ParticipantInfoGroup = () => {
  const channel = useMultiplayChannelStore();
  const room = useEnsureRoom();
  const rawParticipants = useParticipants({ room });
  const participantInfoMap = useParticipantInfoMapStore();
  const remotePlayerInfoMap = useRemotePlayerInfoMapStore();

  useEffect(() => {
    const localParticipant = rawParticipants.find((p) => p.isLocal);
    if (channel.isConnected) {
      const participantInfo = {
        playerId: localParticipant!.identity,
        participant: localParticipant!,
      };
      participantInfoMap.setItem(participantInfo, participantInfo.playerId);
    }

    const exists = rawParticipants.map((p) => p.identity);
    const keys = remotePlayerInfoMap.items.keys();
    // When a participant disconnects from the room, remove participants from the store
    for (const key of keys) {
      if (!exists.includes(key)) {
        remotePlayerInfoMap.removeItem(key);
        participantInfoMap.removeItem(key);
      } else {
        const participant = rawParticipants.find((p) => key === p.identity);
        const participantInfo = {
          playerId: participant!.identity,
          participant: participant!,
        };
        participantInfoMap.setItem(participantInfo, participantInfo.playerId);
      }
    }
  }, [
    channel.isConnected,
    participantInfoMap,
    rawParticipants,
    remotePlayerInfoMap,
  ]);

  if (!channel.isConnected) {
    return <></>;
  }

  return (
    <>
      <RoomAudioRenderer />
      {rawParticipants
        .filter((p) => p.isLocal)
        .map((p) => (
          <MuteButton key={p.identity} participant={p as LocalParticipant} />
        ))}
    </>
  );
};

export default ParticipantInfoGroup;
