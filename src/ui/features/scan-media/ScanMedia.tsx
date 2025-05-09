import { useGetMedia } from "../../../hooks/useGetMedia";
import { scanAll, scanImages, scanVideos } from "../../../utils";
import { useLoadingStore, useTabStore } from "../../../store";
import { MediaTabs } from "../../entities";
import { CustomButton } from "../../shared";
import styles from "./scan-media.module.css";

function ScanMedia() {
  const { loading } = useLoadingStore();
  const { activeTab } = useTabStore();
  const { getMedia } = useGetMedia();

  const handleScan = () => {
    // можно удалит loading так как кнопка будет отключена во время сканирования
    if (loading) return; // Если загрузка идет, ничего не делаем
    if (activeTab === "videos") {
      getMedia(scanVideos);
    } else if (activeTab === "images") {
      getMedia(scanImages);
    } else {
      getMedia(scanAll);
    }
  };
  return (
    <div className={styles["media-tabs-wrapper"]}>
      <MediaTabs />
      <CustomButton
        className={styles["media-tabs-btn"]}
        onClick={handleScan}
        disabled={loading}
      >
        Scan
      </CustomButton>
    </div>
  );
}

export { ScanMedia };
