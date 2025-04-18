import { ScanBox } from "../ui/features/scan-box/ScanBox";
import style from "./popup.module.css";
import { useMediaStore } from "../store";
import { MediaListBox } from "../ui/features/media-list-box/MediaListBox";

export default function Popup() {
  const { mediaItems } = useMediaStore();

  return (
    <main>
      <div className={style.header}>
        <h1 className={style.title}>Media Downloader</h1>
        <span className={style.burgerMenu}></span>
      </div>
      {mediaItems.length === 0 ? <ScanBox /> : <MediaListBox />}
    </main>
  );
}
