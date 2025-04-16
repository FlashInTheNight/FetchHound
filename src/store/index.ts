import { create } from "zustand";
import { MediaItem } from "../types";

// Интерфейсы для сторов
export interface TabState {
  activeTab: "videos" | "images";
  setActiveTab: (tab: "videos" | "images") => void;
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
  selected: Record<string, boolean> | {};
  setSelected: (selectedStack: Record<string, boolean>) => void;
}

  // const [selected, setSelected] = useState<Record<string, boolean>>({});

// const [videos, setVideos] = useState<ScanResponse[]>([]);
// export interface MediaState {
//   selectedMedia: string[];
//   addMedia: (mediaId: string) => void;
//   removeMedia: (mediaId: string) => void;
// }

// Создание Zustand store для управления активной вкладкой
export const useTabStore = create<TabState>()((set) => ({
  activeTab: "videos",
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

export const useSelectedStore = create<SelectedState>()((set) => ({
  selected: {},
  setSelected: (selectedStack) => set({ selected: selectedStack }),
}));

// export const useMediaStore = create<MediaState>()((set) => ({
//   selectedMedia: [],
//   addMedia: (mediaId) =>
//     set((state) => ({
//       selectedMedia: [...state.selectedMedia, mediaId]
//     })),
//   removeMedia: (mediaId) =>
//     set((state) => ({
//       selectedMedia: state.selectedMedia.filter(id => id !== mediaId)
//     })),
// }));
