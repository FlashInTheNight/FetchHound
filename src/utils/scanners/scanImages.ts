import { type MediaItem, type scanFnType } from '../../types';

/**
 * Scans the page for image files and returns an array of found media items.
 *
 * @param {string[]} [excludedUrls=[]] - List of URLs to exclude from the results.
 * @returns {MediaItem[]} Returns an array of objects: [{ url: '...', thumb: '...' | null }]
 */
export const scanImages: scanFnType = (excludedUrls: string[] = []) => {
  const videoFormatRegex = /\.(mp4|webm|mov|ogg|m4v)(\?.*)?$/i;
  const imageRegex = /\.(jpg|jpeg|gif|webp|png)(\?.*)?$/i;

  const images: MediaItem[] = [];

  // 1. Scan <a> links that lead to image files. The item must have a link and either have an image extension in the link or contain an <img> element (used as a thumbnail). Second check: the link must not have a video extension.
  const anchors = Array.from(document.querySelectorAll<HTMLAnchorElement>('a')).filter(el => {
    const firstCheck =
      Boolean(el.href) && (imageRegex.test(el.href) || Boolean(el.querySelector('img')));

    const secondCheck = videoFormatRegex.test(el.href) === false;

    return firstCheck && secondCheck;
  });

  anchors.forEach(a => {
    // Try to get a thumbnail from a nested <img>, if present
    const img = a.querySelector('img');
    const thumb = img ? img.src : null;
    let imageEl = images.find(i => i.url === a.href);
    if (imageEl === undefined) {
      images.push({ url: a.href, thumb });
    }
    if (imageEl?.thumb === null && thumb !== null) {
      imageEl.thumb = thumb;
    }
  });

  // 2. Scan <figure> elements for images or links to images, excluding those with video extensions
  const figures = Array.from(document.querySelectorAll<HTMLImageElement>('figure')).filter(
    figure => {
      const aTag = figure.querySelector('a');
      return aTag && !videoFormatRegex.test(aTag.href);
    }
  );

  for (const figure of figures) {
    const link = figure.querySelector('a');
    const img = figure.querySelector('img');

    const isPreviouslyFound = images.some(i => i.url === link?.href || i.thumb === img?.src);

    if (isPreviouslyFound) {
      continue;
    }

    if (link && link.href) {
      const href = link.href;
      const thumb = img ? img.src : null;
      images.push({ url: href, thumb });
    } else if (img && img.src) {
      const href = img.src;
      const thumb = img.src;
      images.push({ url: href, thumb });
    }
  }

  if (excludedUrls.length === 0) {
    return images;
  }
  const removeSet = new Set(excludedUrls);
  const result = images.filter(image => !removeSet.has(image.url));

  return result;
};
