import { useState } from "react";
import { scanForVideos } from "../lib/scanForVideos";

// Тип для найденного видео
interface VideoItem {
  url: string;
  thumb: string | null;
}

// Интерфейс ответа от content script
interface ScanResponse {
  videos: VideoItem[];
}

export default function Popup() {
  const [videos, setVideos] = useState<ScanResponse[] | null>(null);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Функция для запроса сканирования страницы
  const fetchVideos = async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (!tab?.id) return;

    try {
      setLoading(true);
      setError("");
      const [result] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: scanForVideos,
      });

      console.log("result is: ", result);

      if (!result.result) {
        throw Error("No videos found.");
      }

      setVideos(result.result);
      // Инициализируем объект выбора: для каждого URL значение false
      const initSelect: Record<string, boolean> = {};
      result.result.forEach((video) => {
        initSelect[video.url] = false;
      });
      setSelected(initSelect);
    } catch (error) {
      console.error("Error searchin  videos:", error);
      // возможно стоит перезаписать переменную videos null
    } finally {
      setLoading(false);
    }
  };

  // Переключение чекбокса для видео
  const toggleSelect = (url: string) => {
    setSelected((prev) => ({
      ...prev,
      [url]: !prev[url],
    }));
  };

  // Выбрать все видео
  const handleSelectAll = () => {
    if (videos === null) {
      console.log("error caused in handleSelectAll fn");
      return;
    }
    const newSelection: Record<string, boolean> = {};
    videos.forEach((video) => {
      newSelection[video.url] = true;
    });
    setSelected(newSelection);
  };

  // Отправка сообщения в background script для последовательного скачивания выбранных видео
  const handleDownload = () => {
    if (videos === null) {
      return;
    }

    const videosForDownload = [];

    for (const key in selected) {
      if (selected[key]) {
        videosForDownload.push(key);
      }
    }

    if (!videosForDownload.length) {
      console.error("Array videosForDownload is empty");
      return;
    }
    chrome.runtime.sendMessage(
      {
        type: "DOWNLOAD_VIDEOS",
        urls: videosForDownload,
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
    <div style={{ padding: "10px", width: "300px" }}>
      <h2>Video Downloader</h2>
      <button onClick={fetchVideos}>Scan Page</button>
      {loading && <p>Loading videos...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && videos === null && <p>No videos found.</p>}
      {videos !== null && videos.length > 0 && (
        <>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {videos.map((video) => (
              <li key={video.url} style={{ marginBottom: "10px" }}>
                <label style={{ display: "flex", alignItems: "center" }}>
                  <input
                    type="checkbox"
                    checked={selected[video.url] || false}
                    onChange={() => toggleSelect(video.url)}
                  />
                  <div style={{ marginLeft: "5px" }}>
                    {video.thumb ? (
                      <img
                        src={video.thumb}
                        alt="thumb"
                        style={{ width: "50px", marginRight: "5px" }}
                      />
                    ) : null}
                    <span>{video.url}</span>
                  </div>
                </label>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: "10px" }}>
            <button onClick={handleSelectAll}>Select All</button>
            <button onClick={handleDownload} style={{ marginLeft: "5px" }}>
              Download Selected
            </button>
          </div>
        </>
      )}
    </div>
  );
}
