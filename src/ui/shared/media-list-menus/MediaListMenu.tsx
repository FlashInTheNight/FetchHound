import { useSelectedStore, useMediaStore } from "../../../store";
// import { Button } from "../button/Button";
import style from "./media-list-menu.module.css";

export function MediaListMenu() {
  const { addAllChecked, removeAllChecked } = useSelectedStore();
  const { mediaItems } = useMediaStore();

  const handleSelectAll = () => addAllChecked(mediaItems);
  const handleRemoveAll = () => removeAllChecked();
  const handleDownload = () => console.log("Download button clicked");

  // Отправка сообщения в background script для последовательного скачивания выбранных видео
  // const handleDownload = () => {
  //   if (videos === null) {
  //     return;
  //   }

  //   const videosForDownload = [];

  //   for (const key in selected) {
  //     if (selected[key]) {
  //       videosForDownload.push(key);
  //     }
  //   }

  //   if (!videosForDownload.length) {
  //     console.error("Array videosForDownload is empty");
  //     return;
  //   }
  //   chrome.runtime.sendMessage(
  //     {
  //       type: "DOWNLOAD_VIDEOS",
  //       urls: videosForDownload,
  //     },
  //     (response) => {
  //       if (chrome.runtime.lastError) {
  //         setError(chrome.runtime.lastError.message);
  //         console.error("Download error:", chrome.runtime.lastError);
  //       } else {
  //         console.log("Download response: ", response);
  //       }
  //     }
  //   );
  // };

  return (
    <div className={style["wrapper"]}>
      {/* <Button onClick={handleSelectAll} textSize="small">
        Select All
      </Button>
      <Button onClick={handleRemoveAll} textSize="small">
        Remove All selected
      </Button>
      <Button onClick={handleDownload} textSize="small" variant="secondary">
        Download Selected
      </Button> */}
    </div>
  );
}
