import React, { memo, useCallback } from "react";
import clsx from "clsx";
import { useMediaListMode, useSelectedStore } from "../../../store";
import { CheckIcon, PlaceholderIcon } from "../../shared";
import { getFileName } from "../../../utils/getFileName";
import { MediaItem } from "../../../types";
import { ExcludeIcon } from "../../shared/icons/ExcludeIcon";
import styles from "./media-list.module.css";

interface Props {
  item: MediaItem;
}

const MediaListItem: React.FC<Props> = ({ item }) => {
  const name = getFileName(item.url);

  // Подписываемся только на true/false для этого URL
  const isSel = useSelectedStore((state) => state.selected.has(item.url));

  // Берём колбэк из стора
  const toggle = useSelectedStore((state) => state.setCheckedSelected);
  const mode = useMediaListMode((state) => state.activeMode);

  // Стабильный колбэк по URL
  // Если не использовать useCallback, то при каждом рендере будет создаваться новый колбэк
  const onClick = useCallback(() => {
    toggle(item.url);
  }, [toggle, item.url]);

  // console
  // console.log("media element rendered", name, isSel);

  return (
    <li
      className={clsx(styles["media-item"], {
        [styles["media-item--selected"]]: isSel && mode === "normal",
        [styles["media-item--selected-excluded"]]: isSel && mode === "exclude",
      })}
      onClick={onClick}
    >
      <div className={styles["media-thumb"]}>
        {item.thumb ? (
          <img src={item.thumb} alt={name} />
        ) : (
          <div className={styles["media-thumb__placeholder"]}>
            <PlaceholderIcon />
          </div>
        )}
        {isSel && (
          <div className={styles["media-thumb__overlay"]}>
            {mode === "normal" ? (
              <CheckIcon />
            ) : (
              <ExcludeIcon size={34} color="#fff" />
            )}
          </div>
        )}
      </div>
      <div className={styles["media-descr"]}>
        <span className={styles["media-name"]}>{name}</span>
        {item.error && (
          <p className={styles["media-error-descr"]}>Error: {item.error}</p>
        )}
      </div>
    </li>
  );
};

// React.memo сравнит пропы (item.url и item.thumb) и селектор isSel внутри
export default memo(MediaListItem);
