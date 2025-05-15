// Тип для найденного видео
export interface MediaItem {
  url: string;
  thumb: string | null;
}

export type scanFnType = (excludedUrls: string[] | []) => MediaItem[];

export interface MediaSearchResult {
  url: string;
  error?: string;
  directUrl?: string;
}

export interface ScanDirectLinkResult {
  directUrl: string | null;
  error?: string;
}
