import { create } from "zustand";
import { MediaItem } from "../types";
import { testData } from "../test-data";

// Интерфейсы для сторов
export interface MediaListModeState {
  activeMode: "normal" | "exclude";
  setMode: (mode: "normal" | "exclude") => void;
}

export interface extentionMode {
  mode: "scan" | "download";
  getMode: () => "scan" | "download";
  setExtMode: (mode: "scan" | "download") => void;
}

export interface TabState {
  activeTab: "all" | "videos" | "images";
  setActiveTab: (tab: "all" | "videos" | "images") => void;
}

export interface MediaState {
  mediaItems: MediaItem[] | [];
  setMediaItems: (media: MediaItem[] | []) => void;
  getMediaItems: () => MediaItem[] | [];
}

export interface LoadingState {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export interface ErrorState {
  error: string;
  additionalError: string;
  setAdditionalError: (error: string) => void;
  getError: () => string;
  setError: (error: string) => void;
}

export interface SelectedState {
  selected: Map<string, boolean>;
  setCheckedSelected: (url: string) => void;
  removeAllChecked: () => void;
  addAllChecked: (items: MediaItem[]) => void;
  getSelectedCount: () => number;
  getSelectedMapUrls: () => Map<string, boolean>;
  getSelectedUrls: () => string[];
}

export const useMediaListMode = create<MediaListModeState>()((set) => ({
  activeMode: "normal",
  setMode: (mode) => set({ activeMode: mode }),
}));

export const useTabStore = create<TabState>()((set) => ({
  activeTab: "all",
  setActiveTab: (tab) => set({ activeTab: tab }),
}));

export const useMediaStore = create<MediaState>()((set, get) => ({
  mediaItems: testData,
  setMediaItems: (media) => set({ mediaItems: media }),
  getMediaItems: () => get().mediaItems,
}));

export const useExtensionMode = create<extentionMode>()((set, get) => ({
  mode: "scan",
  getMode: () => get().mode,
  setExtMode: (mode) => set({ mode }),
}));

export const useLoadingStore = create<LoadingState>()((set) => ({
  loading: false,
  setLoading: (loading) => set({ loading }),
}));

export const useErrorStore = create<ErrorState>()((set, get) => ({
  error: "",
  additionalError: "",
  setAdditionalError: (error) => set({ additionalError: error }),
  getError: () => get().error,
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

  getSelectedMapUrls: () => {
    return get().selected;
  },

  getSelectedUrls: () => {
    return Array.from(get().selected.keys());
  },
}));
