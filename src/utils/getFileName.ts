export function getFileName(url: string): string {
  const idx = url.lastIndexOf("/");
  const name = idx !== -1 ? url.slice(idx + 1) : url;
  if (name) {
    return name;
  } else {
    return url;
  }
}
