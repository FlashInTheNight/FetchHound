import { type ScanDirectLinkResult } from "../../types";

export const findDirectVideoLink = (): ScanDirectLinkResult => {
  try {
    const videoTag = document.querySelector("video[id]");

    if (!videoTag) {
      throw Error("No suitable video element found.");
    }

    const [video] = [videoTag];
    let videoUrl = video.getAttribute("src");
    if (!videoUrl) {
      const sourceElem = video.querySelector("source");
      if (sourceElem) {
        videoUrl = sourceElem.getAttribute("src");
      }
    }
    if (videoUrl) {
      return { directUrl: videoUrl };
    } else {
      throw Error("No video source URL found.");
    }
  } catch (error) {
    return {
      directUrl: null,
      error:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred during video search.",
    };
  }
};
