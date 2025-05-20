import { scanFnType } from '../../types';

/**
 * Scans the page for both images and videos and returns an array of found media items.
 *
 * @param {string[]} [excludedUrls=[]] - List of URLs to exclude from the results.
 * @returns {MediaItem[]} Returns an array of objects: [{ url: '...', thumb: '...' | null }]
 */
export const scanAll: scanFnType = (excludedUrls: string[] = []) => {
  const media = new Map<string, string | null>();
  // Regular expression to check for direct media links
  const DIRECT_MEDIA_URL_PATTERN = /\.(mp4|webm|mkv|avi|mov|jpg|jpeg|png|gif|webp)(?:\?[^/]*)?$/i;

  // 1. Scan <video> elements
  const videoElems: HTMLVideoElement[] = Array.from(document.querySelectorAll('video'));
  videoElems.forEach(video => {
    let videoUrl = video.getAttribute('src');
    if (!videoUrl) {
      const sourceElem = video.querySelector('source');
      if (sourceElem) {
        videoUrl = sourceElem.getAttribute('src');
      }
    }
    if (videoUrl) {
      media.set(videoUrl, video.getAttribute('poster'));
    }
  });

  // 2. Scan <a> links that lead to media files
  const anchorElems: HTMLAnchorElement[] = Array.from(document.querySelectorAll('a')).filter(
    el =>
      Boolean(el.href) &&
      (DIRECT_MEDIA_URL_PATTERN.test(el.href) || Boolean(el.querySelector('img')))
  );

  for (const anchor of anchorElems) {
    const img = anchor.querySelector('img');
    const thumb = img ? img.src : null;
    media.set(anchor.href, thumb);
  }

  // 3. Scan <figure> elements for images or links to images
  const figures = Array.from(document.querySelectorAll<HTMLImageElement>('figure'));

  for (const figure of figures) {
    const link = figure.querySelector('a');
    const img = figure.querySelector('img');

    const isPreviouslyFound =
      link?.href && (media.has(link?.href) || media.get(link?.href) === img?.src);

    if (isPreviouslyFound) {
      continue;
    }

    const thumb = img ? img.src : null;
    if (link && link.href) {
      media.set(link.href, thumb);
    }
  }

  if (excludedUrls.length > 0) {
    excludedUrls.forEach(url => media.delete(url));
  }

  // Convert to array of objects
  const resultArray = Array.from(media, ([urlValue, thumbValue]) => {
    return { url: urlValue, thumb: thumbValue };
  });

  return resultArray;
};
