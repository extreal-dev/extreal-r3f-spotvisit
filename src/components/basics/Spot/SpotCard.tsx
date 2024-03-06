import { SpotResponse } from "@/generated/model";

export type SpotCardProps = {
  spot: SpotResponse;
};

// Sample Implementation - will be replaced.
const SpotCard = (props: SpotCardProps) => {
  const spot = props.spot;
  return <li>{spot.name}</li>;
};

export default SpotCard;
