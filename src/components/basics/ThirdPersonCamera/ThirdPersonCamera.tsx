import { AvatarHandle } from "@/components/basics/Avatar/Avatar";
import { CharacterController } from "@/hooks/usePlayerInput";
import { OrbitControls, OrbitControlsProps } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as THREE from "three";

export type ThirdPersonCameraProps = {
  movement: CharacterController;
  setMovement: Dispatch<SetStateAction<CharacterController>>;
  avatarRef: MutableRefObject<AvatarHandle | null>;
  cameraOffset?: THREE.Vector3;
  targetOffset?: THREE.Vector3;
  enableZoomAndPan?: boolean;
  enableControl?: boolean;
};

// ThirdPerson Camera based on OrbitControls for Avatar Control
const ThirdPersonCamera = (props: ThirdPersonCameraProps) => {
  // Drei currently does not forward Ref of OrbitControls(https://github.com/pmndrs/drei/issues/937)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const orbitControlsRef = useRef<any>(null);
  const { movement, avatarRef } = props;
  const initialCameraOffset = useMemo(
    () => props.cameraOffset ?? new THREE.Vector3(0, 2, -5),
    [props.cameraOffset],
  );
  const targetOffset = useMemo(
    () => props.targetOffset ?? new THREE.Vector3(0, 2, 0),
    [props.targetOffset],
  );
  const [distance, setDistance] = useState(
    initialCameraOffset.distanceTo(new THREE.Vector3()),
  );
  const [cameraMove, setCameraMove] = useState(false);
  const enableZoomAndPan = props.enableZoomAndPan ?? true;
  const [savedPolarAngle, setSavedPolarAngle] = useState(Math.PI * 0.5);
  const [savedAzimuthAngle, setSavedAzimuthAngle] = useState(Math.PI * 0.5);

  const { camera } = useThree();

  // Initiate Camera Position by Avatar Load and changes
  useEffect(() => {
    if (avatarRef.current) {
      const orbitControls = orbitControlsRef.current as OrbitControlsProps;
      if (orbitControls.object) {
        orbitControls.object.position.copy(initialCameraOffset);
      }
    }
  }, [initialCameraOffset, avatarRef]);

  const isPlayerMoving =
    movement.forward ||
    movement.backward ||
    movement.left ||
    movement.right ||
    movement.running;
  useFrame(() => {
    const controls = orbitControlsRef.current as OrbitControlsProps;
    const avatarPos = avatarRef.current?.getPosition();
    if (avatarPos && controls.target && controls.update && controls.object) {
      //Set camera target
      if (controls.target instanceof THREE.Vector3) {
        controls.target.copy(avatarPos).add(targetOffset);
      }
      //Camera keeps constant distance from Avatar
      if (isPlayerMoving) {
        //Direction from current camera position to Avatar
        const currentCameraPos = controls.object.position.clone();
        if (currentCameraPos) {
          const directionVector = currentCameraPos.sub(avatarPos).normalize();

          //Update offset from Avatar to camera position to keep current distance
          const updatedOffset = directionVector.multiplyScalar(distance);

          //Update camera position with updated offset
          controls.object.position.copy(avatarPos).add(updatedOffset);
        }
      }
      controls.update();

      //Keep distance even after camera zooming or panning
      setDistance(controls.object.position.distanceTo(avatarPos));

      if (controls.getPolarAngle) {
        setSavedPolarAngle(controls.getPolarAngle());
      }
      if (controls.getAzimuthalAngle) {
        setSavedAzimuthAngle(controls.getAzimuthalAngle());
      }
    }

    if (cameraMove) {
      props.setMovement((state) => ({
        ...state,
        cameraPosition: camera.position,
      }));
    }
  });

  return (
    <>
      <OrbitControls
        onStart={() => setCameraMove(true)}
        onEnd={() => setCameraMove(false)}
        ref={orbitControlsRef}
        makeDefault
        // Disable camera control when player is moving to prevent camera shaking
        enabled={!isPlayerMoving}
        // Prevent Gimbal lock by limiting polar angles
        // 0.1 to 0.9 is ideal for free camera control
        // Lock camera angles for intuitive control when player is moving,
        minPolarAngle={isPlayerMoving ? savedPolarAngle : Math.PI * 0.1}
        maxPolarAngle={isPlayerMoving ? savedPolarAngle : Math.PI * 0.9}
        minAzimuthAngle={isPlayerMoving ? savedAzimuthAngle : undefined}
        maxAzimuthAngle={isPlayerMoving ? savedAzimuthAngle : undefined}
        // Limit camera distance so that it does not enter inside Avatar and is not too far away
        // 2.0 to 10.0 is ideal for both PC and mobile devices
        minDistance={2.0}
        maxDistance={10.0}
        enableZoom={enableZoomAndPan}
        enablePan={enableZoomAndPan}
      />
    </>
  );
};

export default ThirdPersonCamera;
