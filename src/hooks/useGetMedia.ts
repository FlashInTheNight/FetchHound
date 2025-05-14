import {
  useMediaStore,
  useLoadingStore,
  useErrorStore,
  useSelectedStore,
  useExtensionMode,
} from "../store";
import { scanFnType } from "../types";
import { storage } from "../storage";

// Функция для запроса сканирования страницы
export const useGetMedia = () => {
  const { setMediaItems } = useMediaStore();
  const { setLoading } = useLoadingStore();
  const { setError } = useErrorStore();
  const { removeAllChecked } = useSelectedStore();
  const { setExtMode } = useExtensionMode();

  const getMedia = async (currentScanFn: scanFnType) => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (!tab?.id) return;

    try {
      setLoading(true);
      setError("");
      removeAllChecked(); // Сбрасываем выбранные элементы перед новым сканированием
      // Запускаем скрипт на текущей вкладке и получаем результат

      // Получаем исключенные URL для текущего хоста
      const host = tab.url ? new URL(tab.url).host : "";
      const excludedUrls = await storage.get(host);

      const [result] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: currentScanFn,
        args: [excludedUrls],
      });

      console.log("result is: ", result);

      if (!result.result || result.result.length === 0) {
        throw Error("No media items were found on the page.");
      }

      setMediaItems(result.result);
      setExtMode("download");
    } catch (error) {
      console.error("Error searchin  media:", error);
      // setMediaItems([]);
      setError(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while scanning the page."
      );
    } finally {
      setLoading(false);
    }
  };

  return { getMedia };
};
