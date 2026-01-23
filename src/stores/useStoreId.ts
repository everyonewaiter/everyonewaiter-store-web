import { create } from "zustand";

interface State {
  storeId: string | null;
}

interface Actions {
  setStoreId: (storeId: string) => void;
  clearStoreId: () => void;
}

export const useStoreId = create<State & Actions>((set) => ({
  storeId: localStorage.getItem("storeId") ?? null,
  setStoreId: (storeId: string) => {
    localStorage.setItem("storeId", storeId);
    set({ storeId });
  },
  clearStoreId: () => {
    localStorage.removeItem("storeId");
    set({ storeId: null });
  },
}));
