import { type ScanDirectLinkResult } from '../../types';

/**
 * Attempts to find a suitable wallpaper image on the page by checking various attributes and patterns.
 *
 * @returns {ScanDirectLinkResult} An object containing the direct image URL if found, or an error message if not found.
 */
export const findWallpaperImage = (): ScanDirectLinkResult => {
  const IMAGES_IDS = ['image', 'wallpaper'];
  const imageFormatRegex = /\.(jpg|jpeg|webm|gif|png)(\?.*)?$/i;
  try {
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
      if (img.alt && imageFormatRegex.test(img.alt)) {
        return { directUrl: src };
      }
    }
    throw Error('No suitable image was found.');
  } catch (error) {
    return {
      directUrl: null,
      error:
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred during image search.',
    };
  }
};
