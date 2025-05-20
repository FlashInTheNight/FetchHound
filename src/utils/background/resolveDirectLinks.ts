import { findWallpaperImage, findDirectVideoLink, findUnknownMediaLink, isDirectMediaUrl } from '.';
import { type SelectedItem } from '../../store';
import { type MediaSearchResult } from '../../types';

/**
 * Resolves direct media links for a set of URLs based on the mediaTab type.
 * @param {Record<string, SelectedItem>} targetUrlsMap - Map of URLs to process
 * @param {string} mediaTab - Type of media to resolve ('all', 'videos', 'images')
 * @returns {Promise<{ updatedSelectedUrls: Record<string, SelectedItem>, iGetResolveDirectLinkError: boolean }>}
 */
export async function resolveDirectLinks(
  targetUrlsMap: Record<string, SelectedItem>,
  mediaTab: string
) {
  // Function to get direct link from a tab
  const getDirectLink = (url: string): Promise<MediaSearchResult> => {
    return new Promise(resolve => {
      chrome.tabs.create({ url, active: false }, tab => {
        if (!tab.id) {
          resolve({ url, error: 'Failed to create tab' });
          return;
        }

        let currentFinderFn;
        switch (mediaTab) {
          case 'all':
            currentFinderFn = findUnknownMediaLink;
            break;
          case 'videos':
            currentFinderFn = findDirectVideoLink;
            break;
          case 'images':
            currentFinderFn = findWallpaperImage;
            break;
          default:
            currentFinderFn = findUnknownMediaLink;
            break;
        }

        const onUpdated = (tabId: number, changeInfo: chrome.tabs.TabChangeInfo) => {
          if (tabId === tab.id && changeInfo.status === 'complete') {
            chrome.tabs.onUpdated.removeListener(onUpdated);
            chrome.scripting.executeScript(
              {
                target: { tabId: tab.id },
                func: currentFinderFn,
              },
              results => {
                const result = results?.[0]?.result as MediaSearchResult;
                chrome.tabs.remove(tab.id!);
                if (Object.hasOwn(result, 'error')) {
                  resolve({ url, error: result.error });
                } else {
                  resolve({ url, directUrl: result.directUrl });
                }
              }
            );
          }
        };
        chrome.tabs.onUpdated.addListener(onUpdated);
      });
    });
  };

  let iGetResolveDirectLinkError = false;
  for (const urlKey of Object.keys(targetUrlsMap)) {
    if (!isDirectMediaUrl(urlKey)) {
      const urlObj = targetUrlsMap[urlKey];
      const directUrl: MediaSearchResult = await getDirectLink(urlKey);
      if (directUrl.error) {
        iGetResolveDirectLinkError = true;
        targetUrlsMap[urlKey] = {
          ...urlObj,
          error: directUrl.error,
        };
      } else {
        targetUrlsMap[urlKey] = {
          ...urlObj,
          directUrl: directUrl.directUrl,
        };
      }
    }
  }
  return {
    updatedSelectedUrls: targetUrlsMap,
    iGetResolveDirectLinkError,
  };
}
