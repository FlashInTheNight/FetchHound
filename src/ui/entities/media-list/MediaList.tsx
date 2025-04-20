import clsx from "clsx";
import { useMediaStore, useSelectedStore } from "../../../store";
import styles from "./media-list.module.css";
import { CheckIcon } from "../../shared";

function MediaList() {
  const { mediaItems } = useMediaStore();
  const { selected, setCheckedSelected } = useSelectedStore();

  return (
    <ul className={styles["media-list"]}>
      {mediaItems.map((item) => {
        const name = item.url.slice(item.url.lastIndexOf("/"));
        const isSel = !!selected[item.url];
        return (
          <li
            key={item.url}
            className={clsx(
              styles["media-item"],
              {
                [styles["media-item--selected"]]: isSel,
              }
            )}
            onClick={() => setCheckedSelected(item.url)}
          >
            <div className={styles["media-thumb"]}>
              <img src={item.thumb || item.url} alt={name} />
              {isSel && (
                <div className={styles["media-thumb__overlay"]}>
                  <CheckIcon />
                </div>
              )}
            </div>
            <span className={styles["media-name"]}>{name}</span>
          </li>
        );
      })}
    </ul>
  );
}

export { MediaList };
