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
  const { removeAllChecked } =  useSelectedStore();

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
      const [result] = (await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: currentScanFn,
      })) as any[]; // Приводим к типу any, чтобы избежать ошибок компиляции

      console.log("result is: ", result);

      if (!result.result || result.result.length === 0) {
        throw Error("No media found.");
      }

      setMediaItems(result.result);
    } catch (error) {
      console.error("Error searchin  videos:", error);
      setMediaItems([]);
      setError(error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return { getMedia };
};
