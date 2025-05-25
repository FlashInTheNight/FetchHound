import browser from 'webextension-polyfill';
import {
  useMediaStore,
  useLoadingStore,
  useErrorStore,
  useSelectedStore,
  useExtensionMode,
} from '../store';
import { scanFnType } from '../types';
import { storage } from '../utils/storage';

export const useGetMedia = () => {
  const { setMediaItems } = useMediaStore();
  const { setLoading } = useLoadingStore();
  const { setError } = useErrorStore();
  const { removeAllChecked } = useSelectedStore();
  const { setExtMode } = useExtensionMode();

  const executeScript = async (tabId: number, func: scanFnType, args: string[]) => {
    const isFirefox = browser.runtime.getBrowserInfo?.() !== undefined;

    if (isFirefox) {
      const [result] = await browser.tabs.executeScript(tabId, {
        code: `(${func.toString()})(${JSON.stringify(args)})`,
      });
      return { result };
    } else {
      const [result] = await browser.scripting.executeScript({
        target: { tabId },
        func,
        args,
      });
      return result;
    }
  };

  const getMedia = async (currentScanFn: scanFnType) => {
    const [tab] = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (!tab?.id) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      removeAllChecked();

      const host = tab.url ? new URL(tab.url).host : '';

      const excludedUrls = await storage.get(host);

      const result = await executeScript(tab.id, currentScanFn, excludedUrls);

      if (!result.result || result.result.length === 0) {
        throw Error('No media items were found on the page.');
      }

      setMediaItems(result.result);
      setExtMode('download');
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred while scanning the page.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { getMedia };
};
