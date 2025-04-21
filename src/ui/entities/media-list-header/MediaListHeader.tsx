import { LeftArrowIcon } from "../../shared";
import styles from "./media-list-header.module.css";

function MediaListHeader() {
  return (
    <div className={styles.mediaListHeader}>
      <button
        className={styles.mediaListHeader__backButton}
        onClick={() => console.log("Back button clicked")}
        type="button"
      >
        <LeftArrowIcon className={styles.mediaListHeader__backButtonIcon} />
        Scan Again
      </button>
      <p className={styles.mediaListHeader__status}>2 of 24 selected</p>
    </div>
  );
}

export { MediaListHeader };
