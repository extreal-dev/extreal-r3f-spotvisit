import useAvatarSelectStore from "@/components/basics/AvatarSelect/useAvatarSelectStore";
import useSelectedSpotStore from "@/components/pages/SpotSelect/useSpotSelectStore";
import { Button, Col, Row } from "antd";
import { HiDotsVertical } from "react-icons/hi";
import { IoMdHome } from "react-icons/io";
import { MdKeyboardArrowLeft } from "react-icons/md";
import styles from "./IconMenu.module.css";

const IconMenu = () => {
  const spotSelectStore = useSelectedSpotStore();
  const avatarSelectStore = useAvatarSelectStore();

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
                avatarSelectStore.setAvatarType("");
                avatarSelectStore.setPlayerName("");
              }}
              type="link"
              className={styles.avatarSelectButton}
              icon={<HiDotsVertical />}
            />
          </Col>
        </Row>
      )}
    </>
  );
};

export default IconMenu;
