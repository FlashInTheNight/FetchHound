import {
  useErrorStore,
  useExtensionMode,
  useExtensionStatus,
  useMediaListMode,
  useMediaStore,
  useSelectedStore,
} from '../store';

export const useMediaListHeaderActions = () => {
  const { mediaItems, setMediaItems } = useMediaStore();
  const count = useSelectedStore(s => s.getSelectedCount());
  const { removeAllChecked } = useSelectedStore();
  const { setExtMode } = useExtensionMode();
  const { setError } = useErrorStore();
  const { status, setExtentionStatus } = useExtensionStatus();
  const handleBackButtonClick = () => {
    removeAllChecked();
    setMediaItems([]);
    setError('');
    setMode('normal');
    setExtMode('scan');
    setExtentionStatus('showList');
  };
  const { activeMode, setMode } = useMediaListMode();

  const handeSetMode = () => {
    removeAllChecked();
    setMode('exclude');
  };

  return { mediaItems, count, handleBackButtonClick, handeSetMode, status, activeMode };
};
