import clsx from "clsx";
import { useLoadingStore, useTabStore } from "../../../store";
import { Button } from "../button/Button";
import style from "./chooseMediaTabs.module.css";

function ChooseMediaTabs() {
  const { activeTab, setActiveTab } = useTabStore();
  const { loading } = useLoadingStore();

  return (
    <div className={style.tabsWrapper}>
      <Button
        className={clsx(style.mediaButton, style.leftMediaButton)}
        onClick={() => setActiveTab("videos")}
        variant={activeTab === "videos" ? "primary" : "unchecked"}
        disabled={loading}
      >
        Videos
      </Button>
      <Button
        className={clsx(style.mediaButton, style.rightMediaButton)}
        onClick={() => setActiveTab("images")}
        variant={activeTab === "images" ? "primary" : "unchecked"}
        disabled={loading}
      >
        Images
      </Button>
    </div>
  );
}

export { ChooseMediaTabs };
