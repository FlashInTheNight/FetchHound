import { useDownloadStatus } from "../../../../store";
import { DownloadResultsList } from "./DownloadResultsList";

export const DownloadResults = () => {
  const downloadStatus = useDownloadStatus((state) => state.status);

  return (
    <div>
      {downloadStatus === "success" ? (
        <div>
          <p>all link downloaded</p>
        </div>
      ) : (
        <DownloadResultsList />
      )}
    </div>
  );
};
