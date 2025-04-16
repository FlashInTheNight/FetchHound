import { MediaItem, scanFnType } from "../types";

/**
 * @description Функция scanImages ищет изображения на странице.
 * @returns {MediaItem[]} Возвращает массив объектов вида: [{ url: '...', thumb: '...' | null }]
 * @throws {Error} Если изображения не найдены, выбрасывает ошибку.
 */
export const scanImages: scanFnType = () => {
  const images: MediaItem[] = [];

  // Сканируем ссылки <a>, ведущие на видеофайлы
  const anchorElems: HTMLAnchorElement[] = Array.from(
    document.querySelectorAll(
      'a[href$=".jpg"], a[href$=".jpeg"], a[href$=".png"], a[href$=".webp"], a[href$=".gif"]'
    )
  );

  if (anchorElems.length === 0) {
    console.error("No images found in scanForImages fn");
    throw new Error("No images found");
  }

  // console
  console.log("anchroEl in images: ", anchorElems);

  anchorElems.forEach((a) => {
    const href = a.href;
    if (href && images.length < 21) {
      // Пытаемся получить миниатюру из вложенного <img>, если он есть
      const img = a.querySelector("img");
      const thumb = img ? img.src : null;
      let imageEl = images.find((v) => v.url === href);
      if (imageEl === undefined) {
        images.push({ url: href, thumb });
      }
      if (imageEl?.thumb === null && thumb !== null) {
        imageEl.thumb = thumb;
      }
    }
  });

  //console
  console.log("images: ", images);

  return images;
};
