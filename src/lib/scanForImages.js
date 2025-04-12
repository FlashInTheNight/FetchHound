
export function scanForImages() {
  const images = [];

  // Сканируем ссылки <a>, ведущие на видеофайлы
  const anchorElems = Array.from(document.querySelectorAll('a[href$=".jpg"], a[href$=".jpeg"], a[href$=".png"], a[href$=".webp"], a[href$=".gif"]'));
  console.log('anchroEl in images: ', anchorElems)
  anchorElems.forEach((a) => {
    const href = a.href;
    if (href && images.length < 10) {
      // Пытаемся получить миниатюру из вложенного <img>, если он есть
      const img = a.querySelector("img");
      const thumb = img ? img.src : null;
      let imageEl = images.find((v) => v.url === href)
      if (imageEl === undefined) {
        images.push({ url: href, thumb });
      }
      if (imageEl?.thumb === null && thumb !== null) {
        imageEl.thumb = thumb
      }
    }
  });

  console.log('images: ', images)
  return images;
}