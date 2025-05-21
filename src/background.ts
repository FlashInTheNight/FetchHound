// import browser from "webextension-polyfill";
import { downloadMultipleFiles, resolveDirectLinks } from './utils/background';
import { SelectedItem } from './store';

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'RESOLVE_DIRECT_LINKS') {
    const targetUrlsMap: Record<string, SelectedItem> = msg.urls;
    (async () => {
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
      const result = await downloadMultipleFiles(urls);
      sendResponse(result);
    })();

    return true;
  }
});
