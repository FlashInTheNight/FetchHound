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
  const videoTagRegex = /[?&]tags=video/;

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

  // 2. Сканируем отдельные элементы <source> (если они не были найдены внутри <video>)
  // const sourceElems = Array.from(document.querySelectorAll("source"));
  // sourceElems.forEach((source) => {
  //   const typeAttr = source.getAttribute("type") || "";
  //   if (typeAttr.includes("video")) {
  //     const src = source.getAttribute("src");
  //     if (src && videoRegex.test(src)) {
  //       if (!videos.some((v) => v.url === src)) {
  //         videos.push({ url: src, thumb: null });
  //       }
  //     }
  //   }
  // });

  // 3. Сканируем ссылки <a>, ведущие на видеофайлы
  const anchorElems: HTMLAnchorElement[] = Array.from(
    document.querySelectorAll("a")
  ); // optimize: лучшер сразу отфильтровать по videoRegex

  anchorElems.forEach((a) => {
    const href = a.href;
    const isValidRegCheck = videoRegex.test(href) || videoTagRegex.test(href);
    if (href && isValidRegCheck) {
      // Пытаемся получить миниатюру из вложенного <img>, если он есть
      // optimize: возможно стоит поменять массив на другую структуру данных
      const img = a.querySelector("img");
      const thumb = img ? img.src : null;
      console.log("thumb", thumb);
      let videoEl = videos.find((v) => v.url === href);
      if (videoEl === undefined) {
        videos.push({ url: href, thumb });
      }
      if (videoEl?.thumb === null && thumb !== null) {
        videoEl.thumb = thumb;
      }
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
