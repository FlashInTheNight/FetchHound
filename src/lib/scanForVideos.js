/**
 * Функция scanForVideos ищет видеофайлы на странице.
 * Возвращает массив объектов вида:
 * [{ url: '...', thumb: '...' | null }]
 */
export function scanForVideos() {
  const videos = [];

  // 1. Сканируем элементы <video>
  // const videoElems = Array.from(document.querySelectorAll("video"));
  // videoElems.forEach((video) => {
  //   // Если <video> имеет атрибут src
  //   let videoUrl = video.getAttribute("src");
  //   if (!videoUrl) {
  //     // Если нет, ищем первый дочерний элемент <source>
  //     const sourceElem = video.querySelector("source");
  //     if (sourceElem) {
  //       videoUrl = sourceElem.getAttribute("src");
  //     }
  //   }
  //   if (
  //     videoUrl &&
  //     (videoUrl.endsWith(".mp4") || videoUrl.endsWith(".webm"))
  //   ) {
  //     videos.push({
  //       url: videoUrl,
  //       thumb: video.getAttribute("poster") || null,
  //     });
  //   }
  // });

  // 2. Сканируем отдельные элементы <source> (если они не были найдены внутри <video>)
  // const sourceElems = Array.from(document.querySelectorAll("source"));
  // sourceElems.forEach((source) => {
  //   // Фильтруем по типу, если он содержит слово "video"
  //   const typeAttr = source.getAttribute("type") || "";
  //   if (typeAttr.includes("video")) {
  //     const src = source.getAttribute("src");
  //     if (src && (src.endsWith(".mp4") || src.endsWith(".webm"))) {
  //       if (!videos.some((v) => v.url === src)) {
  //         videos.push({ url: src, thumb: null });
  //       }
  //     }
  //   }
  // });

  // 3. Сканируем ссылки <a>, ведущие на видеофайлы
  const anchorElems = Array.from(document.querySelectorAll('a[href$=".mp4"], a[href$=".webm"]'));
  anchorElems.forEach((a) => {
    const href = a.href;
    if (href && videos.length < 20) {
      // Пытаемся получить миниатюру из вложенного <img>, если он есть
      const img = a.querySelector("img");
      const thumb = img ? img.src : null;
      let videoEl = videos.find((v) => v.url === href)
      if (videoEl === undefined) {
        videos.push({ url: href, thumb });
      }
      if(videoEl?.thumb === null && thumb !== null) {
        videoEl.thumb = thumb
      }
    }
  });

  return videos;
}
