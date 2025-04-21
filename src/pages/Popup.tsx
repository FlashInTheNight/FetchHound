import { useMediaStore } from "../store";
import { CircleChevronDown, Menu } from "lucide-react";
import { MediaListWidjet, StartBlockWidjet } from "../ui/widjets";
import style from "./popup.module.css";

export default function Popup() {
  const { mediaItems } = useMediaStore();

  return (
    <main className={style["app-wrapper"]}>
      <header className={style.header}>
        <CircleChevronDown color="#ffffff" />
        <h1 className={style.title}>Media Downloader</h1>
        <Menu color="#ffffff" />
      </header>
      {/* <MediaListWidjet /> */}
      <StartBlockWidjet />
      {/* {mediaItems.length === 0 ? <StartBlock /> : <MediaListBlock />} */}
    </main>
  );
}
