import { useErrorStore } from "../../../store";
import { CancelIcon } from "../icons/CancelIcon";
import styles from "./error-notification.module.css";

export const ErrorNotification = () => {
  const { error, setError } = useErrorStore();
  return (
    <div className={styles["error-notification"]}>
      <p className={styles["error-notification-text"]}>{error}</p>
      <button
        className={styles["error-notification-btn"]}
        type="button"
        onClick={() => setError("")}
      >
        <CancelIcon size={28} />
      </button>
    </div>
  );
};
