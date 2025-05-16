import { type SelectedItem } from "../../../../store";
import { PlaceholderIcon } from "../../../shared";
import styles from "../css/download-summary-list-item.module.css";

interface Props {
  urldata: SelectedItem;
  errorUrl?: boolean;
}

export const DownloadResultsListItem: React.FC<Props> = ({
  urldata,
  errorUrl = "false",
}) => {
  return (
    <li className={styles.downloadItem}>
      <div className={styles.downloadedItem__thumb}>
        {urldata.thumb ? (
          <img src={urldata.thumb} alt={urldata.thumb} />
        ) : (
          <div className={styles.downloadedItem__placeholder}>
            <PlaceholderIcon />
          </div>
        )}
      </div>
      <div className={styles.downloadedItem__info}>
        <p className={styles.downloadedItem__url}>{urldata.originalUrl}</p>
        <p className={styles.downloadedItem__status}>
          {errorUrl ? urldata.error : "downloaded succed"}
        </p>
      </div>
    </li>
  );
};
