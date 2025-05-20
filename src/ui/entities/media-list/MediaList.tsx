import { useErrorStore, useMediaStore } from '../../../store';
import MediaListItem from './MediaListItem';
import { MediaItem } from '../../../types';
import { ErrorNotification } from '../../shared';
import styles from './media-list.module.css';

export const MediaList = () => {
  const mediaItems = useMediaStore(s => s.mediaItems);
  const { error } = useErrorStore();

  return (
    <div className={styles['media-list-wrapper']}>
      <ul className={styles['media-list']}>
        {mediaItems.map((item: MediaItem, id) => (
          <MediaListItem key={`${item.url}-${id}`} item={item} />
        ))}
      </ul>
      {error && <ErrorNotification />}
    </div>
  );
};
