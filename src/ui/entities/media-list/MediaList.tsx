import { useMediaStore } from "../../../store";
import MediaListItem from "./MediaListItem";
import { MediaItem } from "../../../types";
import styles from "./media-list.module.css";

function MediaList() {
  // здесь только список медиа, на него не влияют клики
  const mediaItems = useMediaStore((s) => s.mediaItems);

  return (
    <ul className={styles["media-list"]}>
      {mediaItems.map((item: MediaItem) => (
        <MediaListItem key={item.url} item={item} />
      ))}
    </ul>
  );
}

export { MediaList };
