import { useMediaStore } from "../store";
import { MediaListWidjet, StartBlockWidjet } from "../ui/widjets";
import style from "./popup.module.css";

export default function Popup() {
  const { mediaItems } = useMediaStore();

  return (
    <main className={style["app-wrapper"]}>
      <header className={style.header}>
        <h1 className={style.title}>Media Downloader</h1>
      </header>
      <MediaListWidjet />
      {/* <StartBlockWidjet /> */}
      {/* {mediaItems.length === 0 ? <StartBlock /> : <MediaListBlock />} */}
    </main>
  );
}
