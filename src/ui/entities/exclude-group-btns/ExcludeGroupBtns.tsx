import {
  useErrorStore,
  useLoadingStore,
  useMediaListMode,
  useMediaStore,
  useSelectedStore,
  useTabStore,
} from '../../../store';
import { CustomButton } from '../../shared';
import { storage } from '../../../storage';
import { scanAll, scanImages, scanVideos } from '../../../utils';
import styles from './exclude-group-btns.module.css';
import { useGetMedia } from '../../../hooks/useGetMedia';

export const ExcludeGroupBtns = () => {
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
    // должна быть загрузка
    try {
      const excludedUrls = getSelectedUrls();
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      let host;
      if (tab.url) {
        host = new URL(tab.url).host;
      } else {
        throw Error('tis tab cant be used for scan');
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

  return (
    <div className={styles['group-btns']}>
      <CustomButton variant="outline" size="small" onClick={handleSetMode}>
        Cancel
      </CustomButton>
      <CustomButton size="small" onClick={handleSaveAndRescan} disabled={loading}>
        Save & Rescan
      </CustomButton>
    </div>
  );
};
