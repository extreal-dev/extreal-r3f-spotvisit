import { Button } from "antd";
import { GiJumpAcross } from "react-icons/gi";
import { Joystick } from "react-joystick-component";
import { IJoystickUpdateEvent } from "react-joystick-component/build/lib/Joystick";
import styles from "./VirtualJoyStick.module.css";

export type VirtualJoyStickProps = {
  size?: number;
  sticky?: boolean;
  baseColor?: string;
  stickColor?: string;
  handle: (data: IJoystickUpdateEvent | null) => void;
  startJump?: () => void;
};

export const VirtualJoyStick = (props: VirtualJoyStickProps) => {
  const handleMove = (data: IJoystickUpdateEvent) => {
    if (props.handle) {
      props.handle(data);
    }
  };

  const handleStop = () => {
    if (props.handle) {
      props.handle(null);
    }
  };

  return (
    <>
      <div
        className={`${styles.virtualJoyStickDiv} ${styles.disableTextSelect}`}
      >
        <Joystick
          size={props.size || 100}
          sticky={props.sticky || false}
          baseColor={props.baseColor || "gray"}
          stickColor={props.stickColor || "white"}
          move={handleMove}
          stop={handleStop}
        />
      </div>
      <div className={`${styles.jumpButtonDiv} ${styles.disableTextSelect}`}>
        <Button
          icon={<GiJumpAcross />}
          shape="circle"
          onMouseDown={props.startJump}
          onTouchStart={props.startJump}
        />
      </div>
    </>
  );
};
