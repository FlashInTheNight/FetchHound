import { useMediaListHeaderActions } from '../../../hooks';
import { CustomButton } from '../../shared';
import { LeftArrowIcon } from '../../shared/icons';
import { ExcludeIcon } from '../../shared/icons/ExcludeIcon';
import styles from './media-list-header.module.css';

export const MediaListHeader = () => {
  const { mediaItems, count, handleBackButtonClick, handeSetMode, status, activeMode } =
    useMediaListHeaderActions();

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
