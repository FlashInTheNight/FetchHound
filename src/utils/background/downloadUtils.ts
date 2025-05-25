import browser from 'webextension-polyfill';
import { type SelectedItem } from '../../store';

export interface DownloadResult {
  success: boolean;
  error?: string;
  urls: Record<string, SelectedItem>;
}

export const downloadFile = (url: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    browser.downloads
      .download({ url })
      .then(downloadId => {
        if (!downloadId) {
          return reject(new Error('Failed to start download'));
        }

        const onChangedListener = (delta: browser.Downloads.OnChangedDownloadDeltaType) => {
          if (delta.id !== downloadId) return;
          if (delta.state && delta.state.current === 'complete') {
            browser.downloads.onChanged.removeListener(onChangedListener);
            resolve(downloadId);
          } else if (delta.state && delta.state.current === 'interrupted') {
            browser.downloads.onChanged.removeListener(onChangedListener);
            reject(new Error('Download interrupted'));
          }
        };
        browser.downloads.onChanged.addListener(onChangedListener);
      })
      .catch(error => {
        reject(new Error(error.message));
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
