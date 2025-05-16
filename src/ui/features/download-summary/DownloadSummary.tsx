import { useDownloadStatus } from "../../../store";
import { DownloadResults, DownloadSummaryMessage } from "./components";

export const DownloadSummary = () => {
  const downloadStatus = useDownloadStatus((state) => state.status);

  return (
    <div>
      {downloadStatus === "downloaded" ? (
        <div>loading...</div>
      ) : (
        <>
          <DownloadResults />
          <DownloadSummaryMessage />
        </>
      )}
    </div>
  );
};
