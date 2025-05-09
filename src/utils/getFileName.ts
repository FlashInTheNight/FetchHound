export function getFileName(url: string): string {
  const idx = url.lastIndexOf('/');
  return idx !== -1 ? url.slice(idx + 1) : url;
}