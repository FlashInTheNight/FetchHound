import { scanFnType } from '../types';

/**
 * @description Функция scanAll ищет изображения и видео на странице.
 * @returns {MediaItem[] | []} Возвращает массив объектов вида: [{ url: '...', thumb: '...' | null }]
 */
export const scanAll: scanFnType = (excludedUrls: string[] = []) => {
  const media = new Map<string, string | null>();
  // Регулярное выражение для проверки прямых ссылок на медиафайлы
  const DIRECT_MEDIA_URL_PATTERN = /\.(mp4|webm|mkv|avi|mov|jpg|jpeg|png|gif|webp)(?:\?[^/]*)?$/i;

  // 1. Сканируем элементы <video>
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
      // const poster = video.getAttribute("poster")
      //   ? video.getAttribute("poster")
      //   : null;
      media.set(videoUrl, video.getAttribute('poster'));
    }
  });

  // 2. Сканируем ссылки <a>, ведущие на медиа
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

  // 3. Сканируем иллюстрации
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

  // Преобразование в массив объектов
  const resultArray = Array.from(media, ([urlValue, thumbValue]) => {
    return { url: urlValue, thumb: thumbValue };
  });

  return resultArray;
};
