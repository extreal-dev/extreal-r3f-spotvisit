import { getAvatarFacePath } from "@/components/basics/Avatar/Avatar.function";
import useAvatarSelectStore from "@/components/basics/AvatarSelect/useAvatarSelectStore";
import useParticipantInfoMapStore from "@/components/basics/ParticipantInfoGroup/useParticipantInfoMapStore";
import useRemotePlayerInfoMapStore from "@/components/basics/RemotePlayerGroup/useRemotePlayerGroupStore";
import { Avatar, Col, Progress, Row } from "antd";
import { IoMdMic, IoMdMicOff } from "react-icons/io";
import styles from "./ParticipantInfoPanel.module.css";

export type participantInfoPanelProps = {
  playerId: string;
  isShowFace?: boolean;
};

const ParticipantInfoPanel = (props: participantInfoPanelProps) => {
  const { playerId, isShowFace } = props;
  const avatarSelectStore = useAvatarSelectStore();
  const remotePlayerInfoMap = useRemotePlayerInfoMapStore();
  const participantInfoMap = useParticipantInfoMapStore();

  const remotePlayerInfo = remotePlayerInfoMap.getItem(playerId);
  const playerName =
    remotePlayerInfo?.playerName ?? avatarSelectStore.playerName;
  const avatarFacePath = getAvatarFacePath(
    remotePlayerInfo?.avatarType ?? avatarSelectStore.avatarType,
  );
  const participantInfo = participantInfoMap.getItem(playerId);
  if (!participantInfo) {
    return <></>;
  }
  const participant = participantInfo.participant;

  // Check if muted
  const tracks = participantInfo.participant.audioTrackPublications;
  let isMuted = false;
  for (const key of tracks.keys()) {
    const track = tracks.get(key);
    if (track?.isMuted) {
      isMuted = true;
      break;
    }
  }

  const avatarClassName = `${styles.avatarFace} ${
    participant.audioLevel > 0 ? styles.avatarFaceSpeaking : ""
  }`;

  const styleMicOn = participant.isLocal
    ? styles.micOnIcon
    : styles.micRemoteIcon;
  const styleMicOff = participant.isLocal
    ? styles.micOffIcon
    : styles.micRemoteIcon;
  return (
    <Row justify="start" wrap={false}>
      {isShowFace && (
        <Col span={4}>
          <Avatar
            src={avatarFacePath}
            size="large"
            className={avatarClassName}
          />
        </Col>
      )}
      <Col className={styles.columnCenter} span={isShowFace ? 16 : 20}>
        <p
          className={
            isShowFace
              ? styles.participantNameList
              : styles.participantNameBillboard
          }
        >
          {playerName}
        </p>
        <Progress
          className={styles.progress}
          percent={participant!.audioLevel * 100}
          showInfo={false}
        />
      </Col>
      <Col className={styles.columnEnd} span={4}>
        {participant!.isMicrophoneEnabled && !isMuted ? (
          <IoMdMic className={styleMicOn} />
        ) : (
          <IoMdMicOff className={styleMicOff} />
        )}
      </Col>
    </Row>
  );
};

export default ParticipantInfoPanel;
