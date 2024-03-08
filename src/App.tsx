import { Avatar } from "@/components/basics/Avatar/Avatar";
import {
  defaultAnimationMap,
  defaultAvatarMap,
} from "@/components/basics/Avatar/Avatar.function";
import useAvatarSelectStore from "@/components/basics/AvatarSelect/useAvatarSelectStore";
import { HiddenVideo } from "@/components/basics/VideoSphere/HiddenVideo";
import VideoSphere from "@/components/basics/VideoSphere/VideoSphere";
import AvatarSelectDialog from "@/components/pages/AvatarSelect/AvatarSelectDialog";
import ErrorPage from "@/components/pages/ErrorPage/ErrorPage";
import SpotSelectBoard from "@/components/pages/SpotSelect/SpotSelectBoard";
import useSelectedSpotStore from "@/components/pages/SpotSelect/useSpotSelectStore";
import usePlayerInput from "@/hooks/usePlayerInput";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Button, Col, Row } from "antd";
import { ErrorBoundary } from "react-error-boundary";
import { IoMdHome } from "react-icons/io";
import { MdKeyboardArrowLeft } from "react-icons/md";
import "./App.css";
import styles from "./App.module.css";

const queryClient: QueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const spotSelectStore = useSelectedSpotStore();
  const avatarSelectStore = useAvatarSelectStore();
  const playerInput = usePlayerInput();

  const onBack = () => {
    spotSelectStore.setSpotInfo(undefined);
  };
  return (
    <>
      <ErrorBoundary FallbackComponent={ErrorPage}>
        <QueryClientProvider client={queryClient}>
          {spotSelectStore.spotInfo ? (
            <>
              <Row className={styles.header}>
                <Col span={8}>
                  <Button
                    onClick={onBack}
                    type="link"
                    className={styles.backButton}
                    icon={
                      <>
                        <MdKeyboardArrowLeft />
                        <IoMdHome />
                      </>
                    }
                  ></Button>
                </Col>
                <Col span={8}>
                  <p className={styles.spotName}>
                    {spotSelectStore.spotInfo.name}
                  </p>
                </Col>
                <Col span={8} className={styles.avatarSelect}>
                  <AvatarSelectDialog />
                </Col>
              </Row>
              <div className={styles.canvasDiv}>
                <Canvas linear={true} flat={true}>
                  <VideoSphere videoId="video" radius={100} />
                  <OrbitControls />
                  <ambientLight intensity={7} />
                  {avatarSelectStore.avatarType && (
                    <Avatar
                      avatarPath={
                        defaultAvatarMap[avatarSelectStore.avatarType]
                      }
                      controller={playerInput.movement}
                      animationMap={defaultAnimationMap}
                    ></Avatar>
                  )}
                </Canvas>
              </div>
              <div style={{ display: "none" }}>
                <HiddenVideo
                  videoSourceUrl={spotSelectStore.spotInfo.sphericalVideoUrl}
                  videoId="video"
                />
              </div>
            </>
          ) : (
            <SpotSelectBoard />
          )}
        </QueryClientProvider>
      </ErrorBoundary>
    </>
  );
}

export default App;
