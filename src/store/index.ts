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
  selected: Record<string, boolean>;
  setCheckedSelected: (selectedItem: string) => void;
  setAllSelected: () => void;
  setNoneSelected: () => void;
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
  mediaItems: [
    {
      thumb: "https://2ch.hk/media/thumb/951499/17231027716050s.jpg",
      url: "https://2ch.hk/media/src/951499/17231027716050.webm",
    },
    {
      thumb: "https://2ch.hk/media/thumb/951499/17231916106760s.jpg",
      url: "https://2ch.hk/media/src/951499/17231916106760.mp4",
    },
    {
      thumb: "https://2ch.hk/media/thumb/951499/17232546396890s.jpg",
      url: "https://2ch.hk/media/src/951499/17232546396890.webm",
    },
    {
      thumb: "https://2ch.hk/media/thumb/951499/17232546397351s.jpg",
      url: "https://2ch.hk/media/src/951499/17232546397351.webm",
    },
    {
      thumb: "https://2ch.hk/media/thumb/951499/17232546397702s.jpg",
      url: "https://2ch.hk/media/src/951499/17232546397702.webm",
    },
    {
      thumb: "https://2ch.hk/media/thumb/951499/17232546398403s.jpg",
      url: "https://2ch.hk/media/src/951499/17232546398403.webm",
    },
    {
      thumb: "https://2ch.hk/media/thumb/951499/17232827412000s.jpg",
      url: "https://2ch.hk/media/src/951499/17232827412000.mp4",
    },
    {
      thumb: "https://2ch.hk/media/thumb/951499/17232827412851s.jpg",
      url: "https://2ch.hk/media/src/951499/17232827412851.mp4",
    },
    {
      thumb: "https://2ch.hk/media/thumb/951499/17232832716920s.jpg",
      url: "https://2ch.hk/media/src/951499/17232832716920.webm",
    },
    {
      thumb: "https://2ch.hk/media/thumb/951499/17234261692220s.jpg",
      url: "https://2ch.hk/media/src/951499/17234261692220.webm",
    },
    {
      thumb: "https://2ch.hk/media/thumb/951499/17234261693461s.jpg",
      url: "https://2ch.hk/media/src/951499/17234261693461.webm",
    },
    {
      thumb: "https://2ch.hk/media/thumb/951499/17235061889970s.jpg",
      url: "https://2ch.hk/media/src/951499/17235061889970.mp4",
    },
    {
      thumb: "https://2ch.hk/media/thumb/951499/17235061890511s.jpg",
      url: "https://2ch.hk/media/src/951499/17235061890511.mp4",
    },
    {
      thumb: "https://2ch.hk/media/thumb/951499/17235061891112s.jpg",
      url: "https://2ch.hk/media/src/951499/17235061891112.mp4",
    },
    {
      thumb: "https://2ch.hk/media/thumb/951499/17236260791580s.jpg",
      url: "https://2ch.hk/media/src/951499/17236260791580.mp4",
    },
    {
      thumb: "https://2ch.hk/media/thumb/951499/17236406126460s.jpg",
      url: "https://2ch.hk/media/src/951499/17236406126460.mp4",
    },
    {
      thumb: "https://2ch.hk/media/thumb/951499/17237143032540s.jpg",
      url: "https://2ch.hk/media/src/951499/17237143032540.mp4",
    },
    {
      thumb: "https://2ch.hk/media/thumb/951499/17237143033051s.jpg",
      url: "https://2ch.hk/media/src/951499/17237143033051.mp4",
    },
    {
      thumb: "https://2ch.hk/media/thumb/951499/17237143033452s.jpg",
      url: "https://2ch.hk/media/src/951499/17237143033452.mp4",
    },
    {
      thumb: "https://2ch.hk/media/thumb/951499/17237143033873s.jpg",
      url: "https://2ch.hk/media/src/951499/17237143033873.mp4",
    },
    {
      thumb: null,
      url: "https://2ch.hk/media/src/951499/17237318262490.mp4",
    },
  ],
  setMediaItems: (media) => set({ mediaItems: media }),
}));

export const useLoadingStore = create<LoadingState>()((set) => ({
  loading: true,
  setLoading: (loading) => set({ loading }),
}));

export const useErrorStore = create<ErrorState>()((set) => ({
  error: "",
  setError: (error) => set({ error }),
}));

export const useSelectedStore = create<SelectedState>()((set) => ({
  selected: {},
  setCheckedSelected: (selectedItem) =>
    set((state) => ({
      selected: {
        ...state.selected,
        [selectedItem]:
          state.selected[selectedItem] !== undefined
            ? !state.selected[selectedItem]
            : true,
      },
    })),
  setAllSelected: () =>
    set((state) => ({
      selected: Object.fromEntries(
        Object.keys(state.selected).map((key) => [key, true])
      ),
    })),
  setNoneSelected: () =>
    set((state) => ({
      selected: Object.fromEntries(
        Object.keys(state.selected).map((key) => [key, false])
      ),
    })),
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
