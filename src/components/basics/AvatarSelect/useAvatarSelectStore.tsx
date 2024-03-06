import create from "zustand";
import { persist } from "zustand/middleware";

export type AvatarSelectInfo = {
  playerName: string;
  avatarType: string;
  setPlayerName: (arg: string) => void;
  setAvatarType: (arg: string) => void;
};

const useAvatarSelectStore = create(
  persist<AvatarSelectInfo>(
    (set) => ({
      playerName: "",
      avatarType: "",
      setPlayerName: (newName) =>
        set((state) => ({ ...state, playerName: newName })),
      setAvatarType: (newType) =>
        set((state) => ({ ...state, avatarType: newType })),
    }),
    {
      name: "avatarSelectState",
    },
  ),
);

export default useAvatarSelectStore;
