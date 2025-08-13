import { create } from "zustand";
import { persist } from "zustand/middleware";

interface StoreState {
  isLoggedIn: boolean;
  id: string;
  setId: (id: string) => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}

const useStore = create<StoreState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      id: "",
      setId: (id) => set({ id }),
      setIsLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
    }),
    {
      name: "auth-storage", // key in localStorage
    }
  )
);

export default useStore;
