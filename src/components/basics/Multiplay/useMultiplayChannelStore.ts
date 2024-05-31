import { ConnectionState } from "livekit-client";
import create from "zustand";

export type MultiplayChannelStore = {
  isConnected: boolean;
  setConnected: (val: boolean) => void;
  connectStatus: ConnectionState;
  setConnectStatus: (val: ConnectionState) => void;
  groupName: string | undefined;
  playerId: string | undefined;
  setGroupName: (name: string | undefined) => void;
  setPlayerId: (name: string | undefined) => void;
  requestQueue: string[];
  responseQueue: string[];
  enqueueRequest: (item: string) => void;
  dequeueRequest: () => string | undefined;
  currentRequest: () => string | undefined;
  enqueueResponse: (item: string) => void;
  dequeueResponse: () => string | undefined;
  currentResponse: () => string | undefined;
  clearRequestQueue: () => void;
  clearResponseQueue: () => void;
};

const MAX_QUEUE_SIZE = 1000;

const limitQueueSize = (queue: string[], item: string) => {
  const newQueue = queue.concat(...queue, item);
  if (newQueue.length > MAX_QUEUE_SIZE) {
    const count = newQueue.length - MAX_QUEUE_SIZE;
    newQueue.splice(0, count);
    console.warn(
      "Queue size exceeds limit number " +
        MAX_QUEUE_SIZE +
        ", get rid of the first " +
        count +
        " elements.",
    );
  }
  return newQueue;
};

export const useMultiplayChannelStore = create<MultiplayChannelStore>(
  (set, get) => ({
    isConnected: false,
    connectStatus: ConnectionState.Disconnected,
    groupName: undefined,
    playerId: undefined,
    setConnected: (val: boolean) =>
      set((state) => ({ ...state, isConnected: val })),
    setConnectStatus: (val: ConnectionState) =>
      set((state) => ({ ...state, connectStatus: val })),
    setGroupName: (name: string | undefined) =>
      set((state) => ({ ...state, groupName: name })),
    setPlayerId: (name: string | undefined) =>
      set((state) => ({ ...state, playerId: name })),
    requestQueue: [],
    responseQueue: [],
    enqueueRequest: (item: string) => {
      if (get().isConnected) {
        set((state) => ({
          ...state,
          requestQueue: limitQueueSize(state.requestQueue, item),
        }));
      } else {
        console.debug(
          "Not connected, but attempt to enqueue a sending message.",
        );
      }
    },
    dequeueRequest: () => {
      const { requestQueue } = get();
      if (requestQueue.length === 0) {
        return undefined;
      }
      const item = requestQueue[0];
      set((state) => ({ ...state, requestQueue: state.requestQueue.slice(1) }));
      return item;
    },

    currentRequest: () => {
      return get().requestQueue[0];
    },
    enqueueResponse: (item: string) => {
      set((state) => ({
        ...state,
        responseQueue: limitQueueSize(state.responseQueue, item),
      }));
    },
    dequeueResponse: () => {
      const { responseQueue } = get();
      if (responseQueue.length === 0) {
        return undefined;
      }
      const item = responseQueue[0];
      set((state) => ({
        ...state,
        responseQueue: state.responseQueue.slice(1),
      }));
      return item;
    },
    currentResponse: () => {
      return get().responseQueue[0];
    },
    clearRequestQueue: () => {
      set((state) => ({ ...state, requestQueue: [] }));
    },
    clearResponseQueue: () => {
      set((state) => ({ ...state, responseQueue: [] }));
    },
  }),
);

export default useMultiplayChannelStore;
