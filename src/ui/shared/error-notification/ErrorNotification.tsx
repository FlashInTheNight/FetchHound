import { useErrorStore } from '../../../store';
import { CancelIcon } from '../icons';
import styles from './error-notification.module.css';

export const ErrorNotification = () => {
  const { error, setError } = useErrorStore();

  const handleClose = () => {
    setError('');
  };

  return (
    <div className={styles['error-notification']}>
      <div>
        <p className={styles['error-notification-text']}>{error}</p>
      </div>

      <button className={styles['error-notification-btn']} type="button" onClick={handleClose}>
        <CancelIcon size={28} />
      </button>
    </div>
  );
};
