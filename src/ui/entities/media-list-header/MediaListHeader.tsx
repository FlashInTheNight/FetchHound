import {
  useErrorStore,
  useExtensionMode,
  useExtensionStatus,
  useMediaListMode,
  useMediaStore,
  useSelectedStore,
} from '../../../store';
import { CustomButton } from '../../shared';
import { LeftArrowIcon } from '../../shared/icons';
import { ExcludeIcon } from '../../shared/icons/ExcludeIcon';
import styles from './media-list-header.module.css';

const MediaListHeader = () => {
  const { mediaItems, setMediaItems } = useMediaStore();
  const count = useSelectedStore(s => s.getSelectedCount());
  const { removeAllChecked } = useSelectedStore();
  const { setExtMode } = useExtensionMode();
  const { setError } = useErrorStore();
  const { status, setExtentionStatus } = useExtensionStatus();
  const handleBackButtonClick = () => {
    removeAllChecked();
    setMediaItems([]);
    setError('');
    setMode('normal');
    setExtMode('scan');
    setExtentionStatus('showList');
  };
  const { activeMode, setMode } = useMediaListMode();

  const handeSetMode = () => {
    removeAllChecked();
    setMode('exclude');
  };

  return (
    <div className={styles.mediaListHeader}>
      <button
        className={styles.mediaListHeader__backButton}
        onClick={handleBackButtonClick}
        type="button"
      >
        <LeftArrowIcon className={styles.mediaListHeader__backButtonIcon} />
        Scan Again
      </button>
      {status === 'showList' && (
        <div className={styles.mediaListHeader__tablo}>
          <p className={styles.mediaListHeader__status}>
            {count} of {mediaItems.length} selected
          </p>
          <CustomButton
            variant="outline"
            className={styles.mediaListHeader__unwantedBtn}
            title="Select Unwanted"
            disabled={activeMode === 'exclude'}
            onClick={handeSetMode}
          >
            <ExcludeIcon />
          </CustomButton>
        </div>
      )}
    </div>
  );
};

export { MediaListHeader };
