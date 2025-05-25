import { useSettingsMenuActions } from '../../../hooks';
import { SettingsIcon } from '../../shared/icons/SettingsIcon';
import styles from './settings-menu.module.css';

export const SettingsMenu = () => {
  const {
    handleClearSiteExclusions,
    handleClearAllExclusions,
    handleCloseSettings,
    settingsOpen,
    setSettingsOpen,
    error,
    message,
  } = useSettingsMenuActions();
  return (
    <>
      <button className={styles.settingsButton} onClick={() => setSettingsOpen(true)}>
        <SettingsIcon />
      </button>

      {settingsOpen && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <h3 className={styles.header}>Settings</h3>
            <p className={styles.infoMessage}>
              Please manually rescan the page after removing exclusions.
            </p>
            <button className={styles.modalButton} onClick={handleClearSiteExclusions}>
              Clear Site Exclusions
            </button>
            {error.clearSite && <p className={styles.errorMessage}>{error.clearSite}</p>}
            {message.clearSite && <p className={styles.successMessage}>{message.clearSite}</p>}
            <button className={styles.modalButton} onClick={handleClearAllExclusions}>
              Clear All Exclusions
            </button>
            {error.clearAll && <p className={styles.errorMessage}>{error.clearAll}</p>}
            {message.clearAll && <p className={styles.successMessage}>{message.clearAll}</p>}
            <button className={styles.closeButton} onClick={handleCloseSettings}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
