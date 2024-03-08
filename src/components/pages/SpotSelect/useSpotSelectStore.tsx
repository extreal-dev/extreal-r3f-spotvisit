import { SpotResponse } from "@/generated/model";
import create from "zustand";

export type SelectedSpotInfo = {
  spotInfo: SpotResponse | undefined;
  setSpotInfo: (arg: SpotResponse | undefined) => void;
};

const useSelectedSpotStore = create<SelectedSpotInfo>((set) => ({
  spotInfo: undefined,
  setSpotInfo: (selectedSpotInfo: SpotResponse | undefined) =>
    set(() => ({ spotInfo: selectedSpotInfo })),
}));

export default useSelectedSpotStore;
