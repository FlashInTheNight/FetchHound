// import browser from "webextension-polyfill";

// console.log("Hello from the background!");

// chrome.runtime.onInstalled.addListener((details) => {
//   console.log("Extension installed:", details);
// });

import {
  findWallpaperImage,
  findDirectVideoLink,
  findUnknownMediaLink,
  isDirectMediaUrl,
  downloadMultipleFiles,
} from "./utils/background";
import { type MediaSearchResult } from "./types";

// Обработчик сообщений
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "RESOLVE_DIRECT_LINKS") {
    const targetUrls: string[] = msg.urls;
    console.log("Received URLs for resolution:", targetUrls);

    // Функция для получения прямой ссылки из одной вкладки
    const getDirectLink = (url: string): Promise<MediaSearchResult> => {
      return new Promise((resolve) => {
        chrome.tabs.create({ url, active: false }, (tab) => {
          if (!tab.id) {
            console.error("Failed to create tab");
            resolve({ url, error: "Failed to create tab" });
            return;
          }

          console.log("msg.mediaTab is: ", msg.mediaTab);

          let currentFinderFn;

          switch (msg.mediaTab) {
            case "all":
              currentFinderFn = findUnknownMediaLink;
              break;
            case "videos":
              currentFinderFn = findDirectVideoLink;
              break;
            case "images":
              currentFinderFn = findWallpaperImage;
              break;
            default:
              currentFinderFn = findUnknownMediaLink;
              break;
          }

          const onUpdated = (
            tabId: number,
            changeInfo: chrome.tabs.TabChangeInfo
          ) => {
            if (tabId === tab.id && changeInfo.status === "complete") {
              chrome.tabs.onUpdated.removeListener(onUpdated);

              chrome.scripting.executeScript(
                {
                  target: { tabId: tab.id },
                  func: currentFinderFn,
                },
                (results) => {
                  const result = results?.[0]?.result as MediaSearchResult;
                  console.log("Found direct URL:", result.url);
                  console.log("results is: ", results);

                  chrome.tabs.remove(tab.id!);
                  if (Object.hasOwn(result, "error")) {
                    console.error("Error in content script:", result.error);
                    resolve({ url, error: result.error });
                  } else {
                    resolve(result);
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
      const directUrls: (MediaSearchResult | null)[] = [];
      for (const url of targetUrls) {
        if (isDirectMediaUrl(url)) {
          directUrls.push({ url });
          console.log("get direct link");
        } else {
          console.log("get dirty link");
          const result = await getDirectLink(url);
          directUrls.push(result);
        }
      }
      sendResponse({ directUrls });
    })();

    return true;
  }

  if (msg.type === "DOWNLOAD_VIDEOS") {
    const urls = msg.urls;
    if (!urls || urls.length === 0) {
      sendResponse({ success: false, error: "No URLs provided" });
      return;
    }

    (async () => {
      const result = await downloadMultipleFiles(urls);
      sendResponse(result);
    })();

    return true;
  }
});
