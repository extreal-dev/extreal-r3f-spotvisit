import SpotCard from "./SpotCard";
import useSpots from "./useSpots";

// Sample Implementation - will be replaced.
const SpotSelectBoard = () => {
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
    console.warn("spots", data.data);
    return (
      <>
        {spots.map((spot) => (
          <SpotCard key={spot.id} spot={spot} />
        ))}
      </>
    );
  }
  return <>No spots found</>;
};

export default SpotSelectBoard;
