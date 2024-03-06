import { Avatar } from "@/components/basics/Avatar/Avatar";
import {
  defaultAnimationMap,
  defaultAvatarMap,
} from "@/components/basics/Avatar/Avatar.function";
import useAvatarSelectStore from "@/components/basics/AvatarSelect/useAvatarSelectStore";
import AvatarSelectDialog from "@/components/pages/AvatarSelect/AvatarSelectDialog";
import usePlayerInput from "@/hooks/usePlayerInput";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import styles from "./App.module.css";

function App() {
  const avatarSelectStore = useAvatarSelectStore();
  const playerInput = usePlayerInput();

  return (
    <>
      <AvatarSelectDialog />
      <div className={styles.mainDiv}>
        <Canvas linear={true} flat={true}>
          <OrbitControls />
          <ambientLight intensity={7} />
          {avatarSelectStore.avatarType && (
            <Avatar
              avatarPath={defaultAvatarMap[avatarSelectStore.avatarType]}
              controller={playerInput.movement}
              animationMap={defaultAnimationMap}
            ></Avatar>
          )}
        </Canvas>
      </div>
    </>
  );
}

export default App;
