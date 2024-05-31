import { Spin } from "antd";
import SpotCard from "./SpotCard";
import styles from "./SpotSelectPanel.module.css";
import useSpots from "./useSpots";

const SpotSelectPanel = () => {
  const { isLoading, data, error } = useSpots();
  if (isLoading) {
    return <Spin fullscreen />;
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
        <div className={styles.content}>
          {spots.map((spot) => (
            <SpotCard key={spot.id} spot={spot} />
          ))}
        </div>
      </>
    );
  }
  return <>No spots found</>;
};

export default SpotSelectPanel;
