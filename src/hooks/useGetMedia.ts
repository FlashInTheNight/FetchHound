import {
  useMediaStore,
  useLoadingStore,
  useErrorStore,
  useSelectedStore,
} from "../store";
import { scanFnType } from "../types";

// Функция для запроса сканирования страницы
export const useGetMedia = () => {
  const { setMediaItems } = useMediaStore();
  const { setLoading } = useLoadingStore();
  const { setError } = useErrorStore();
  const { setSelected } = useSelectedStore();

  const getMedia = async (currentScanFn: scanFnType) => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (!tab?.id) return;

    try {
      setLoading(true);
      setError("");
      const [result] = (await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: currentScanFn,
      })) as any[]; // Приводим к типу any, чтобы избежать ошибок компиляции

      console.log("result is: ", result);

      if (!result.result) {
        throw Error("No media found.");
      }

      setMediaItems(result.result);
      // Инициализируем объект выбора: для каждого URL значение false
      const initSelect: Record<string, boolean> = {};
      result.result.forEach((media) => {
        initSelect[media.url] = false;
      });
      setSelected(initSelect);
    } catch (error) {
      console.error("Error searchin  videos:", error);
      setMediaItems([]);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { getMedia };
};
