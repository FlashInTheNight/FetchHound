import { useDownloadedResultStore } from "../../../../store";
import { getSortedUrls } from "../../../../utils";
import { DownloadResultsListItem } from "./DownloadResultsListItem";
import styles from "../css/download-results-list.module.css";
import clsx from "clsx";

export const DownloadResultsList = () => {
  const downloadedLinks = useDownloadedResultStore((state) => state.urls);
  const { urlsWithError, urlsWithSuccess } = getSortedUrls(downloadedLinks);
  return (
    <div className={styles.downloadResultsListWrapper}>
      {urlsWithError.length > 0 && (
        <div>
          <h3
            className={clsx(
              styles.downloadResultsList__header,
              styles["downloadResultsList__header--red"]
            )}
          >
            Downloads with Errors
          </h3>
          <ul className={styles.downloadResultsList}>
            {urlsWithError.map((item) => (
              <DownloadResultsListItem key={item.originalUrl} urldata={item}  errorUrl={true} />
            ))}
          </ul>
        </div>
      )}
      {urlsWithSuccess.length > 0 && (
        <div>
          <h3
            className={clsx(
              styles.downloadResultsList__header,
              styles["downloadResultsList__header--green"]
            )}
          >
            Successfully Downloaded Links
          </h3>
          <ul className={styles.downloadResultsList}>
            {urlsWithSuccess.map((item) => (
              <DownloadResultsListItem key={item.originalUrl} urldata={item}  />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
