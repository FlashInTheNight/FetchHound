import { useState } from "react";
import { scanForVideos } from "../lib/scanForVideos";
import { scanForImages } from "../lib/scanForImages";
import { Button } from "../ui/button/Button";

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
  console.log(activeTab);

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

  const handleClick = () => {
    console.log("Button clicked!");
  };

  return (
    <div>
      <h2>My Extension Popup</h2>
      <Button variant="primary" onClick={handleClick}>
        Primary Button
      </Button>
      <Button
        variant="secondary"
        onClick={handleClick}
        style={{ marginLeft: "10px" }}
      >
        Secondary Button
      </Button>
    </div>
  );
  // return (
  //   <div style={{ padding: "10px", width: "300px" }}>
  //     <h2>Video Downloader</h2>
  //     {/* Вкладки для выбора типа медиа */}
  //     <div style={{ marginBottom: "10px" }}>
  //       <button
  //         style={{
  //           fontWeight: activeTab === "videos" ? "bold" : "normal",
  //         }}
  //         onClick={() => setActiveTab("videos")}
  //       >
  //         Videos
  //       </button>
  //       <button
  //         style={{
  //           fontWeight: activeTab === "images" ? "bold" : "normal",
  //           marginLeft: "10px",
  //         }}
  //         onClick={() => setActiveTab("images")}
  //       >
  //         Images
  //       </button>
  //     </div>
  //     <button onClick={fetchVideos}>Scan Page for {activeTab}</button>
  //     {loading && <p>Loading videos...</p>}
  //     {error && <p style={{ color: "red" }}>{error}</p>}
  //     {!loading && videos === null && <p>No videos found.</p>}
  //     {videos !== null && videos.length > 0 && (
  //       <>
  //         <ul style={{ listStyle: "none", padding: 0 }}>
  //           {videos.map((video) => (
  //             <li key={video.url} style={{ marginBottom: "10px" }}>
  //               <label style={{ display: "flex", alignItems: "center" }}>
  //                 <input
  //                   type="checkbox"
  //                   checked={selected[video.url] || false}
  //                   onChange={() => toggleSelect(video.url)}
  //                 />
  //                 <div style={{ marginLeft: "5px" }}>
  //                   {video.thumb ? (
  //                     <img
  //                       src={video.thumb}
  //                       alt="thumb"
  //                       style={{ width: "50px", marginRight: "5px" }}
  //                     />
  //                   ) : null}
  //                   <span>{video.url}</span>
  //                 </div>
  //               </label>
  //             </li>
  //           ))}
  //         </ul>
  //         <div style={{ marginTop: "10px" }}>
  //           <button onClick={handleSelectAll}>Select All</button>
  //           <button onClick={handleDownload} style={{ marginLeft: "5px" }}>
  //             Download Selected
  //           </button>
  //         </div>
  //       </>
  //     )}
  //   </div>
  // );
}
