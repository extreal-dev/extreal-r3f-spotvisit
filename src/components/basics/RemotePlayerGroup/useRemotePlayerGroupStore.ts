import { CharacterController } from "@/hooks/usePlayerInput";
import MultiplayUtil from "@/libs/util/MultiplayUtil";
import create from "zustand";

export type RemotePlayerInfo = {
  playerId: string;
  playerName: string;
  avatarType: string;
  motion: string;
  controller?: CharacterController;
  position?: THREE.Vector3;
  rotation?: THREE.Euler;
  spotKey?: string;
};

export type RemotePlayerInfoMapStore = {
  items: Map<string, RemotePlayerInfo>;
  setItem: (value: RemotePlayerInfo, key?: string) => string;
  getItem: (key: string) => RemotePlayerInfo | undefined;
  removeItem: (key: string) => void;
  clearItems: () => void;
};

const useRemotePlayerInfoMapStore = create<RemotePlayerInfoMapStore>(
  (set, get) => ({
    items: new Map<string, RemotePlayerInfo>(),
    setItem: (value, key?) => {
      const newKey = key ?? MultiplayUtil.generateShortUUID();
      const items = get().items;
      items.set(newKey, value);
      set({ items });
      return newKey;
    },
    getItem: (key) => {
      const items = get().items;
      return items.get(key);
    },
    removeItem: (key) => {
      set((state) => {
        const newItems = new Map(state.items);
        newItems.delete(key);
        return { items: newItems };
      });
    },
    clearItems: () => {
      set({ items: new Map() });
    },
  }),
);

export default useRemotePlayerInfoMapStore;
