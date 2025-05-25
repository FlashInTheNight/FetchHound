import browser from 'webextension-polyfill';
import {
  useErrorStore,
  useLoadingStore,
  useMediaListMode,
  useMediaStore,
  useSelectedStore,
  useTabStore,
} from '../store';
import { storage } from '../utils/storage';
import { scanAll, scanImages, scanVideos } from '../utils/scanners';
import { useGetMedia } from './useGetMedia';

export const useExcludeGroupActions = () => {
  const { getSelectedUrls, removeAllChecked } = useSelectedStore();
  const { setMediaItems } = useMediaStore();
  const { setMode } = useMediaListMode();
  const { activeTab } = useTabStore();
  const { getMedia } = useGetMedia();
  const { loading } = useLoadingStore();
  const { setError } = useErrorStore();

  const handleSetMode = () => {
    removeAllChecked();
    setMode('normal');
  };

  const handleSaveAndRescan = async () => {
    try {
      const excludedUrls = getSelectedUrls();
      const [tab] = await browser.tabs.query({
        active: true,
        currentWindow: true,
      });
      let host;
      if (tab.url) {
        host = new URL(tab.url).host;
      } else {
        throw Error('This tab cannot be used for scanning.');
      }
      await storage.add(host, excludedUrls);
      setMediaItems([]);
      setMode('normal');
      switch (activeTab) {
        case 'videos':
          getMedia(scanVideos);
          break;

        case 'images':
          getMedia(scanImages);
          break;

        default:
          getMedia(scanAll);
          break;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    }
  };

  return {
    handleSetMode,
    handleSaveAndRescan,
    loading,
  };
};
