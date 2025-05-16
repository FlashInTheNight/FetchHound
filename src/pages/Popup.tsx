import { useExtensionMode, useExtensionStatus, useMediaStore } from "../store";
import { SettingsMenu } from "../ui/entities";
import { MediaListWidjet, StartBlockWidjet } from "../ui/widjets";
import style from "./popup.module.css";

export default function Popup() {
  const { mode } = useExtensionMode();

  return (
    <main className={style["app-wrapper"]}>
      <header className={style.header}>
        <h1 className={style.title}>Media Downloader</h1>
        <SettingsMenu />
      </header>
      {mode === "scan" ? <StartBlockWidjet /> : <MediaListWidjet />}
    </main>
  );
}
