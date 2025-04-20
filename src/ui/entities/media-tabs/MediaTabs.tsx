import clsx from "clsx";
import styles from "./media-tabs.module.css";
import { useTabStore } from "../../../store";
import { CustomButton } from "../../shared";

const MediaTabs = () => {
  const { activeTab, setActiveTab } = useTabStore();

  return (
    <div className={styles.tabs}>
      <button
        className={clsx(styles.tab, {
          [styles.active]: activeTab === "images",
        })}
        onClick={() => setActiveTab("images")}
      >
        Images
      </button>
      <button
        className={clsx(styles.tab, {
          [styles.active]: activeTab === "videos",
        })}
        onClick={() => setActiveTab("videos")}
      >
        Videos
      </button>
    </div>
  );
};

export { MediaTabs };
