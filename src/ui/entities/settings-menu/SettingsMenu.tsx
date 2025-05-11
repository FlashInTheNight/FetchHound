import { useState } from "react";
import { storage } from "../../../storage";
import styles from "./settings-menu.module.css";
import { SettingsIcon } from "../../shared/icons/SettingsIcon";

export const SettingsMenu: React.FC = () => {
  const host = window.location.host;
  const [settingsOpen, setSettingsOpen] = useState(false);

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
              onClick={async () => {
                await storage.clearSite(host);
                setSettingsOpen(false);
                // можно вызвать рескан страницы
              }}
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
