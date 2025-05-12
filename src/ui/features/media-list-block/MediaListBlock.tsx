import { useMediaListMode } from "../../../store";
import { ExcludeGroupBtns, GroupBtns, MediaList } from "../../entities";

function MediaListBlock() {
  const { activeMode } = useMediaListMode();

  return (
    <div>
      <MediaList />
      {activeMode === "normal" ? <GroupBtns /> : <ExcludeGroupBtns />}
    </div>
  );
}

export { MediaListBlock };
