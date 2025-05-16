import { type SelectedItem } from "../store";

export const getSortedUrls = (urlsObj: Record<string, SelectedItem>) => {
  const urlsWithError: SelectedItem[] = [];
  const urlsWithSuccess: SelectedItem[] = [];

  for (const item of Object.values(urlsObj)) {
    if (item.error) {
      urlsWithError.push(item);
    } else {
      urlsWithSuccess.push(item);
    }
  }

  return { urlsWithError, urlsWithSuccess };
};
