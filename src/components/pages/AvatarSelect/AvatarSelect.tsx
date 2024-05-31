import {
  defaultAvatarMap,
  getAvatarFacePath,
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove whitespaces not to be bugged when parsing JSON message in multiplay.
    const newValue = e.target.value.replace(/ /g, "");
    setPlayerName(newValue);
  };

  return (
    <>
      <Row>
        <Col span={24}>
          <Typography.Title level={5}>Nickname</Typography.Title>
          <Input
            // Prevent zoom when touch on mobile browser
            size="large"
            value={playerName}
            onChange={handleChange}
            placeholder="Enter nickname"
          />
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Typography.Title level={5}>Avatar</Typography.Title>
          <Select
            // Prevent zoom when touch on mobile browser
            size="large"
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
            src={getAvatarFacePath(avatarType)}
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
