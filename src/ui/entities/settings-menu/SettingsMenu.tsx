import { useState } from "react";
import { storage } from "../../../storage";
import styles from "./settings-menu.module.css";
import { SettingsIcon } from "../../shared/icons/SettingsIcon";

export const SettingsMenu: React.FC = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleClearSiteExclusions = async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    let host;
    if (tab.url) {
      host = new URL(tab.url).host;
    } else {
      throw Error("tis tab cant be used for scan");
    }
    await storage.clearSite(host);
    setSettingsOpen(false);
  };

  return (
    <>
      {/* Кнопка открытия настроек */}
      <button
        className={styles.settingsButton}
        onClick={() => setSettingsOpen(true)}
      >
        <SettingsIcon />
      </button>

      {/* ... остальной контент popup ... */}

      {/* Модальное окно настроек */}
      {settingsOpen && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <h3>Settings</h3>
            <button
              className={styles.modalButton}
              onClick={handleClearSiteExclusions}
            >
              Clear Site Exclusions
            </button>
            <button
              className={styles.modalButton}
              onClick={async () => {
                await storage.clearAll();
                setSettingsOpen(false);
              }}
            >
              Clear All Exclusions
            </button>
            <button
              className={styles.closeButton}
              onClick={() => setSettingsOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
