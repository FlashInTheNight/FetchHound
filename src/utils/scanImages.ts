import { MediaItem, scanFnType } from '../types';

/**
 * @description Функция scanImages ищет изображения на странице.
 * @returns {MediaItem[]} Возвращает массив объектов вида: [{ url: '...', thumb: '...' | null }]
 */

export const scanImages: scanFnType = (excludedUrls: string[] = []) => {
  const videoFormatRegex = /\.(mp4|webm|mov|ogg|m4v)(\?.*)?$/i;
  const imageRegex = /\.(jpg|jpeg|gif|webp|png)(\?.*)?$/i;

  const images: MediaItem[] = [];

  const anchors = Array.from(document.querySelectorAll<HTMLAnchorElement>('a')).filter(el => {
    const firstCheck =
      Boolean(el.href) && (imageRegex.test(el.href) || Boolean(el.querySelector('img')));

    const secondCheck = videoFormatRegex.test(el.href) === false;

    return firstCheck && secondCheck;
  });

  anchors.forEach(a => {
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
