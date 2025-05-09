export interface UnknownMediaLinkResult {
  url: string | null;
  error?: string;
}

export const findUnknownMediaLink = (): UnknownMediaLinkResult => {
  const videoTag = document.querySelector("video[id]");
  const IMAGES_IDS = ["image", "wallpaper"];
  const DIRECT_MEDIA_URL_PATTERN =
    /\.(mp4|webm|mkv|avi|mov|jpg|jpeg|png|gif|webp)(?:\?[^/]*)?$/i;

  if (videoTag) {
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
    }
  }

  const images = Array.from(document.querySelectorAll("img"));

  for (const img of images) {
    console.log("current img: ", img);
    const src = (img as HTMLImageElement).src;
    console.log("current src: ", src);
    if (!src) continue;

    // Проверяем по ID
    const imgID = (img as HTMLImageElement).id;
    if (imgID && IMAGES_IDS.includes(imgID)) {
      return { url: src };
    }

    // Проверяем по последней части пути ссылки
    const lastRoute = location.pathname.split("/").pop();
    console.log("last route: ", lastRoute);
    const isPathIncluded = lastRoute ? src.includes(lastRoute) : false;
    console.log("isPathIncluded: ", isPathIncluded);
    if (lastRoute && src.includes(lastRoute)) {
      return { url: src };
    }

    // Проверяем по атрибуту alt. Beta version. В alt часто содержится название картинки с расширением
    if (img.alt && DIRECT_MEDIA_URL_PATTERN.test(img.alt)) {
      return { url: src };
    }

    // Проверяем классы. Beta version. Суть: если в классе есть слово wallpaper, то это обои.
    // Привет тут есть кто, если есть то дайте знак, я тут сижу и жду вас, а вы кто? ...
    // if (img.classList.toString().toLowerCase().includes("wallpaper")) {
    //   return { url: src };
    // }
  }

  return {
    url: null,
    error: "Couldn't find the media item at this link",
  };
};
