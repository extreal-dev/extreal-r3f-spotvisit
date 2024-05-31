import useAvatarSelectStore from "@/components/basics/AvatarSelect/useAvatarSelectStore";
import AvatarSelect from "@/components/pages/AvatarSelect/AvatarSelect";
import { Modal } from "antd";

export type AvatarSelectDialogProp = {
  open: boolean;
  onClose: () => void;
};

export const AvatarSelectDialog = (props: AvatarSelectDialogProp) => {
  const avatarSelectStore = useAvatarSelectStore();

  const isModalOpen = !(
    avatarSelectStore.avatarType && avatarSelectStore.playerName
  )
    ? true
    : props.open;

  const handleOk = () => {
    props.onClose();
  };

  const handleCancel = () => {
    props.onClose();
  };

  return (
    <>
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
