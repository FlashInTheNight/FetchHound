import { useMediaStore, useSelectedStore } from "../../../store";
import { LeftArrowIcon } from "../../shared";
import styles from "./media-list-header.module.css";

function MediaListHeader() {
  const { mediaItems, setMediaItems } = useMediaStore();
  const count = useSelectedStore((s) => s.getSelectedCount());
  const handleBackButtonClick = () => setMediaItems([]);

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
      <p className={styles.mediaListHeader__status}>
        {count} of {mediaItems.length} selected
      </p>
    </div>
  );
}

export { MediaListHeader };
