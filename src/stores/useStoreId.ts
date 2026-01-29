import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface State {
  storeId: string | null;
}

interface Actions {
  setStoreId: (storeId: string) => void;
  clearStoreId: () => void;
}

export const useStoreId = create<State & Actions>()(
  persist(
    immer<State & Actions>((set) => ({
      storeId: null,
      setStoreId: (storeId: string) => {
        set({ storeId });
      },
      clearStoreId: () => {
        set({ storeId: null });
      },
    })),
    {
      name: "storeId",
      partialize: (state) => ({ storeId: state.storeId }),
    }
  ) as never
);