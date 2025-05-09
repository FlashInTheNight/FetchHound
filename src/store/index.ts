import { create } from "zustand";
import { MediaItem } from "../types";

// Интерфейсы для сторов
export interface TabState {
  activeTab: "all" | "videos" | "images";
  setActiveTab: (tab: "all" | "videos" | "images") => void;
}

export interface MediaState {
  mediaItems: MediaItem[] | [];
  setMediaItems: (media: MediaItem[] | []) => void;
}

export interface LoadingState {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export interface ErrorState {
  error: string;
  setError: (error: string) => void;
}

export interface SelectedState {
  selected: Map<string, boolean>;
  setCheckedSelected: (url: string) => void;
  removeAllChecked: () => void;
  addAllChecked: (items: MediaItem[]) => void;
  getSelectedCount: () => number;
  getSelectedUrls: () => string[];
}

export const useTabStore = create<TabState>()((set) => ({
  activeTab: "all",
  setActiveTab: (tab) => set({ activeTab: tab }),
}));

export const useMediaStore = create<MediaState>()((set) => ({
  mediaItems: [],
  setMediaItems: (media) => set({ mediaItems: media }),
}));

export const useLoadingStore = create<LoadingState>()((set) => ({
  loading: false,
  setLoading: (loading) => set({ loading }),
}));

export const useErrorStore = create<ErrorState>()((set) => ({
  error: "",
  setError: (error) => set({ error }),
}));

export const useSelectedStore = create<SelectedState>()((set, get) => ({
  selected: new Map(),

  setCheckedSelected: (url: string) => {
    set((state) => {
      const m = new Map(state.selected);
      if (m.has(url)) {
        m.delete(url);
      } else {
        m.set(url, true);
      }
      return { selected: m };
    });
  },

  removeAllChecked: () => {
    set({ selected: new Map() });
  },

  addAllChecked: (items: MediaItem[]) => {
    set((state) => {
      const m = new Map(state.selected);
      for (const item of items) {
        m.set(item.url, true);
      }
      return { selected: m };
    });
  },

  getSelectedCount: () => {
    return get().selected.size;
  },

  getSelectedUrls: () => {
    return Array.from(get().selected.keys());
  },
}));
