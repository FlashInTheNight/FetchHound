import browser from 'webextension-polyfill';
import { downloadMultipleFiles, resolveDirectLinks } from './utils/background';
import { SelectedItem } from './store';

type MessageResponse = {
  directUrls?: {
    updatedSelectedUrls: Record<string, SelectedItem>;
    iGetResolveDirectLinkError: boolean;
  };
  success?: boolean;
  error?: string;
  urls?: Record<string, SelectedItem>;
};

browser.runtime.onMessage.addListener(
  (msg, sender, sendResponse: (response: MessageResponse) => void) => {
    if (msg.type === 'RESOLVE_DIRECT_LINKS') {
      const targetUrlsMap: Record<string, SelectedItem> = msg.urls;
      (async () => {
        try {
          const { updatedSelectedUrls, iGetResolveDirectLinkError } = await resolveDirectLinks(
            targetUrlsMap,
            msg.mediaTab
          );
          sendResponse({
            directUrls: {
              updatedSelectedUrls,
              iGetResolveDirectLinkError,
            },
          });
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          sendResponse({
            directUrls: {
              updatedSelectedUrls: targetUrlsMap,
              iGetResolveDirectLinkError: true,
            },
          });
        }
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
        try {
          const result = await downloadMultipleFiles(urls);
          sendResponse(result);
        } catch (error) {
          sendResponse({
            success: false,
            error: error instanceof Error ? error.message : 'An unexpected error occurred',
            urls,
          });
        }
      })();

      return true;
    }
  }
);
