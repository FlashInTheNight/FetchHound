import { type ScanDirectLinkResult } from '../../types';

/**
 * Attempts to find a direct media link (video or image) on the page by checking various attributes and patterns.
 *
 * @returns {ScanDirectLinkResult} An object containing the direct media URL if found, or an error message if not found.
 */
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

    // Check by ID
    const imgID = (img as HTMLImageElement).id;
    if (imgID && IMAGES_IDS.includes(imgID)) {
      return { directUrl: src };
    }

    // Check by the last part of the URL path
    const lastRoute = location.pathname.split('/').pop();
    if (lastRoute && src.includes(lastRoute)) {
      return { directUrl: src };
    }

    // Check by alt attribute. Alt often contains the image name with extension
    if (img.alt && DIRECT_MEDIA_URL_PATTERN.test(img.alt)) {
      return { directUrl: src };
    }
  }

  return {
    directUrl: null,
    error: 'No media items were found on this page.',
  };
};
