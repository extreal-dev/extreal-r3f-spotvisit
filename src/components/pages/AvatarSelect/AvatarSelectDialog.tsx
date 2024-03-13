import useAvatarSelectStore from "@/components/basics/AvatarSelect/useAvatarSelectStore";
import AvatarSelect from "@/components/pages/AvatarSelect/AvatarSelect";
import { Modal } from "antd";

export interface AvatarSelectDialogProps {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
}

export const AvatarSelectDialog = (props: AvatarSelectDialogProps) => {
  const avatarSelectStore = useAvatarSelectStore();

  const handleOk = () => {
    props.setIsModalOpen(false);
  };

  const handleCancel = () => {
    props.setIsModalOpen(false);
  };

  return (
    <>
      <Modal
        title="Enter Profile"
        open={props.isModalOpen}
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
