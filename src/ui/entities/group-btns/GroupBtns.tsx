import {
  useErrorStore,
  useMediaStore,
  useSelectedStore,
  useTabStore,
} from "../../../store";
import { CustomButton } from "../../shared";
import styles from "./group-btns.module.css";
import { type MediaSearchResult } from "../../../types";
import { getSortedDirectUrls } from "../../../utils";

interface DownloadResponse {
  success: boolean;
  error?: string;
  results?: {
    url: string;
    success: boolean;
    error?: string;
  }[];
}

function GroupBtns() {
  const removeAll = useSelectedStore((s) => s.removeAllChecked);
  const addAll = useSelectedStore((s) => s.addAllChecked);
  const { mediaItems, getMediaItems, setMediaItems } = useMediaStore();
  const { getSelectedUrls, getSelectedCount, removeAllChecked } =
    useSelectedStore();
  const { activeTab } = useTabStore();
  const { setError, setAdditionalError, getError } = useErrorStore();

  const handelAddAll = () => addAll(mediaItems);
  const handleDownload = async () => {
    const selectedUrls = getSelectedUrls();
    try {
      setError("");
      if (selectedUrls.length === 0) {
        throw new Error("No media items selected for download.");
      }

      // Получаем прямые ссылки на медиафайл
      const directUrls: MediaSearchResult[] | [] = await new Promise(
        (resolve) => {
          chrome.runtime.sendMessage(
            {
              type: "RESOLVE_DIRECT_LINKS",
              urls: selectedUrls,
              mediaTab: activeTab,
            },
            (resp) => {
              resolve(resp?.directUrls);
            }
          );
        }
      );

      if (!directUrls || directUrls.length === 0) {
        throw new Error("Failed to resolve direct download links.");
      }

      console.log("directUrls", directUrls);

      // функция для фильтрации ссылок
      const mediaItems = getMediaItems();
      const { urlsWithError, urlsForDownload } = getSortedDirectUrls(
        directUrls,
        mediaItems
      );

      console.log("urlsWithError", urlsWithError);
      console.log("urlsForDownload", urlsForDownload);
      removeAllChecked();
      if (urlsWithError.length > 0) {
        setMediaItems(urlsWithError);
        setError("Some media items could not be downloaded.");
      } else {
        setMediaItems([]);
      }

      // Отправляем сообщение в background.ts для скачивания
      const downloadResult = await new Promise<DownloadResponse>((resolve, reject) => {
        chrome.runtime.sendMessage(
          {
            type: "DOWNLOAD_VIDEOS",
            urls: urlsForDownload,
          },
          (response) => {
            if (chrome.runtime.lastError) {
              reject(new Error(chrome.runtime.lastError.message));
              return;
            }
            if (!response) {
              reject(new Error("No response from background script"));
              return;
            }
            resolve(response as DownloadResponse);
          }
        );
      });

      console.log("Response from background:", downloadResult);

      if (!downloadResult.success) {
        const failedDownloads = downloadResult.results?.filter(r => !r.success) || [];
        if (failedDownloads.length > 0) {
          const errorMessages = failedDownloads.map(r => `${r.url}: ${r.error}`).join('\n');
          throw new Error(`Failed to download some files:\n${errorMessages}`);
        }
        throw new Error(downloadResult.error || "Failed to download media");
      }

      console.log("Download started successfully.");
    } catch (error) {
      console.error("Error during download process:", error);
      const errorMessage = error instanceof Error
        ? error.message
        : "An unexpected error occurred.";
      setAdditionalError(errorMessage);
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
