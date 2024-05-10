import { Participant } from "livekit-client";
import create from "zustand";

export type ParticipantInfo = {
  playerId: string;
  participant: Participant;
};

export type ParticipantInfoMapStore = {
  items: Map<string, ParticipantInfo>;
  setItem: (value: ParticipantInfo, key: string) => string;
  getItem: (key: string) => ParticipantInfo | undefined;
  removeItem: (key: string) => void;
  clearItems: () => void;
};

const useParticipantInfoMapStore = create<ParticipantInfoMapStore>(
  (set, get) => ({
    items: new Map<string, ParticipantInfo>(),
    setItem: (value, key) => {
      const newKey = key;
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

export default useParticipantInfoMapStore;
