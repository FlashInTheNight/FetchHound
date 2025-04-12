import { useState } from "react";
import { scanForVideos } from "../lib/scanForVideos";

export default function Popup() {
  const [videos, setVideos] = useState<any[] | null>(null);
  const [error, setError] = useState<string | undefined>();

  const countPTags = async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (!tab?.id) return;

    try {
      const [result] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: scanForVideos,
      });

      console.log("result is: ", result);

      if (!result.result) {
        throw Error("i cant");
      }

      setVideos(result.result);
    } catch (error) {
      console.error("Error counting p tags:", error);
    }
  };

  // Отправка сообщения в background script для последовательного скачивания выбранных видео
  const handleDownload = () => {
    if (videos === null) {
      return;
    }
    // const selectedVideos = videos.map((video) => video.url);
    // console.log("Downloading videos sequentially: ", selectedVideos);

    chrome.runtime.sendMessage(
      {
        type: "DOWNLOAD_VIDEOS",
        urls: videos.map((video) => video.url),
      },
      (response) => {
        if (chrome.runtime.lastError) {
          setError(chrome.runtime.lastError.message);
          console.error("Download error:", chrome.runtime.lastError);
        } else {
          console.log("Download response: ", response);
        }
      }
    );
  };

  return (
    <div style={{ minWidth: "300px", padding: "16px" }}>
      <button
        onClick={countPTags}
        style={{
          padding: "8px 16px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Count P Tags
      </button>
      {videos !== null && (
        <p style={{ marginTop: "12px", color: "white" }}>
          Found {videos.length} videos
        </p>
      )}
      <button type="button" onClick={handleDownload} disabled={videos === null}>
        Download Videos
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
