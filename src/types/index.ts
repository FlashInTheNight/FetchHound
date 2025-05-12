// Тип для найденного видео
export interface MediaItem {
  url: string;
  thumb: string | null;
}

export type scanFnType = (excludedUrls: string[] | []) => MediaItem[];
