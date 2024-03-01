import { Avatar } from "@/components/basics/Avatar/Avatar";
import { defaultAnimationMap } from "@/components/basics/Avatar/Avatar.function";
import usePlayerInput from "@/hooks/usePlayerInput";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import "./App.css";

function App() {
  const playerInput = usePlayerInput();

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div style={{ width: "80vw", height: "80vh" }}>
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
      </main>
    </>
  );
}

export default App;
