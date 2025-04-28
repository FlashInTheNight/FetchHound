// import browser from "webextension-polyfill";

// console.log("Hello from the background!");

// chrome.runtime.onInstalled.addListener((details) => {
//   console.log("Extension installed:", details);
// });


// Обработчик сообщений
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "RESOLVE_DIRECT_LINK") {
    const targetUrl: string = msg.url;
    console.log("Received URL for resolution:", targetUrl);

    // Открываем новую вкладку с URL
    chrome.tabs.create({ url: targetUrl, active: false }, (tab) => {
      if (!tab.id) {
        console.error("Failed to create tab");
        sendResponse({ directUrl: null });
        return;
      }

      // Ждем загрузки страницы
      const onUpdated = (tabId: number, changeInfo: chrome.tabs.TabChangeInfo) => {
        if (tabId === tab.id && changeInfo.status === 'complete') {
          chrome.tabs.onUpdated.removeListener(onUpdated);
          
          // Выполняем скрипт для получения прямой ссылки
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => {
              const wallpaperImg = document.getElementById('wallpaper');
              return wallpaperImg?.getAttribute('src') || null;
            }
          }, (results) => {
            const directUrl = results?.[0]?.result;
            console.log("Found direct URL:", directUrl);
            
            // Закрываем вкладку
            chrome.tabs.remove(tab.id!);
            
            // Отправляем результат
            sendResponse({ directUrl });
          });
        }
      };
      
      chrome.tabs.onUpdated.addListener(onUpdated);
    });

    // Указываем, что sendResponse будет вызван асинхронно
    return true;
  }

  if (msg.type === "DOWNLOAD_VIDEOS") {
    const urls = msg.urls;
    if (!urls || urls.length === 0) {
      sendResponse({ success: false, error: "No URLs provided" });
      return;
    }

    // Функция для скачивания одного файла
    const downloadFile = (url: string): Promise<number> => {
      return new Promise((resolve, reject) => {
        chrome.downloads.download({ url }, (downloadId) => {
          if (!downloadId) {
            return reject(
              chrome.runtime.lastError && chrome.runtime.lastError.message
            );
          }

          const onChangedListener = (delta: chrome.downloads.DownloadDelta) => {
            if (delta.id !== downloadId) return;
            if (delta.state && delta.state.current === "complete") {
              chrome.downloads.onChanged.removeListener(onChangedListener);
              resolve(downloadId);
            } else if (delta.state && delta.state.current === "interrupted") {
              chrome.downloads.onChanged.removeListener(onChangedListener);
              reject(new Error("Download interrupted"));
            }
          };
          chrome.downloads.onChanged.addListener(onChangedListener);
        });
      });
    };

    // Скачиваем все файлы последовательно
    (async () => {
      try {
        for (const url of urls) {
          console.log("url is:", url);
          await downloadFile(url);
          console.log("Downloaded:", url);
        }
        sendResponse({ success: true });
      } catch (error) {
        console.error("Download error:", error);
        sendResponse({ 
          success: false, 
          error: error instanceof Error ? error.message : "Unknown error" 
        });
      }
    })();

    return true;
  }
});
