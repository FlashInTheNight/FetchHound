import { useState } from "react";
import { scanForVideos } from "../lib/scanForVideos";
import { scanForImages } from "../lib/scanForImages";
import { MediaList } from "../ui/shared/media-list/MediaList";
import { ScanPage } from "../ui/features/scan-page/ScanPage";
import style from "./popup.module.css";


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
  const [activeTab, setActiveTab] = useState<"videos" | "images">("videos");
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

    const currentScanFn =
      activeTab === "videos" ? scanForVideos : scanForImages;
    try {
      setLoading(true);
      setError("");
      const [result] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: scanForImages,
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
    <main>
      <div className={style.header}>
        <h1 className={style.title}>Media Downloader</h1>
        <span className={style.burgerMenu}></span>
      </div>
      <ScanPage />
    </main>
  )

  // return (
  //   <main>
  //     <div>
  //       <h1>Media Downloader</h1>
  //       <span>Burger menu</span>
  //     </div>
  //     {/* Вкладки для выбора типа медиа */}
  //     < VariantMediaGroup activeTab={activeTab} setActiveTab={setActiveTab} />
  //     <button onClick={fetchVideos}>Scan Page for {activeTab}</button>
  //     {loading && <p>Loading videos...</p>}
  //     {error && <p style={{ color: "red" }}>{error}</p>}
  //     {!loading && videos === null && <p>No videos found.</p>}
  //     {videos !== null && videos.length > 0 && (
  //       <MediaList
  //         videos={videos}
  //         selected={selected}
  //         toggleSelect={toggleSelect}
  //       />
  //     )}
  //   </main>
  // );
}
