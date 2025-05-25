import browser from 'webextension-polyfill';
import {
  SelectedItem,
  useDownloadedResultStore,
  useDownloadStatus,
  useErrorStore,
  useExtensionStatus,
  useMediaStore,
  useSelectedStore,
  useTabStore,
} from '../store/index';
import { DownloadResult } from '../utils/background/downloadUtils';

export const useGroupBtnsActions = () => {
  const removeAll = useSelectedStore(s => s.removeAllChecked);
  const addAll = useSelectedStore(s => s.addAllChecked);
  const { mediaItems, setMediaItems } = useMediaStore();
  const { getSelectedCount, removeAllChecked, getObjectSelectedUrls } = useSelectedStore();
  const { setUrls } = useDownloadedResultStore();
  const { activeTab } = useTabStore();
  const { setError } = useErrorStore();
  const { setExtentionStatus } = useExtensionStatus();
  const { setDownloadStatus } = useDownloadStatus();

  const handelAddAll = () => addAll(mediaItems);
  const handleDownload = async () => {
    try {
      setError('');
      setMediaItems([]);
      setExtentionStatus('downloading');
      setDownloadStatus('downloaded');
      const selectedUrlsObject = getObjectSelectedUrls();

      if (getSelectedCount() === 0) {
        throw new Error('No media items selected for download.');
      }

      // Get direct links to media files
      const {
        iGetResolveDirectLinkError,
        updatedSelectedUrls,
      }: {
        iGetResolveDirectLinkError: boolean;
        updatedSelectedUrls: Record<string, SelectedItem>;
      } = await new Promise(resolve => {
        browser.runtime
          .sendMessage({
            type: 'RESOLVE_DIRECT_LINKS',
            urls: selectedUrlsObject,
            mediaTab: activeTab,
          })
          .then(resp => {
            resolve(resp?.directUrls);
          });
      });

      // Send a message to background.ts for downloading
      const downloadResult = await new Promise<DownloadResult>((resolve, reject) => {
        browser.runtime
          .sendMessage({
            type: 'DOWNLOAD_VIDEOS',
            urls: updatedSelectedUrls,
          })
          .then(response => {
            if (!response) {
              reject(new Error('No response from background script'));
              return;
            }
            resolve(response as DownloadResult);
          })
          .catch(error => {
            reject(new Error(error.message));
          });
      });

      if (iGetResolveDirectLinkError === true || downloadResult.success === false) {
        setUrls(downloadResult.urls);
        throw new Error('Failed to download some files');
      }

      setDownloadStatus('success');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
      setError(errorMessage);
      setDownloadStatus('error');
    } finally {
      removeAllChecked();
    }
  };

  return { removeAll, handelAddAll, handleDownload, getSelectedCount };
};
