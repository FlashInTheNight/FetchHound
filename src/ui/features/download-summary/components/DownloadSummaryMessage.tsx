import clsx from "clsx";
import { useDownloadStatus, useErrorStore } from "../../../../store";
import styles from "../css/download-summary-message.module.css";

export const DownloadSummaryMessage = () => {
  const downloadStatus = useDownloadStatus((state) => state.status);
  const error = useErrorStore((state) => state.error);
  return (
    <div
      className={clsx(styles.downloadSummaryMessageWrapper, {
        [styles["downloadSummaryMessageWrapper--error"]]:
          downloadStatus === "error",
        [styles["downloadSummaryMessageWrapper--success"]]:
          downloadStatus === "success",
      })}
    >
      {downloadStatus === "success" ? (
        <p className={styles.downloadSummaryMessageText}>All media succesfuly downloaded</p>
      ) : (
        <p className={styles.downloadSummaryMessageText}>{error}</p>
      )}
    </div>
  );
};
