import { useMediaStore, useSelectedStore } from "../../../store";
import { CustomButton } from "../../shared";
import styles from "./group-btns.module.css";

function GroupBtns() {
  const removeAll = useSelectedStore((s) => s.removeAllChecked);
  const addAll = useSelectedStore((s) => s.addAllChecked);
  const { mediaItems } = useMediaStore();
  const { getSelectedUrls, getSelectedCount } = useSelectedStore();

  const handelAddAll = () => addAll(mediaItems);
  const handleDownload = async () => {
    const selectedUrls = getSelectedUrls();

    // fix: необходимо ли это?
    if (selectedUrls.length === 0) {
      console.error("No items selected for download.");
      return;
    }

    try {
      // Получаем прямые ссылки на медиафайл
      const directUrls = await new Promise((resolve) => {
        chrome.runtime.sendMessage(
          { type: "RESOLVE_DIRECT_LINKS", urls: selectedUrls },
          (resp) => {
            resolve(resp?.directUrls);
          }
        );
      });

      if (!directUrls) {
        console.error("Failed to resolve direct URL");
        return;
      }

      // Отправляем сообщение в background.ts для скачивания
      chrome.runtime.sendMessage(
        {
          type: "DOWNLOAD_VIDEOS",
          urls: directUrls,
        },
        (response) => {
          if (response?.success) {
            console.log("Download started successfully.");
          } else {
            console.error("Download failed:", response?.error);
          }
        }
      );
    } catch (error) {
      console.error("Error during download process:", error);
    }
  };

  return (
    <div className={styles["group-btns"]}>
      <CustomButton variant="outline" size="small" onClick={handelAddAll}>
        Select All
      </CustomButton>
      <CustomButton variant="outline" size="small" onClick={removeAll}>
        Remove All
      </CustomButton>
      <CustomButton
        onClick={handleDownload}
        disabled={getSelectedCount() === 0}
        className={styles["group-btns__download-btn"]}
        size="small"
      >
        Download
      </CustomButton>
    </div>
  );
}

export { GroupBtns };
