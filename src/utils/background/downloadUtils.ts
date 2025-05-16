import { SelectedItem } from "../../store";

export interface DownloadResult {
  success: boolean;
  error?: string;
  urls: Record<string, SelectedItem>;
  // results?: {
  //   url: string;
  //   success: boolean;
  //   error?: string;
  // }[];
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
  urls: Record<string, SelectedItem>
): Promise<DownloadResult> => {
  // const results = [];
  let hasErrors = false;

  for (const key of Object.keys(urls)) {
    console.log("Downloading:", urls[key].originalUrl);
    try {
      if (urls[key].error) {
        continue;
      } else if (urls[key].directUrl) {
        await downloadFile(urls[key].directUrl);
        console.log("Downloaded:", urls[key].directUrl);
        // results.push({ url, success: true });
      } else {
        await downloadFile(key);
        console.log("Downloaded:", key);
        // results.push({ url, success: true });
      }
    } catch (error) {
      console.error("Download error:", error);
      hasErrors = true;
      urls[key].error =
        error instanceof Error ? error.message : "An unknown error occurred";
      // results.push({
      //   url,
      //   success: false,
      //   error:
      //     error instanceof Error ? error.message : "An unknown error occurred",
      // });
    }
  }

  return {
    success: !hasErrors,
    urls,
    error: hasErrors ? "Some files failed to download" : undefined,
  };
};
