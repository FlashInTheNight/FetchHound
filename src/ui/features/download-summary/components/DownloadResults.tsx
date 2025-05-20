import { useDownloadStatus } from '../../../../store';
import { DownloadResultsList } from './DownloadResultsList';
import styles from '../css/download-results.module.css';
import { SuccessIcon } from '../../../shared/icons';

export const DownloadResults = () => {
  const downloadStatus = useDownloadStatus(state => state.status);

  return (
    <div>
      {downloadStatus === 'success' ? (
        <div className={styles.successResult}>
          <SuccessIcon size={150} />
        </div>
      ) : (
        <DownloadResultsList />
      )}
    </div>
  );
};
