// Тип для найденного видео
interface VideoItem {
  url: string;
  thumb: string | null;
}

interface ScanResponse {
  videos: VideoItem[];
}

// Интерфейс ответа от content script
interface Props {
  videos: ScanResponse[];
  selected: Record<string, boolean>;
  toggleSelect: (url: string) => void;
}

function MediaList({ videos, selected, toggleSelect }: Props) {
  // Функция для обработки выбора всех видео
  return (
    <>
      <ul>
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
      {/* <div style={{ marginTop: "10px" }}>
        <button onClick={handleSelectAll}>Select All</button>
        <button onClick={handleDownload} style={{ marginLeft: "5px" }}>
          Download Selected
        </button>
      </div> */}
    </>
  );
}

export { MediaList };
