import { type ScanDirectLinkResult } from '../../types';

export const findUnknownMediaLink = (): ScanDirectLinkResult => {
  const IMAGES_IDS = ['image', 'wallpaper'];
  const DIRECT_MEDIA_URL_PATTERN = /\.(mp4|webm|mkv|avi|mov|jpg|jpeg|png|gif|webp)(?:\?[^/]*)?$/i;

  const videoTag = document.querySelector('video[id]');
  if (videoTag) {
    const [video] = [videoTag];
    let videoUrl = video.getAttribute('src');
    if (!videoUrl) {
      const sourceElem = video.querySelector('source');
      if (sourceElem) {
        videoUrl = sourceElem.getAttribute('src');
      }
    }
    if (videoUrl) {
      return { directUrl: videoUrl };
    }
  }

  const images = Array.from(document.querySelectorAll('img'));

  for (const img of images) {
    const src = (img as HTMLImageElement).src;
    if (!src) continue;

    // Проверяем по ID
    const imgID = (img as HTMLImageElement).id;
    if (imgID && IMAGES_IDS.includes(imgID)) {
      return { directUrl: src };
    }

    // Проверяем по последней части пути ссылки

    const lastRoute = location.pathname.split('/').pop();
    if (lastRoute && src.includes(lastRoute)) {
      return { directUrl: src };
    }

    // Проверяем по атрибуту alt. Beta version. В alt часто содержится название картинки с расширением
    if (img.alt && DIRECT_MEDIA_URL_PATTERN.test(img.alt)) {
      return { directUrl: src };
    }

    // Проверяем классы. Beta version. Суть: если в классе есть слово wallpaper, то это обои.
    // Привет тут есть кто, если есть то дайте знак, я тут сижу и жду вас, а вы кто? ...
    // if (img.classList.toString().toLowerCase().includes("wallpaper")) {
    //   return { url: src };
    // }
  }

  return {
    directUrl: null,
    error: 'No media items were found on this page.',
  };
};
