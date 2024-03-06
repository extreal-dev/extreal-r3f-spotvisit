import {
  defaultAvatarFaceImageMap,
  defaultAvatarMap,
} from "@/components/basics/Avatar/Avatar.function";
import useAvatarSelectStore from "@/components/basics/AvatarSelect/useAvatarSelectStore";
import { Button, Col, Image, Input, Row, Select, Typography } from "antd";
import { useState } from "react";
import styles from "./AvatarSelect.module.css";

export type AvatarSelectProps = {
  handleOK: () => void;
};

export const AvatarSelect = (props: AvatarSelectProps) => {
  const avatarSelectStore = useAvatarSelectStore();
  const [playerName, setPlayerName] = useState(avatarSelectStore.playerName);
  const [avatarType, setAvatarType] = useState(avatarSelectStore.avatarType);

  const onSelect = () => {
    avatarSelectStore.setPlayerName(playerName.trim());
    if (avatarType) {
      avatarSelectStore.setAvatarType(avatarType);
    }
    props.handleOK();
  };

  return (
    <>
      <Row>
        <Col span={24}>
          <Typography.Title level={5}>Nickname</Typography.Title>
          <Input
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter nickname"
          />
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Typography.Title level={5}>Avatar</Typography.Title>
          <Select
            placeholder="Select avatar"
            value={avatarType || undefined}
            onChange={(value) => setAvatarType(value)}
            className={styles.avatarSelect}
            options={Object.keys(defaultAvatarMap).map((key) => ({
              label: key,
              value: key,
            }))}
          ></Select>
        </Col>
      </Row>
      <Row justify="center" style={{ marginTop: "10px" }}>
        <Col>
          <Image
            width={100}
            height={100}
            src={
              defaultAvatarFaceImageMap[avatarType] ||
              "public/avatar-faces/no-image.png"
            }
            preview={false}
            alt={avatarType || "No image"}
          />
        </Col>
      </Row>
      <Row justify="end">
        <Col span={4}>
          <Button
            onClick={onSelect}
            disabled={!playerName.trim() || !avatarType}
            type="primary"
            block
          >
            OK
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default AvatarSelect;
