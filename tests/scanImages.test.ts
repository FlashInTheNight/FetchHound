import { scanImages } from "../src/utils/scanners/scanImages";
import { describe, it, expect, beforeEach } from "vitest";
import PicsFixture from "./fixtures/media-pics.html?raw";

describe("Scan images in sites HTML", () => {
  beforeEach(() => {
    document.body.innerHTML = PicsFixture;
  });

  it("find link with image in figure", () => {
    const images = scanImages();
    expect(images).toEqual(
      expect.arrayContaining([
        {
          url: "https://wallhaven.cc/w/6d38x6",
          thumb: "https://th.wallhaven.cc/small/6d/6d38x6.jpg",
        },
      ])
    );
  });
});
