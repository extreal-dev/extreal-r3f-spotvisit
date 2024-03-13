import useAvatarSelectStore from "@/components/basics/AvatarSelect/useAvatarSelectStore";
import AvatarSelectDialog from "@/components/pages/AvatarSelect/AvatarSelectDialog";
import useSelectedSpotStore from "@/components/pages/SpotSelect/useSpotSelectStore";
import { Button, Col, Row } from "antd";
import { useState } from "react";
import { HiDotsVertical } from "react-icons/hi";
import { IoMdHome } from "react-icons/io";
import { MdKeyboardArrowLeft } from "react-icons/md";
import styles from "./IconMenu.module.css";

const IconMenu = () => {
  const spotSelectStore = useSelectedSpotStore();
  const avatarSelectStore = useAvatarSelectStore();

  const [isModalOpen, setIsModalOpen] = useState(
    !avatarSelectStore.avatarType || !avatarSelectStore.playerName,
  );

  const onBack = () => {
    spotSelectStore.setSpotInfo(undefined);
  };

  return (
    <>
      {spotSelectStore.spotInfo && (
        <Row className={styles.header}>
          <Col span={8}>
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
          </Col>
          <Col span={8}>
            <p className={styles.spotName}>{spotSelectStore.spotInfo.name}</p>
          </Col>
          <Col span={8} className={styles.avatarSelectCol}>
            <Button
              onClick={() => {
                setIsModalOpen(true);
              }}
              type="link"
              className={styles.avatarSelectButton}
              icon={<HiDotsVertical />}
            />
            <AvatarSelectDialog
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
            />
          </Col>
        </Row>
      )}
    </>
  );
};

export default IconMenu;
