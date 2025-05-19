import {
  SelectedItem,
  useDownloadedResultStore,
  useDownloadStatus,
  useErrorStore,
  useExtensionStatus,
  useMediaStore,
  useSelectedStore,
  useTabStore,
} from "../../../store";
import { CustomButton } from "../../shared";
import styles from "./group-btns.module.css";
import { type MediaSearchResult } from "../../../types";
// import { getSortedDirectUrls } from "../../../utils";
import { DownloadResult } from "../../../utils/background/downloadUtils";

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
  const { mediaItems, setMediaItems } = useMediaStore();
  const {
    getSelectedCount,
    removeAllChecked,
    getObjectSelectedUrls,
  } = useSelectedStore();
  const { setUrls } = useDownloadedResultStore();
  const { activeTab } = useTabStore();
  const { setError } = useErrorStore();
  const { setExtentionStatus } = useExtensionStatus();
  const { setDownloadStatus } = useDownloadStatus();

  const handelAddAll = () => addAll(mediaItems);
  const handleDownload = async () => {
    try {
      setError("");
      setMediaItems([]);
      setExtentionStatus("downloading");
      setDownloadStatus("downloaded");
      const selectedUrlsObject = getObjectSelectedUrls();

      if (getSelectedCount() === 0) {
        throw new Error("No media items selected for download.");
      }

      // Получаем прямые ссылки на медиафайл
      const {
        iGetResolveDirectLinkError,
        updatedSelectedUrls,
      }: {
        iGetResolveDirectLinkError: boolean;
        updatedSelectedUrls: Record<string, SelectedItem>;
      } = await new Promise((resolve) => {
        chrome.runtime.sendMessage(
          {
            type: "RESOLVE_DIRECT_LINKS",
            urls: selectedUrlsObject,
            mediaTab: activeTab,
          },
          (resp) => {
            resolve(resp?.directUrls);
          }
        );
      });

      // Отправляем сообщение в background.ts для скачивания
      const downloadResult = await new Promise<DownloadResult>(
        (resolve, reject) => {
          chrome.runtime.sendMessage(
            {
              type: "DOWNLOAD_VIDEOS",
              urls: updatedSelectedUrls,
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
              resolve(response as DownloadResult);
            }
          );
        }
      );

      if (
        iGetResolveDirectLinkError === true ||
        downloadResult.success === false
      ) {
        setUrls(downloadResult.urls);
        throw new Error("Failed to download some files");
      }

      setDownloadStatus("success");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.";
      setError(errorMessage);
      setDownloadStatus("error");
    } finally {
      removeAllChecked();
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
