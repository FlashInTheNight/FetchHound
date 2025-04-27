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

  return images;
};

export const scanImages_old_version: scanFnType = () => {
  const images: MediaItem[] = [];

  // Сканируем ссылки <a>, ведущие на видеофайлы
  const anchorElems: HTMLAnchorElement[] = Array.from(
    document.querySelectorAll(
      'a[href$=".jpg"], a[href$=".jpeg"], a[href$=".png"], a[href$=".webp"], a[href$=".gif"]'
    )
  );

  // console
  console.log("anchroEl in images: ", anchorElems);

  anchorElems.forEach((a) => {
    const href = a.href;
    if (href) {
      // Пытаемся получить миниатюру из вложенного <img>, если он есть
      const img = a.querySelector("img");
      const thumb = img ? img.src : null;
      let imageEl = images.find((v) => v.url === href);
      if (imageEl === undefined) {
        images.push({ url: href, thumb });
      } else if (imageEl?.thumb === null && thumb !== null) {
        imageEl.thumb = thumb;
      }
    }
  });

  //console
  // console.log("images: ", images);

  return images;
};
