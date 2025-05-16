import { useExtensionStatus } from "../../../store";
import { MediaListHeader } from "../../entities";
import { DownloadSummary, MediaListBlock } from "../../features";

function MediaListWidjet() {
  const extentionStatus = useExtensionStatus((state) => state.status);
  return (
    <div>
      <MediaListHeader />
      {extentionStatus === "showList" ? (
        <MediaListBlock />
      ) : (
        <DownloadSummary />
      )}
    </div>
  );
}

export { MediaListWidjet };
