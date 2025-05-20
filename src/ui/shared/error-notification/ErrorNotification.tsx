import { useErrorStore } from '../../../store';
import { CancelIcon } from '../icons/CancelIcon';
import styles from './error-notification.module.css';

export const ErrorNotification = () => {
  const { error, additionalError, setAdditionalError, setError } = useErrorStore();

  const handleClose = () => {
    setError('');
    setAdditionalError('');
  };

  return (
    <div className={styles['error-notification']}>
      <div>
        <p className={styles['error-notification-text']}>{error}</p>
        <p className={styles['error-notification-text']}>{additionalError}</p>
      </div>

      <button className={styles['error-notification-btn']} type="button" onClick={handleClose}>
        <CancelIcon size={28} />
      </button>
    </div>
  );
};
