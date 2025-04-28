import { MediaItem, scanFnType } from "../types";

/**
 * @description Функция scanImages ищет изображения на странице.
 * @returns {MediaItem[]} Возвращает массив объектов вида: [{ url: '...', thumb: '...' | null }]
 */

export const scanImages: scanFnType = () => {
  const videoFormatRegex = /\.(mp4|webm|mov|ogg|m4v)(\?.*)?$/i;

  const anchors = Array.from(
    document.querySelectorAll<HTMLAnchorElement>("a")
  ).filter(
    (a) => !!a.querySelector("img") && videoFormatRegex.test(a.href) === false
  );

  if (anchors.length === 0) {
    return [];
  }

  const images: MediaItem[] = [];
  anchors.forEach((a) => {
    const href = a.href;
    if (href) {
      const img = a.querySelector("img");
      const thumb = img ? img.src : null;
      images.push({ url: href, thumb });
    }
  });

  const figures = Array.from(
    document.querySelectorAll<HTMLImageElement>("figure")
  );
  figures.forEach((figure) => {
    const link = figure.querySelector("a");
    const img = figure.querySelector("img");

    if (link && link.href) {
      const href = link.href;
      const thumb = img ? img.src : null;
      images.push({ url: href, thumb });
    } else if (img && img.src) {
      const href = img.src;
      const thumb = img.src;
      images.push({ url: href, thumb });
    }
  });

  return images;
};
