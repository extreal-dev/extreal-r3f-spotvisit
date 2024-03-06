import { Avatar } from "@/components/basics/Avatar/Avatar";
import {
  defaultAnimationMap,
  defaultAvatarMap,
} from "@/components/basics/Avatar/Avatar.function";
import useAvatarSelectStore from "@/components/basics/AvatarSelect/useAvatarSelectStore";
import SpotSelectBoard from "@/components/basics/Spot/SpotSelectBoard";
import AvatarSelectDialog from "@/components/pages/AvatarSelect/AvatarSelectDialog";
import ErrorPage from "@/components/pages/ErrorPage/ErrorPage";
import usePlayerInput from "@/hooks/usePlayerInput";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import styles from "./App.module.css";

const queryClient: QueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const avatarSelectStore = useAvatarSelectStore();
  const playerInput = usePlayerInput();

  return (
    <>
      <ErrorBoundary FallbackComponent={ErrorPage}>
        <QueryClientProvider client={queryClient}>
          <AvatarSelectDialog />
          <SpotSelectBoard />
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
        </QueryClientProvider>
      </ErrorBoundary>
    </>
  );
}

export default App;
