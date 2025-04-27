import { useErrorStore, useTabStore } from "../../../store";
import clsx from "clsx";
import styles from "./info-message.module.css";

function InfoMessage() {
  const { activeTab } = useTabStore();
  const { error } = useErrorStore();
  let currentText = "";

  if (error) {
    currentText = error
  } else {
    currentText = `Click “Scan” to scan ${activeTab}.`;
  }

  return (
    <p
      className={clsx(styles["info-message"], {
        [styles["info-message--error"]]: Boolean(error),
      })}
    >
      {currentText}
    </p>
  );
}

export { InfoMessage };
