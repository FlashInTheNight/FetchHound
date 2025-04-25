import { scanVideos } from "../src/lib/scanVideos";
import { describe, it, expect, beforeEach } from "vitest";
import fixtureSites from "./fixtures/media-sites.html?raw";

describe("Scan videos in sites HTML", () => {
  beforeEach(() => {
    document.body.innerHTML = fixtureSites;
  });

  it("finds all two video in 2ch site", () => {
    const videos = scanVideos();
    expect(videos).toEqual(
      expect.arrayContaining([
        {
          url: "http://localhost:3000/media/src/951499/17434923155460.mp4",
          thumb: "http://localhost:3000/media/thumb/951499/17434923155460s.jpg",
        },
        {
          url: "http://localhost:3000/media/src/951499/17434923155491.webm",
          thumb: "http://localhost:3000/media/thumb/951499/17434923155491s.jpg",
        },
      ])
    );
  });

  it("ignores duplicate video URLs in 2ch site", () => {
    const videos = scanVideos();
    const duplicates = videos.filter(
      (video) =>
        video.url ===
          "http://localhost:3000/media/src/951499/17434923155491.webm" ||
        video.url ===
          "http://localhost:3000/media/src/951499/17434923155460.mp4"
    );
    expect(duplicates).toHaveLength(2);
  });

  it("find video item in reddit", () => {
    const video = scanVideos();
    expect(video).toEqual(
      expect.arrayContaining([
        {
          url: "https://packaged-media.redd.it/6r1tvkw8blwe1/pb/m2-res_594p.mp4?m=DASHPlaylist.mpd&v=1&e=1745488800&s=22f1f38e1fab0a0aed9fd9c3ff01a53ecb5c116f",
          thumb:
            "https://external-preview.redd.it/body-armor-company-demonstrates-their-stab-protection-on-v0-NTVveGF2MDlibHdlMWBD0rlOZOc1bhiSmvEHWUOlQkWTvVq1wWwxf5uPRr2m.png?width=640&crop=smart&format=pjpg&auto=webp&s=507310a433a22697cbcba1bc518eee24fb0be23a",
        },
      ])
    );
  });

  it("find video item in 4chan", () => {
    const video = scanVideos();
    expect(video).toEqual(
      expect.arrayContaining([
        {
          url: "https://i.4cdn.org/wsg/1612345678901.webm",
          thumb: null,
        },
      ])
    );
  });

  it("find video item in civitai", () => {
    const video = scanVideos();
    expect(video).toEqual(
      expect.arrayContaining([
        {
          url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/017f28c0-b382-46ce-8aa3-4576f4bb9b54/transcode=true,width=450/71844242.webm",
          thumb:
            "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/017f28c0-b382-46ce-8aa3-4576f4bb9b54/anim=false,transcode=true,width=450/017f28c0-b382-46ce-8aa3-4576f4bb9b54.jpeg",
        },
      ])
    );
  });

  it("video item with another MIME type should not includes", () => {
    const video = scanVideos();
    expect(video).not.toEqual(
      expect.arrayContaining([
        {
          url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/017f28c0-b382-46ce-8aa3-4576f4bb9b54/transcode=true,width=450/71844242.mp4",
          thumb: null,
        },
      ])
    );
  });
});
