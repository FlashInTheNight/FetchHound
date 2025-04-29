export interface DownloadResult {
  success: boolean;
  error?: string;
}

export const downloadFile = (url: string): Promise<number> => {
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

export const downloadMultipleFiles = async (urls: string[]): Promise<DownloadResult> => {
  try {
    for (const url of urls) {
      console.log("Downloading:", url);
      await downloadFile(url);
      console.log("Downloaded:", url);
    }
    return { success: true };
  } catch (error) {
    console.error("Download error:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    };
  }
}; 