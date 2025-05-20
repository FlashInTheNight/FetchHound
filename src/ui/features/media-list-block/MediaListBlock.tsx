import { useMediaListMode } from '../../../store';
import { ExcludeGroupBtns, GroupBtns, MediaList } from '../../entities';

const MediaListBlock = () => {
  const { activeMode } = useMediaListMode();

  return (
    <div>
      <MediaList />
      {activeMode === 'normal' ? <GroupBtns /> : <ExcludeGroupBtns />}
    </div>
  );
};

export { MediaListBlock };
