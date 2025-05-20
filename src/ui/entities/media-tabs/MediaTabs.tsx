import clsx from 'clsx';
import styles from './media-tabs.module.css';
import { useLoadingStore, useTabStore } from '../../../store';

const MediaTabs = () => {
  const { activeTab, setActiveTab } = useTabStore();
  const { loading } = useLoadingStore();

  return (
    <div className={styles.tabs}>
      <button
        className={clsx(styles.tab, {
          [styles.active]: activeTab === 'all',
          [styles['tab--disabled']]: loading,
        })}
        onClick={() => setActiveTab('all')}
        disabled={loading}
      >
        All
      </button>
      <button
        className={clsx(styles.tab, {
          [styles.active]: activeTab === 'images',
          [styles['tab--disabled']]: loading,
        })}
        onClick={() => setActiveTab('images')}
        disabled={loading}
      >
        Images
      </button>
      <button
        className={clsx(styles.tab, {
          [styles.active]: activeTab === 'videos',
        })}
        onClick={() => setActiveTab('videos')}
        disabled={loading}
      >
        Videos
      </button>
    </div>
  );
};

export { MediaTabs };
