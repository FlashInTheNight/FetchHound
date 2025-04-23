import { scanVideos } from "../src/lib/scanVideos";
import { describe, it, expect, beforeEach } from "vitest";
import fixtureMixed from "./fixtures/media-mixed.html?raw";

describe("Scan videos in mixed HTML", () => {
  beforeEach(() => {
    document.body.innerHTML = fixtureMixed;
  });

  it("finds all video URLs in <video> tags", () => {
    const videos = scanVideos();
    expect(videos).toEqual(
      expect.arrayContaining([
        { url: "https://example.com/videos/video1.mp4", thumb: "thumb1.jpg" },
      ])
    );
  });

  it("finds all video URLs in <source> tags outside <video>", () => {
    const videos = scanVideos();
    expect(videos).toEqual(
      expect.arrayContaining([
        { url: "/media/src/951499/17434923155460.mp4", thumb: null },
      ])
    );
  });

  it("finds all video URLs in <a> tags", () => {
    const videos = scanVideos();
    expect(videos).toEqual(
      expect.arrayContaining([
        {
          url: "http://localhost:3000/media/src/951499/17434923155491.webm",
          thumb: null,
        },
      ])
    );
  });

  it("finds video URLs with query parameters", () => {
    const videos = scanVideos();
    expect(videos).toEqual(
      expect.arrayContaining([
        { url: "https://cdn.example.com/media/video245.mp4?token=abc123", thumb: null },
      ])
    );
  });

  it("ignores unsupported file types", () => {
    const videos = scanVideos();
    expect(videos).not.toEqual(
      expect.arrayContaining([
        { url: "/docs/manual.pdf", thumb: null },
        { url: "https://example.com/archive.zip", thumb: null },
      ])
    );
  });

  it("ignores duplicate video URLs", () => {
    const videos = scanVideos();
    const duplicates = videos.filter(
      (video) => video.url === "/media/src/951499/17434923155460.mp4"
    );
    expect(duplicates).toHaveLength(1);
  });

  it("handles empty or invalid elements gracefully", () => {
    const videos = scanVideos();
    expect(videos).not.toEqual(
      expect.arrayContaining([
        { url: undefined, thumb: null },
      ])
    );
  });

  it("ignores videos with unsupported MIME types", () => {
    const videos = scanVideos();
    expect(videos).not.toEqual(
      expect.arrayContaining([
        { url: "video3.ogg", thumb: null },
      ])
    );
  });

});
