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
});
