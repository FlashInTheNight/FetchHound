export interface MediaSearchResult {
  url: string | null;
  error?: string;
}

export const findWallpaperImage = (): MediaSearchResult => {
  try {
    // Ищем изображение по разным критериям
    const images = Array.from(document.querySelectorAll("img"));
    console.log("Found images:", images.length);
    
    // Сначала ищем по ID
    const wallpaperImg = document.getElementById("wallpaper") as HTMLImageElement;
    if (wallpaperImg?.tagName === "IMG") {
      return { url: wallpaperImg.src };
    }

    // Затем ищем по классам и атрибутам
    for (const img of images) {
      const src = (img as HTMLImageElement).src;
      if (!src) continue;

      // Проверяем ID
      if (["image", "wallpaper"].includes(img.id)) {
        return { url: src };
      }

      // Проверяем классы
      if (img.classList.toString().toLowerCase().includes("wallpaper")) {
        return { url: src };
      }

      // Проверяем атрибут alt
      if (img.alt.toLowerCase().includes("wallpaper")) {
        return { url: src };
      }
    }

    return { url: null, error: "No suitable image found" };
  } catch (error) {
    return { 
      url: null, 
      error: error instanceof Error ? error.message : "Unknown error during image search" 
    };
  }
}; 


// Регулярное выражение для проверки прямых ссылок на медиафайлы
const DIRECT_MEDIA_URL_PATTERN = /\.(mp4|webm|mkv|avi|mov|jpg|jpeg|png|gif|webp)(?:\?[^/]*)?$/i;

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