import { Avatar } from "@/components/basics/Avatar/Avatar";
import { defaultAnimationMap } from "@/components/basics/Avatar/Avatar.function";
import usePlayerInput from "@/hooks/usePlayerInput";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

function App() {
  const playerInput = usePlayerInput();

  return (
    <>
      <div style={{ width: "100vw", height: "100vh" }}>
        <Canvas linear={true} flat={true}>
          <OrbitControls />
          <ambientLight intensity={7} />
          <Avatar
            avatarPath={"public/avatars/timmy.vrm"}
            controller={playerInput.movement}
            animationMap={defaultAnimationMap}
          ></Avatar>
        </Canvas>
      </div>
    </>
  );
}

export default App;
