export interface MediaSearchResult {
  url: string | null;
  error?: string;
}

export const findWallpaperImage = (): MediaSearchResult => {
  const IMAGES_IDS = ["image", "wallpaper"];
  const imageFormatRegex = /\.(jpg|jpeg|webm|gif|png)(\?.*)?$/i;
  try {
    // Ищем изображение по разным критериям
    const images = Array.from(document.querySelectorAll("img"));
    // console
    console.log("Found images:", images.length);

    for (const img of images) {
      console.log("current img: ", img);
      const src = (img as HTMLImageElement).src;
      console.log("current src: ", src);
      if (!src) continue;
      // Проверяем по ID
      // const imgID = (img as HTMLImageElement).id;
      // if (imgID && IMAGES_IDS.includes(imgID)) {
      //   return { url: src };
      // }

      // Проверяем по последней части пути ссылки
      const lastRoute = location.pathname.split("/").pop();
      console.log("last route: ", lastRoute);
      const isPathIncluded = lastRoute ? src.includes(lastRoute) : false;
      console.log("isPathIncluded: ", isPathIncluded);
      if (lastRoute && src.includes(lastRoute)) {
        return { url: src };
      } else {
        console.log("cant find throught pathname");
      }

      // Проверяем по атрибуту alt. Beta version. Суть: если в alt есть более 4 слов, то это обои, так как эти слова используются для тегов(неправильный вывод). В alt часто содержится название картинки с расширением
      if (img.alt && imageFormatRegex.test(img.alt)) {
        return { url: src };
      }

      // Проверяем классы. Beta version. Суть: если в классе есть слово wallpaper, то это обои.
      // Привет тут есть кто, если есть то дайте знак, я тут сижу и жду вас, а вы кто? ...
      // if (img.classList.toString().toLowerCase().includes("wallpaper")) {
      //   return { url: src };
      // }
    }

    return { url: null, error: "No suitable image found" };
  } catch (error) {
    return {
      url: null,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error during image search",
    };
  }
};

// Регулярное выражение для проверки прямых ссылок на медиафайлы
const DIRECT_MEDIA_URL_PATTERN =
  /\.(mp4|webm|mkv|avi|mov|jpg|jpeg|png|gif|webp)(?:\?[^/]*)?$/i;

// Функция проверки является ли ссылка прямой
export const isDirectMediaUrl = (url: string): boolean => {
  try {
    // Убираем протокол и домен для проверки только пути
    const urlPath = new URL(url).pathname;
    return DIRECT_MEDIA_URL_PATTERN.test(urlPath);
  } catch {
    // Если URL некорректный, считаем что это не прямая ссылка
    return false;
  }
};
