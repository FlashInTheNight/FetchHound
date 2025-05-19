import { useDownloadStatus } from "../../../store";
import { LoadingIcon } from "../../shared/icons";
import { DownloadResults, DownloadSummaryMessage } from "./components";
import styles from "./css/download-summary.module.css";

export const DownloadSummary = () => {
  const downloadStatus = useDownloadStatus((state) => state.status);

  return (
    <div>
      {downloadStatus === "downloaded" ? (
        <div className={styles.loadingStatus}>
          <LoadingIcon />
          <p className={styles.loadingStatus__text}>
            Downloading of the media items has begun. To access the download
            report, do not close the extension window.
          </p>
        </div>
      ) : (
        <>
          <DownloadResults />
          <DownloadSummaryMessage />
        </>
      )}
    </div>
  );
};
