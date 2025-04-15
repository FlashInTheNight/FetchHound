import { useTabStore } from "../../../store/store";
import { ChooseMediaTabs } from "../../shared/choose-media-tabs/ChooseMediaTabs";
import style from "./scanPage.module.css";

function ScanPage() {
  const { activeTab } = useTabStore();
  return (
    <div className={style.scanPage}>
      <ChooseMediaTabs />
      <div className={style["button-wrapper"]}>
        <button className={style["scan-button"]}>
          Scan Page for {activeTab}
        </button>
      </div>
    </div>
  );
}

export { ScanPage };
