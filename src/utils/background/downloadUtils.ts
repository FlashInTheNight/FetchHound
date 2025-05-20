import { type SelectedItem } from '../../store';

export interface DownloadResult {
  success: boolean;
  error?: string;
  urls: Record<string, SelectedItem>;
}

export const downloadFile = (url: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    chrome.downloads.download({ url }, downloadId => {
      if (chrome.runtime.lastError) {
        return reject(new Error(chrome.runtime.lastError.message));
      }
      if (!downloadId) {
        return reject(new Error('Failed to start download'));
      }

      const onChangedListener = (delta: chrome.downloads.DownloadDelta) => {
        if (delta.id !== downloadId) return;
        if (delta.state && delta.state.current === 'complete') {
          chrome.downloads.onChanged.removeListener(onChangedListener);
          resolve(downloadId);
        } else if (delta.state && delta.state.current === 'interrupted') {
          chrome.downloads.onChanged.removeListener(onChangedListener);
          reject(new Error('Download interrupted'));
        }
      };
      chrome.downloads.onChanged.addListener(onChangedListener);
    });
  });
};

export const downloadMultipleFiles = async (
  urls: Record<string, SelectedItem>
): Promise<DownloadResult> => {
  let hasErrors = false;

  for (const key of Object.keys(urls)) {
    try {
      if (urls[key].error) {
        continue;
      } else if (urls[key].directUrl) {
        await downloadFile(urls[key].directUrl);
      } else {
        await downloadFile(key);
      }
    } catch (error) {
      hasErrors = true;
      urls[key].error = error instanceof Error ? error.message : 'An unknown error occurred';
    }
  }

  return {
    success: !hasErrors,
    urls,
    error: hasErrors ? 'Some files failed to download' : undefined,
  };
};
