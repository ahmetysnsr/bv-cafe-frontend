import { create } from 'zustand';

interface NetworkState {
  isDown: boolean;
  setDown: (status: boolean) => void;
}

export const useNetworkStore = create<NetworkState>((set) => ({
  isDown: false,
  setDown: (status) => set({ isDown: status }),
}));
