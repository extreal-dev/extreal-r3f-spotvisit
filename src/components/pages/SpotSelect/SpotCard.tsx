import useSelectedSpotStore from "@/components/pages/SpotSelect/useSpotSelectStore";
import { SpotResponse } from "@/generated/model";
import { Button, Card } from "antd";
import style from "./SpotCard.module.css";
const { Meta } = Card;

export type SpotCardProps = {
  spot: SpotResponse;
};

const SpotCard = (props: SpotCardProps) => {
  const spot = props.spot;
  const selectedSpotStore = useSelectedSpotStore();

  const onSelectSpot = () => {
    selectedSpotStore.setSpotInfo(props.spot);
  };

  return (
    <>
      <Card
        className={style.card}
        size="small"
        cover={<img alt="example" src={spot.thumbnailImageUrl} />}
        styles={{
          body: {
            height: "200px",
            overflow: "hidden",
            borderRadius: "0px",
            backgroundColor: "white",
          },
          actions: {
            border: "none",
          },
        }}
        actions={[
          <>
            <Button
              onClick={onSelectSpot}
              type="primary"
              className={style.cardButton}
              block
            >
              OK
            </Button>
          </>,
        ]}
      >
        <Meta title={props.spot.name} description={props.spot.description} />
      </Card>
    </>
  );
};

export default SpotCard;
