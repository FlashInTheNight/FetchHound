import { MediaItem, MediaSearchResult } from "../types";

export const getSortedDirectUrls = (
  directUrls: MediaSearchResult[],
  mediaItems: MediaItem[]
) => {
  const urlsWithError: MediaItem[] = [];
  const urlsForDownload: string[] = [];

  const mediaMap = new Map<string, MediaItem>();
  for (const item of mediaItems) {
    mediaMap.set(item.url, item);
  }

  for (const urlObj of directUrls) {
    if (Object.hasOwn(urlObj, "error")) {
      const item = mediaMap.get(urlObj.url);
      if (item) {
        urlsWithError.push({ ...item, error: urlObj.error });
      }
    } else {
      urlsForDownload.push(urlObj.url);
    }
  }

  return { urlsWithError, urlsForDownload };
};
