import usePlayerInput from "@/hooks/usePlayerInput";
import { IJoystickUpdateEvent } from "react-joystick-component/build/lib/Joystick";

const useVirtualJoyStickPlayerInput = () => {
  const playerInput = usePlayerInput();

  const handleJoystickData = (data: IJoystickUpdateEvent | null) => {
    if (data === null) {
      playerInput.setMovement((prev) => ({
        ...prev,
        forward: false,
        backward: false,
        left: false,
        right: false,
        running: false,
      }));
      return;
    }

    const forward = !!(data.y && data.y > 0.2);
    const backward = !!(data.y && data.y < -0.2);
    const left = !!(data.x && data.x < -0.2);
    const right = !!(data.x && data.x > 0.2);
    const running = !!(
      data.x &&
      data.y &&
      Math.sqrt(data.x * data.x + data.y * data.y) > 0.8
    );

    const nextMovement = {
      right,
      left,
      forward,
      backward,
      running,
    };

    if (playerInput.movement !== nextMovement) {
      playerInput.setMovement((nextMove) => ({
        ...nextMove,
        right,
        left,
        forward,
        backward,
        running,
      }));
    }
  };

  const startJump = () => {
    if (playerInput.movement.inAirCount === 0)
      playerInput.setMovement((nextMove) => ({
        ...nextMove,
        jump: true,
        inAirCount: 30,
      }));
  };

  return { playerInput, handleJoystickData, startJump };
};
export default useVirtualJoyStickPlayerInput;
