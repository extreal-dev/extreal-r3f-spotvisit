import { Flex } from "antd";
import SpotCard from "./SpotCard";
import useSpots from "./useSpots";

const SpotSelectPanel = () => {
  const { isLoading, data, error } = useSpots();
  if (isLoading) {
    return <>Loading...</>;
  }
  if (error) {
    return (
      <>
        Failed to get spot info.
        <pre>{error?.message || "Unknow reason."}</pre>
      </>
    );
  }
  if (data) {
    const spots = data.data;
    return (
      <>
        <Flex wrap="wrap">
          {spots.map((spot) => (
            <SpotCard key={spot.id} spot={spot} />
          ))}
        </Flex>
      </>
    );
  }
  return <>No spots found</>;
};

export default SpotSelectPanel;
