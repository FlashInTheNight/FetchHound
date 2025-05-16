import { useDownloadStatus, useErrorStore } from "../../../../store";

export const DownloadSummaryMessage = () => {
  const downloadStatus = useDownloadStatus((state) => state.status);
  const error = useErrorStore((state) => state.error);
  return (
    <div>{downloadStatus === "success" ? <p>success</p> : <p>Some error appear</p>}</div>
  );
};
