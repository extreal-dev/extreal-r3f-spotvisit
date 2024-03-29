import IconMenu from "@/components/basics/IconMenu/IconMenu";
import MultiplayChannel from "@/components/basics/Multiplay/MultiplayChannel";
import ErrorPage from "@/components/pages/ErrorPage/ErrorPage";
import InSpot from "@/components/pages/InSpot/InSpot";
import SpotSelectPanel from "@/components/pages/SpotSelect/SpotSelectPanel";
import useSelectedSpotStore from "@/components/pages/SpotSelect/useSpotSelectStore";
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
  const spotSelectStore = useSelectedSpotStore();

  return (
    <>
      <ErrorBoundary FallbackComponent={ErrorPage}>
        <QueryClientProvider client={queryClient}>
          <IconMenu />
          <MultiplayChannel
            livekitServerUrl="ws://localhost:7880"
            accessTokenUrl="http://localhost:3001/getToken"
          />
          {spotSelectStore.spotInfo ? <InSpot /> : <SpotSelectPanel />}
        </QueryClientProvider>
      </ErrorBoundary>
    </>
  );
}

export default App;
