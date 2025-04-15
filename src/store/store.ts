import { create } from "zustand";

// Интерфейсы для сторов
export interface TabState {
  activeTab: "videos" | "images";
  setActiveTab: (tab: "videos" | "images") => void;
}

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
