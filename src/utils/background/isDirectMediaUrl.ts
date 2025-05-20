/**
 * Regular expression to check for direct media file links.
 */
const DIRECT_MEDIA_URL_PATTERN = /\.(mp4|webm|mkv|avi|mov|jpg|jpeg|png|gif|webp)(?:\?[^/]*)?$/i;

/**
 * Checks if a given URL is a direct link to a media file.
 *
 * @param {string} url - The URL to check.
 * @returns {boolean} True if the URL is a direct media link, false otherwise.
 */
export const isDirectMediaUrl = (url: string): boolean => {
  try {
    // Remove protocol and domain to check only the path
    const urlPath = new URL(url).pathname;
    return DIRECT_MEDIA_URL_PATTERN.test(urlPath);
  } catch {
    // If the URL is invalid, consider it not a direct link
    return false;
  }
};
