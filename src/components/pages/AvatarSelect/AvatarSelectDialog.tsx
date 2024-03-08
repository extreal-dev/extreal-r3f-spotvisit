import useAvatarSelectStore from "@/components/basics/AvatarSelect/useAvatarSelectStore";
import AvatarSelect from "@/components/pages/AvatarSelect/AvatarSelect";
import { Button, Modal } from "antd";
import { useState } from "react";
import { HiDotsVertical } from "react-icons/hi";
import styles from "./AvatarSelect.module.css";

export const AvatarSelectDialog = () => {
  const avatarSelectStore = useAvatarSelectStore();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(
    !avatarSelectStore.playerName || !avatarSelectStore.avatarType,
  );

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        type="link"
        className={styles.settingButton}
        icon={<HiDotsVertical />}
      />
      <Modal
        title="Enter Profile"
        open={isModalOpen}
        onCancel={handleCancel}
        closable={
          !(!avatarSelectStore.playerName || !avatarSelectStore.setAvatarType)
        }
        maskClosable={
          !(!avatarSelectStore.playerName || !avatarSelectStore.setAvatarType)
        }
        footer={null}
        destroyOnClose
      >
        <AvatarSelect handleOK={handleOk} />
      </Modal>
    </>
  );
};

export default AvatarSelectDialog;
