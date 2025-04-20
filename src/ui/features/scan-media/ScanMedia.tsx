import { MediaTabs } from "../../entities";
import { CustomButton } from "../../shared";
import styles from "./scan-media.module.css";

function ScanMedia() {
  return (
    <div className={styles["media-tabs-wrapper"]}>
      <MediaTabs />
      <CustomButton className={styles["media-tabs-btn"]}>
        Scan Page
      </CustomButton>
    </div>
  );
}

export { ScanMedia };
