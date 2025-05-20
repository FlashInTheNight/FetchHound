import { useGetMedia } from '../../../hooks/useGetMedia';
import { scanAll, scanImages, scanVideos } from '../../../utils';
import { useLoadingStore, useTabStore } from '../../../store';
import { MediaTabs } from '../../entities';
import { CustomButton } from '../../shared';
import styles from './scan-media.module.css';

const ScanMedia = () => {
  const { loading } = useLoadingStore();
  const { activeTab } = useTabStore();
  const { getMedia } = useGetMedia();

  const handleScan = () => {
    if (loading) return;
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
  };
  return (
    <div className={styles['media-tabs-wrapper']}>
      <MediaTabs />
      <CustomButton className={styles['media-tabs-btn']} onClick={handleScan} disabled={loading}>
        Scan
      </CustomButton>
    </div>
  );
};

export { ScanMedia };
