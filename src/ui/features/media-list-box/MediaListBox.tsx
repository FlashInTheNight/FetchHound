// Тип для найденного видео
import { VideoItem } from "../../../types";
import { ScanAgain } from "../../shared/scan-again/ScanAgain";
import {MediaListMenu} from "../../shared/media-list-menus/MediaListMenu";
// Интерфейс ответа от content script
interface Props {
  videos: VideoItem[];
  selected: Record<string, boolean>;
  toggleSelect: (url: string) => void;
}

function MediaListBox({ videos = [], selected, toggleSelect }: Props) {
  return (
    <>
      <ScanAgain />
      <MediaListMenu />
      <ul>
        {videos.map((video) => (
          <li key={video.url}>
            <label>
              <input
                type="checkbox"
                checked={selected[video.url] || false}
                onChange={() => toggleSelect(video.url)}
              />
              <div>
                {video.thumb ? (
                  <img
                    src={video.thumb}
                    alt="thumb"
                  />
                ) : null}
                <span>{video.url}</span>
              </div>
            </label>
          </li>
        ))}
      </ul>
    </>
  );
}

export { MediaListBox };
