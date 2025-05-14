// Тип для найденного видео
export interface MediaItem {
  url: string;
  thumb: string | null;
  error?: string;
}

export type scanFnType = (excludedUrls: string[] | []) => MediaItem[];

export interface MediaSearchResult {
  url: string;
  error?: string;
  // relativeUrl?: string;
}

export interface ScanDirectLinkResult {
  url: string | null;
  error?: string;
}
