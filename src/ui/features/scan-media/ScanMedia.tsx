import { useLoadingStore } from "../../../store";
import { MediaTabs } from "../../entities";
import { CustomButton } from "../../shared";
import styles from "./scan-media.module.css";

function ScanMedia() {
  const { loading } = useLoadingStore();
  return (
    <div className={styles["media-tabs-wrapper"]}>
      <MediaTabs />
      <CustomButton className={styles["media-tabs-btn"]} disabled={loading}>
        Scan
      </CustomButton>
    </div>
  );
}

export { ScanMedia };
