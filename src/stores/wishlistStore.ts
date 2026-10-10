import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface WishlistStore {
  handles: string[];
  toggle: (handle: string) => boolean;
  has: (handle: string) => boolean;
}

export const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      handles: [],
      toggle: (h) => {
        const on = get().handles.includes(h);
        set({ handles: on ? get().handles.filter((x) => x !== h) : [...get().handles, h] });
        return !on;
      },
      has: (h) => get().handles.includes(h),
    }),
    { name: "savera-wishlist", storage: createJSONStorage(() => localStorage) },
  ),
);
