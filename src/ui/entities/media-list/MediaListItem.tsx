import React, { memo, useCallback } from 'react';
import clsx from 'clsx';
import { useMediaListMode, useSelectedStore } from '../../../store';
import { CheckIcon, PlaceholderIcon } from '../../shared/icons';
import { getFileName } from '../../../utils/getFileName';
import { MediaItem } from '../../../types';
import { ExcludeIcon } from '../../shared/icons/ExcludeIcon';
import styles from './media-list.module.css';

interface Props {
  item: MediaItem;
}

const MediaListItem: React.FC<Props> = ({ item }) => {
  const name = getFileName(item.url);
  const isSel = useSelectedStore(state => state.selected.has(item.url));
  const toggle = useSelectedStore(state => state.setCheckedSelected);
  const mode = useMediaListMode(state => state.activeMode);

  const onClick = useCallback(() => {
    toggle(item);
  }, [toggle, item]); // item.url

  return (
    <li
      className={clsx(styles['media-item'], {
        [styles['media-item--selected']]: isSel && mode === 'normal',
        [styles['media-item--selected-excluded']]: isSel && mode === 'exclude',
      })}
      onClick={onClick}
    >
      <div className={styles['media-thumb']}>
        {item.thumb ? (
          <img src={item.thumb} alt={name} />
        ) : (
          <div className={styles['media-thumb__placeholder']}>
            <PlaceholderIcon />
          </div>
        )}
        {isSel && (
          <div className={styles['media-thumb__overlay']}>
            {mode === 'normal' ? <CheckIcon /> : <ExcludeIcon size={34} color="#fff" />}
          </div>
        )}
      </div>
      <span className={styles['media-name']}>{name}</span>
    </li>
  );
};

export default memo(MediaListItem);
