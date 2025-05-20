// import browser from "webextension-polyfill";
import {
  findWallpaperImage,
  findDirectVideoLink,
  findUnknownMediaLink,
  isDirectMediaUrl,
  downloadMultipleFiles,
} from './utils/background';
import { type MediaSearchResult } from './types';
import { SelectedItem } from './store';

// Обработчик сообщений
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'RESOLVE_DIRECT_LINKS') {
    const targetUrlsMap: Record<string, SelectedItem> = msg.urls;

    // Функция для получения прямой ссылки из одной вкладки
    const getDirectLink = (url: string): Promise<MediaSearchResult> => {
      return new Promise(resolve => {
        chrome.tabs.create({ url, active: false }, tab => {
          if (!tab.id) {
            resolve({ url, error: 'Failed to create tab' });
            return;
          }

          let currentFinderFn;

          switch (msg.mediaTab) {
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

    // Обрабатываем все URL последовательно
    (async () => {
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

      sendResponse({
        directUrls: {
          updatedSelectedUrls: targetUrlsMap,
          iGetResolveDirectLinkError,
        },
      });
    })();

    return true;
  }

  if (msg.type === 'DOWNLOAD_VIDEOS') {
    const urls: Record<string, SelectedItem> = msg.urls;
    if (!urls || Object.keys(urls).length === 0) {
      sendResponse({ success: false, error: 'No URLs provided' });
      return;
    }

    (async () => {
      const result = await downloadMultipleFiles(urls);
      sendResponse(result);
    })();

    return true;
  }
});
