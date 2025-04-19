import style from "./popup.module.css";
import { useMediaStore } from "../store";
import { CircleChevronDown, Menu } from "lucide-react";
import { MediaTabs } from "../ui/entities";

export default function Popup() {
  const { mediaItems } = useMediaStore();

  return (
    <main>
      <header className={style.header}>
        <CircleChevronDown color="#ffffff" />
        <h1 className={style.title}>Media Downloader</h1>
        <Menu color="#ffffff" />
      </header>
      {/* {mediaItems.length === 0 ? <ScanBox /> : <MediaListBox />} */}
      <MediaTabs />
    </main>
  );
}
