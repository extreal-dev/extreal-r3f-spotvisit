import IconMenu from "@/components/basics/IconMenu/IconMenu";
import MultiplayChannel from "@/components/basics/Multiplay/MultiplayChannel";
import usePlayerInfoStore from "@/components/basics/Player/usePlayerStore";
import ErrorPage from "@/components/pages/ErrorPage/ErrorPage";
import InSpot from "@/components/pages/InSpot/InSpot";
import SpotSelectPanel from "@/components/pages/SpotSelect/SpotSelectPanel";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import "./App.css";

const queryClient: QueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const playerInfo = usePlayerInfoStore();
  const connect = playerInfo.multiplayConnect;
  const audio = playerInfo.multiplayAudio;
  const groupName = playerInfo.multiplayGroupName ?? "";
  const playerId = playerInfo.multiplayPlayerId ?? "";

  const onJoinCallback = () => {
    console.debug("Join, Connected.");
  };
  const onLeaveCallback = () => {
    playerInfo.setMultiplayGroupName("");
    playerInfo.setMultiplayPlayerId("");
    playerInfo.setMultiplayAudio(false);
    playerInfo.setMultiplayConnect(false);
    console.debug("Leave, Disconnected.");
  };

  return (
    <>
      <ErrorBoundary FallbackComponent={ErrorPage}>
        <QueryClientProvider client={queryClient}>
          <IconMenu />
          <MultiplayChannel
            livekitServerUrl={import.meta.env.VITE_LIVEKIT_SERVER_URL}
            accessTokenUrl={import.meta.env.VITE_ACCESS_TOKEN_SERVER_URL}
            connect={connect}
            audio={audio}
            roomName={groupName}
            userName={playerId}
            onJoinCallback={onJoinCallback}
            onLeaveCallback={onLeaveCallback}
          />
          {playerInfo.spotInfo ? <InSpot /> : <SpotSelectPanel />}
        </QueryClientProvider>
      </ErrorBoundary>
    </>
  );
}

export default App;
