// import browser from "webextension-polyfill";

console.log("Hello from the background!");

chrome.runtime.onInstalled.addListener((details) => {
  console.log("Extension installed:", details);
});


function downloadFile(url) {
  console.log('url is:', url)
  return new Promise((resolve, reject) => {
    chrome.downloads.download({ url }, (downloadId) => {
      if (!downloadId) {
        return reject(chrome.runtime.lastError && chrome.runtime.lastError.message);
      }
      const onChangedListener = (delta) => {
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
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "DOWNLOAD_VIDEOS" && Array.isArray(message.urls)) {
    (async () => {
      try {
        // Скачиваем видео по очереди
        for (const url of message.urls) {
          await downloadFile(url);
          console.log(`Downloaded: ${url}`);
        }
        sendResponse({ success: true });
      } catch (e) {
        console.error("Download error:", e);
        sendResponse({ success: false, error: e.message });
      }
    })();
    // Возвращаем true, чтобы sendResponse сработал асинхронно
    return true;
  }
});
