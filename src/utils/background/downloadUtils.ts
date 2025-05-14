export interface DownloadResult {
  success: boolean;
  error?: string;
  results?: {
    url: string;
    success: boolean;
    error?: string;
  }[];
}

export const downloadFile = (url: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    chrome.downloads.download({ url }, (downloadId) => {
      if (chrome.runtime.lastError) {
        console.error("Download error:", chrome.runtime.lastError.message);
        return reject(new Error(chrome.runtime.lastError.message));
      }
      if (!downloadId) {
        return reject(new Error("Failed to start download"));
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

export const downloadMultipleFiles = async (
  urls: string[]
): Promise<DownloadResult> => {
  const results = [];
  let hasErrors = false;

  for (const url of urls) {
    console.log("Downloading:", url);
    try {
      await downloadFile(url);
      console.log("Downloaded:", url);
      results.push({ url, success: true });
    } catch (error) {
      console.error("Download error:", error);
      hasErrors = true;
      results.push({
        url,
        success: false,
        error: error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  }

  return {
    success: !hasErrors,
    results,
    error: hasErrors ? "Some files failed to download" : undefined,
  };
};
