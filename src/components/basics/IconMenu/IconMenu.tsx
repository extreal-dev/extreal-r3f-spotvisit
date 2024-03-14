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
  const [isOpen, setIsOpen] = useState(false);

  const onOK = () => {
    setIsOpen(false);
  };

  const onBack = () => {
    spotSelectStore.setSpotInfo(undefined);
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
              setIsOpen(true);
            }}
            type="link"
            className={styles.avatarSelectButton}
            icon={<HiDotsVertical />}
          />
          <AvatarSelectDialog open={isOpen} onClose={onOK} />
        </Col>
      </Row>
    </>
  );
};

export default IconMenu;
