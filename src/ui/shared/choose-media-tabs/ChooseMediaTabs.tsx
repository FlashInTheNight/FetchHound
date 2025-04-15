import clsx from "clsx";
import { useTabStore } from "../../../store/store";
import { Button } from "../button/Button";
import style from "./chooseMediaTabs.module.css";

function ChooseMediaTabs() {
  const { activeTab, setActiveTab } = useTabStore();

  return (
    <div className={style.tabsWrapper}>
      <Button
        className={clsx(style.mediaButton, style.leftMediaButton)}
        onClick={() => setActiveTab("videos")}
        variant={activeTab === "videos" ? "primary" : "unchecked"}
      >
        Videos
      </Button>
      <Button
        className={clsx(style.mediaButton, style.rightMediaButton)}
        onClick={() => setActiveTab("images")}
        variant={activeTab === "images" ? "primary" : "unchecked"}
      >
        Images
      </Button>
    </div>
  );
}

export { ChooseMediaTabs };
