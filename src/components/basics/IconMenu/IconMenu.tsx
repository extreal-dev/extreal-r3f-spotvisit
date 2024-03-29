import useMultiPlayChannelStore from "@/components/basics/Multiplay/useMultiplayChannelStore";
import usePlayerInfoStore from "@/components/basics/Player/usePlayerStore";
import AvatarSelectDialog from "@/components/pages/AvatarSelect/AvatarSelectDialog";
import useSelectedSpotStore from "@/components/pages/SpotSelect/useSpotSelectStore";
import MultiplayUtil from "@/libs/util/MultiplayUtil";
import { Button, Col, Input, Modal, Row, Typography } from "antd";
import { ConnectionState } from "livekit-client";
import { useState } from "react";
import { HiDotsVertical } from "react-icons/hi";
import { IoMdHome } from "react-icons/io";
import {
  MdConnectWithoutContact,
  MdKeyboardArrowLeft,
  MdOutlineGroupAdd,
} from "react-icons/md";
import { TbPlugConnected, TbPlugConnectedX } from "react-icons/tb";
import styles from "./IconMenu.module.css";

const shortUuidUserName = MultiplayUtil.generateShortUUID();

const IconMenu = () => {
  const spotSelectStore = useSelectedSpotStore();
  const playerInfo = usePlayerInfoStore();
  const channel = useMultiPlayChannelStore();
  const [isAvatarSelectOpen, setIsAvatarSelectOpen] = useState(false);
  const [isMultiplayOpen, setIsMultiplayOpen] = useState(false);
  const [groupName, setGroupName] = useState("");

  const onOK = () => {
    setIsAvatarSelectOpen(false);
  };

  const onBack = () => {
    spotSelectStore.setSpotInfo(undefined);
  };

  const ConnectStatusIcon = () => {
    switch (channel.connectStatus) {
      case ConnectionState.Connected:
        return <MdConnectWithoutContact className={styles.connectedIcon} />;
        break;
      case ConnectionState.Disconnected:
        return <MdOutlineGroupAdd />;
        break;
      case ConnectionState.Connecting:
        return <TbPlugConnected />;
        break;
      case ConnectionState.Reconnecting:
        return <TbPlugConnectedX />;
        break;

      default:
        break;
    }
  };

  return (
    <>
      <Row className={styles.header}>
        <Col span={8}>
          {spotSelectStore.spotInfo && (
            <>
              <Button
                onClick={onBack}
                type="link"
                className={styles.backButton}
                icon={
                  <>
                    <MdKeyboardArrowLeft />
                    <IoMdHome />
                  </>
                }
              ></Button>
            </>
          )}
        </Col>
        <Col span={8} className={styles.title}>
          {spotSelectStore.spotInfo ? (
            <p>{spotSelectStore.spotInfo.name}</p>
          ) : (
            <p>Select Spot</p>
          )}
        </Col>
        <Col span={8} className={styles.avatarSelectCol}>
          <Button
            onClick={() => {
              setIsMultiplayOpen(true);
            }}
            type="link"
            className={styles.avatarSelectButton}
            icon={ConnectStatusIcon()}
          />
          <Modal
            open={isMultiplayOpen}
            onOk={() => {
              if (channel.isConnected) {
                //Leave Multiplay Group
                playerInfo.setMultiplayGroupName(undefined);
                playerInfo.setMultiplayConnect(false);
                setGroupName("");
              } else {
                //Join Multiplay Group
                playerInfo.setMultiplayPlayerId(shortUuidUserName);
                playerInfo.setMultiplayGroupName(groupName);
                playerInfo.setMultiplayAudio(true);
                playerInfo.setMultiplayConnect(true);
              }
              setIsMultiplayOpen(false);
            }}
            onCancel={() => {
              if (!channel.isConnected) {
                setGroupName("");
              }
              setIsMultiplayOpen(false);
            }}
            okText={channel.isConnected ? "Leave" : "Join"}
            okButtonProps={{
              style: channel.isConnected
                ? { backgroundColor: "red", borderColor: "red", color: "white" }
                : {},
              disabled: !groupName,
            }}
            destroyOnClose
          >
            <Row gutter={8}>
              <Col span={24}>
                <Typography.Title level={5}>
                  {channel.isConnected
                    ? "Group Name"
                    : "Join or Create Multiplay Group"}
                </Typography.Title>
                <Input
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Enter Group Name"
                  value={groupName}
                  disabled={channel.isConnected}
                />
              </Col>
            </Row>
          </Modal>
          <Button
            onClick={() => {
              setIsAvatarSelectOpen(true);
            }}
            type="link"
            className={styles.avatarSelectButton}
            icon={<HiDotsVertical />}
          />
          <AvatarSelectDialog open={isAvatarSelectOpen} onClose={onOK} />
        </Col>
      </Row>
    </>
  );
};

export default IconMenu;
