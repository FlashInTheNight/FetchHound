export interface VideoSearchResult {
  url: string | null;
  error?: string;
}

export const findDirectVideoLink = (): VideoSearchResult => {
  const videoTag = document.querySelector("video[id]");

  if (!videoTag) {
    return {
      url: null,
      error: "Cant find throught pathname",
    };
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
    return { url: videoUrl };
  } else {
    return {
      url: null,
      error: "Cant find throught pathname",
    };
  }
};
