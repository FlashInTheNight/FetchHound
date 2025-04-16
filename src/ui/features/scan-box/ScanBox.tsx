import { useLoadingStore, useTabStore } from "../../../store";
import { ChooseMediaTabs } from "../../shared/choose-media-tabs/ChooseMediaTabs";
import { useGetMedia } from "../../../hooks/useGetMedia";
import { scanImages } from "../../../lib/scanImages";
import { scanVideos } from "../../../lib/scanVideos";
import style from "./scan-box.module.css";

function ScanBox() {
  const { getMedia } = useGetMedia();
  const { activeTab } = useTabStore();
  const { loading } = useLoadingStore();
  const currentScanFn = activeTab === "videos" ? scanVideos : scanImages;

  return (
    <div className={style.scanPage}>
      <ChooseMediaTabs />
      {loading ? (
        <div className={style.loading}>Loading...</div>
      ) : (
        <div className={style["button-wrapper"]}>
          <button
            onClick={() => getMedia(currentScanFn)}
            className={style["scan-button"]}
          >
            Scan Page for {activeTab}
          </button>
        </div>
      )}
    </div>
  );
}

export { ScanBox };
