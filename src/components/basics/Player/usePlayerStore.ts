import create from "zustand";

export type PlayerInfo = {
  multiplayConnect: boolean;
  multiplayAudio: boolean;
  multiplayGroupName?: string;
  multiplayPlayerId?: string;
  setMultiplayConnect: (val: boolean) => void;
  setMultiplayAudio: (val: boolean) => void;
  setMultiplayGroupName: (val: string | undefined) => void;
  setMultiplayPlayerId: (val: string) => void;
};

const usePlayerInfoStore = create<PlayerInfo>((set) => ({
  multiplayConnect: false,
  multiplayAudio: false,
  multiplayGroupName: "",
  multiplayPlayerId: "",
  setMultiplayConnect: (val: boolean) =>
    set((state) => ({ ...state, multiplayConnect: val })),
  setMultiplayAudio: (val: boolean) =>
    set((state) => ({ ...state, multiplayAudio: val })),
  setMultiplayGroupName: (val: string | undefined) =>
    set((state) => ({ ...state, multiplayGroupName: val })),
  setMultiplayPlayerId: (val: string) =>
    set((state) => ({ ...state, multiplayPlayerId: val })),
}));

export default usePlayerInfoStore;
