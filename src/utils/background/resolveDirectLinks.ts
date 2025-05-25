import browser from 'webextension-polyfill';
import { findWallpaperImage, findDirectVideoLink, findUnknownMediaLink, isDirectMediaUrl } from '.';
import { type SelectedItem } from '../../store';
import { type MediaSearchResult } from '../../types';

const isFirefox = browser.runtime.getBrowserInfo?.() !== undefined;

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
  // Function to get a direct link from a tab
  const getDirectLink = (url: string): Promise<MediaSearchResult> => {
    return new Promise(resolve => {
      browser.tabs.create({ url, active: false }).then(tab => {
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

        const onUpdated = (tabId: number, changeInfo: browser.Tabs.OnUpdatedChangeInfoType) => {
          if (tabId === tab.id && changeInfo.status === 'complete') {
            browser.tabs.onUpdated.removeListener(onUpdated);

            if (isFirefox) {
              // For Firefox, use tabs.executeScript with direct code injection
              browser.tabs
                .executeScript(tab.id, {
                  code: `(${currentFinderFn.toString()})()`,
                })
                .then(results => {
                  const result = results?.[0] as MediaSearchResult;
                  browser.tabs.remove(tab.id!);
                  if (Object.hasOwn(result, 'error')) {
                    resolve({ url, error: result.error });
                  } else {
                    resolve({ url, directUrl: result.directUrl });
                  }
                })
                .catch(error => {
                  resolve({
                    url,
                    error: error instanceof Error ? error.message : 'Failed to execute script',
                  });
                });
            } else {
              // For Chrome, use scripting.executeScript
              browser.scripting
                .executeScript({
                  target: { tabId: tab.id },
                  func: currentFinderFn,
                })
                .then(results => {
                  const result = results?.[0]?.result as MediaSearchResult;
                  browser.tabs.remove(tab.id!);
                  if (Object.hasOwn(result, 'error')) {
                    resolve({ url, error: result.error });
                  } else {
                    resolve({ url, directUrl: result.directUrl });
                  }
                })
                .catch(error => {
                  resolve({
                    url,
                    error: error instanceof Error ? error.message : 'Failed to execute script',
                  });
                });
            }
          }
        };
        browser.tabs.onUpdated.addListener(onUpdated);
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
