import usePlayerInfoStore from "@/components/basics/Player/usePlayerStore";
import { SpotResponse } from "@/generated/model";
import { Button, Card } from "antd";
import style from "./SpotCard.module.css";

export type SpotCardProps = {
  spot: SpotResponse;
};

const SpotCard = (props: SpotCardProps) => {
  const spot = props.spot;
  const playerInfo = usePlayerInfoStore();
  const onSelectSpot = () => {
    playerInfo.setSpotInfo(props.spot);
  };

  return (
    <div className={style.cardArea}>
      <Card
        className={style.card}
        cover={<img alt="thumbnail" src={spot.thumbnailImageUrl} />}
      >
        <p className={style.cardTitle}>{props.spot.name}</p>
        <p className={style.cardBody}>{props.spot.description}</p>
        <div className={style.cardButtonArea}>
          <Button
            onClick={onSelectSpot}
            type="primary"
            className={style.cardButton}
            block
          >
            Visit
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SpotCard;
