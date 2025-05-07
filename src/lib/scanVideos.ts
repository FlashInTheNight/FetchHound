import { MediaItem, scanFnType } from "../types";

/**
 * @description Функция scanVideos ищет видеофайлы на странице.
 * @returns {MediaItem[] | []} Возвращает массив объектов вида: [{ url: '...', thumb: '...' | null }] или пустой массив, если видео не найдены.
 */
export const scanVideos: scanFnType = () => {
  const videos: MediaItem[] = [];

  // Регулярное выражение для проверки видеофайлов (учитывает query-параметры)
  // Это регулярное выражение проверяет, что URL заканчивается на .mp4 или .webm, даже если за ним следуют query-параметры (например, ?token=abc123).
  const videoRegex = /\.(mp4|webm|mov)(\?.*)?$/i;
  const imageRegex = /\.(jpg|jpeg|gif|webp|png)(\?.*)?$/i;
  // const videoTagRegex = /[?&]s=view/;

  // 1. Сканируем элементы <video>
  const videoElems = Array.from(document.querySelectorAll("video"));
  videoElems.forEach((video) => {
    let videoUrl = video.getAttribute("src");
    if (!videoUrl) {
      const sourceElem = video.querySelector("source");
      if (sourceElem) {
        videoUrl = sourceElem.getAttribute("src");
      }
    }
    if (videoUrl && videoRegex.test(videoUrl)) {
      videos.push({
        url: videoUrl,
        thumb: video.getAttribute("poster") || null,
      });
    }
  });

  // 3. Сканируем ссылки <a>, ведущие на видеофайлы, фильтруем так: итем должен иметь ссылку и 1) либо иметь расширение в ссылке 2) либо иметь HTML элемент img(щитаем её как миниатюру). Второй этап - ссылка не должна содержать расширение пикчи
  const anchorElems: HTMLAnchorElement[] = Array.from(
    document.querySelectorAll("a")
  ).filter((el) => {
    const firstCheck =
      Boolean(el.href) &&
      (videoRegex.test(el.href) || Boolean(el.querySelector("img")));

    const secondCheck = imageRegex.test(el.href) === false;

    return firstCheck && secondCheck;
  });

  anchorElems.forEach((a) => {
    // Пытаемся получить миниатюру из вложенного <img>, если он есть
    // optimize: возможно стоит поменять массив на другую структуру данных
    const img = a.querySelector("img");
    const thumb = img ? img.src : null;
    let videoEl = videos.find((v) => v.url === a.href);
    if (videoEl === undefined) {
      videos.push({ url: a.href, thumb });
    }
    if (videoEl?.thumb === null && thumb !== null) {
      videoEl.thumb = thumb;
    }
  });

  // 3. Сканируем <article> элементы для reddit с атрибутами content-href и poster
  if (window.location.hostname.includes("reddit.com")) {
    const articleElems = Array.from(document.querySelectorAll("article"));
    articleElems.forEach((article) => {
      const shredditPost = article.querySelector("shreddit-post");
      const articleType = shredditPost?.getAttribute("post-type") || "";
      if (!articleType.includes("video") || shredditPost === null) return; // Пропускаем, если тип не видео

      const videoUrl = shredditPost?.getAttribute("content-href");
      const playerHost = article.querySelector("shreddit-player-2");
      const thumb = playerHost?.getAttribute("poster") || null;

      if (videoUrl) {
        let videoEl = videos.find((v) => v.url === videoUrl);
        if (videoEl === undefined) {
          videos.push({ url: videoUrl, thumb });
        }
        if (videoEl?.thumb === null && thumb !== null) {
          videoEl.thumb = thumb;
        }
      }
    });
  }

  return videos;
};
