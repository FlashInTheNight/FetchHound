import { type MediaItem, type scanFnType } from '../../types';

/**
 * Scans the page for video files and returns an array of found media items.
 *
 * @param {string[]} [excludedUrls=[]] - List of URLs to exclude from the results.
 * @returns {MediaItem[]} An array of objects: [{ url: '...', thumb: '...' | null }], or an empty array if no videos are found.
 */
export const scanVideos: scanFnType = (excludedUrls: string[] = []) => {
  const videos: MediaItem[] = [];

  // Regular expression to check for video files (supports query parameters)
  const videoRegex = /\.(mp4|webm|mov)(\?.*)?$/i;
  const imageRegex = /\.(jpg|jpeg|gif|webp|png)(\?.*)?$/i;

  const normalizeUrl = (url: string): string => {
    try {
      const urlObj = new URL(url);
      // Remove query parameters and hash
      urlObj.search = '';
      urlObj.hash = '';
      return urlObj.toString();
    } catch {
      return url;
    }
  };

  // Create a Set of normalized excluded URLs
  const normalizedExcludedUrls = new Set(excludedUrls.map(normalizeUrl));

  // Function to check if a URL should be excluded
  const shouldExclude = (url: string): boolean => {
    return normalizedExcludedUrls.has(normalizeUrl(url));
  };

  // 1. Scan <video> elements
  const videoElems = Array.from(document.querySelectorAll('video'));
  videoElems.forEach(video => {
    let videoUrl = video.getAttribute('src');
    if (!videoUrl) {
      const sourceElem = video.querySelector('source');
      if (sourceElem) {
        videoUrl = sourceElem.getAttribute('src');
      }
    }
    if (videoUrl && videoRegex.test(videoUrl) && !shouldExclude(videoUrl)) {
      videos.push({
        url: videoUrl,
        thumb: video.getAttribute('poster') || null,
      });
    }
  });

  // 2. Scan <a> links that lead to video files
  const anchorElems: HTMLAnchorElement[] = Array.from(document.querySelectorAll('a')).filter(el => {
    const firstCheck =
      Boolean(el.href) && (videoRegex.test(el.href) || Boolean(el.querySelector('img')));

    const secondCheck = imageRegex.test(el.href) === false;

    return firstCheck && secondCheck && !shouldExclude(el.href);
  });

  anchorElems.forEach(a => {
    // Try to get a thumbnail from a nested <img>, if present
    const img = a.querySelector('img');
    const thumb = img ? img.src : null;
    let videoEl = videos.find(v => v.url === a.href);
    if (videoEl === undefined) {
      videos.push({ url: a.href, thumb });
    }
    if (videoEl?.thumb === null && thumb !== null) {
      videoEl.thumb = thumb;
    }
  });

  return videos;
};
