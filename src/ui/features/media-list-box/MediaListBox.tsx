// Тип для найденного видео
import { ScanAgain } from "../../shared/scan-again/ScanAgain";
import { MediaListMenu } from "../../shared/media-list-menus/MediaListMenu";
import { useMediaStore, useSelectedStore } from "../../../store";
import style from "./media-list.module.css";

function MediaListBox() {
  const { mediaItems } = useMediaStore();
  const { selected, setCheckedSelected } = useSelectedStore();

  function getFileName(url: string) {
    const idx = url.lastIndexOf("/");
    return idx !== -1 ? url.slice(idx + 1) : url;
  }

  return (
    <div>
      <ScanAgain />
      <MediaListMenu />
      <ul className={style["media-list"]}>
        {mediaItems.map((media) => (
          <li key={media.url}>
            <label className={style["media-list__label"]}>
              <input
                type="checkbox"
                checked={selected[media.url] || false}
                onChange={() => setCheckedSelected(media.url)}
              />
              <div className={style["media-list__item-thumb-wrapper"]}>
                {media.thumb ? (
                  <img
                    className={style["media-list__item-thumb"]}
                    src={media.thumb}
                    alt="thumb"
                  />
                ) : null}
              </div>
              <p className={style["media-list__item-name"]}>
                {getFileName(media.url)}
              </p>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

export { MediaListBox };
