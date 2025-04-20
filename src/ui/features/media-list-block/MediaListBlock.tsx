import styles from "./media-list.module.css";
import { GroupBtns, MediaList } from "../../entities";

function MediaListBlock() {
  return (
    <div>
      <MediaList />
      <GroupBtns />
    </div>
  );
}

export { MediaListBlock };
