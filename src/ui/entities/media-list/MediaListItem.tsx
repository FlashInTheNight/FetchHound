import React, { memo, useCallback } from "react";
import clsx from "clsx";
import { useSelectedStore } from "../../../store";
import { CheckIcon, PlaceholderIcon } from "../../shared";
import { getFileName } from "../../../lib/getFileName";
import { MediaItem } from "../../../types";
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

  // Стабильный колбэк по URL
  // Если не использовать useCallback, то при каждом рендере будет создаваться новый колбэк
  const onClick = useCallback(() => {
    toggle(item.url);
  }, [toggle, item.url]);

  // console
  console.log("media element rendered", name, isSel);

  return (
    <li
      className={clsx(styles["media-item"], {
        [styles["media-item--selected"]]: isSel,
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
            <CheckIcon />
          </div>
        )}
      </div>
      <span className={styles["media-name"]}>{name}</span>
    </li>
  );
};

// React.memo сравнит пропы (item.url и item.thumb) и селектор isSel внутри
export default memo(MediaListItem);
