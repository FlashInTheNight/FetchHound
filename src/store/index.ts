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

export interface extentionStatus {
  status: "showList" | "downloading";
  setExtentionStatus: (status: "showList" | "downloading") => void;
}

export interface DownloadStatus {
  status: "downloaded" | "success" | "error";
  setDownloadStatus: (status: "downloaded" | "success" | "error") => void;
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

export interface SelectedItem {
  originalUrl: string;
  thumb: string | null;
  directUrl?: string;
  error?: string;
}

export interface SelectedState {
  selected: Map<string, SelectedItem>;
  setCheckedSelected: (item: MediaItem) => void;
  setUpdateSelected: (items: Map<string, SelectedItem>) => void;
  removeAllChecked: () => void;
  addAllChecked: (items: MediaItem[]) => void;
  getSelectedCount: () => number;
  getSelectedMapUrls: () => Map<string, SelectedItem>;
  getSelectedUrls: () => string[];
  getObjectSelectedUrls: () => Record<string, SelectedItem>;
}

export interface DownloadedReultState {
  urls: Record<string, SelectedItem>;
  setUrls: (urls: Record<string, SelectedItem>) => void;
  getUrls: () => Record<string, SelectedItem>;
  removeAllUrls: () => void;
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
  mode: "download",
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
  setCheckedSelected: (item) => {
    set((state) => {
      const m = new Map(state.selected);
      if (m.has(item.url)) {
        m.delete(item.url);
      } else {
        m.set(item.url, {
          originalUrl: item.url,
          thumb: item.thumb,
        });
      }
      return { selected: m };
    });
  },

  setUpdateSelected: (items) => {
    set({ selected: items });
  },

  removeAllChecked: () => {
    set({ selected: new Map() });
  },

  addAllChecked: (items: MediaItem[]) => {
    set((state) => {
      const m = new Map(state.selected);
      for (const item of items) {
        m.set(item.url, {
          originalUrl: item.url,
          thumb: item.thumb,
        });
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

  getObjectSelectedUrls: () => {
    return Object.fromEntries(get().selected);
  },
}));

export const useDownloadedResultStore = create<DownloadedReultState>()(
  (set, get) => ({
    urls: {
      "http://localhost:3001/media/17241582886691.mp4": {
        originalUrl: "http://localhost:3001/media/17241582886691.mp4",
        thumb: null,
      },
      "http://localhost:3001/media/video-1.webm": {
        originalUrl: "http://localhost:3001/media/video-1.webm",
        thumb: "http://localhost:3001/media/thumb/video-1-thumb.jpg",
      },
      "http://localhost:3001/media/image-1.jpg": {
        originalUrl: "http://localhost:3001/media/image-1.jpg",
        thumb: "http://localhost:3001/media/thumb/image-thumb-1.jpg",
      },
      "http://localhost:3001/base/3412": {
        originalUrl: "http://localhost:3001/base/3412",
        thumb: "http://localhost:3001/media/thumb/image-thumb-2.jpg",
        directUrl: "http://localhost:3001/media/image-2.jpg",
      },
      "http://localhost:3001/base/3425": {
        originalUrl: "http://localhost:3001/base/3425",
        thumb: "http://localhost:3001/media/thumb/video-thumb-2.jpg",
        directUrl: "../media/video-2.mp4",
        error: "Invalid URL",
      },
      "http://localhost:3001/ad/ad-1": {
        originalUrl: "http://localhost:3001/ad/ad-1",
        thumb: "http://localhost:3001/media/thumb/video-thumb-2.jpg",
        error: "No media items were found on this page.",
      },
      "http://localhost:3001/broken-link/bl-1": {
        originalUrl: "http://localhost:3001/broken-link/bl-1",
        thumb: "http://localhost:3001/media/thumb/video-thumb-2.jpg",
        error: "No media items were found on this page.",
      },
    },
    setUrls: (urls) => set({ urls }),
    getUrls: () => get().urls,
    removeAllUrls: () => set({ urls: {} }),
  })
);

export const useExtensionStatus = create<extentionStatus>()((set) => ({
  status: "downloading",
  setExtentionStatus: (status) => set({ status }),
}));

export const useDownloadStatus = create<DownloadStatus>()((set) => ({
  status: "error",
  setDownloadStatus: (status) => set({ status }),
}));
