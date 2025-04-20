import styles from "./loading-icon.module.css";

const LoadingIcon = () => (
  <svg
    className="loading-icon"
    width="128"
    height="128"
    viewBox="0 0 50 50"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      className={styles["loading-icon__circle-bg"]}
      cx="25"
      cy="25"
      r="20"
      stroke="var(--border-color)"
      strokeWidth="5"
      fill="none"
    />
    <circle
      className={styles["loading-icon__circle"]}
      cx="25"
      cy="25"
      r="20"
      stroke="var(--primary-color)"
      strokeWidth="5"
      strokeLinecap="round"
      fill="none"
      strokeDasharray="31.4 125.6"
    />
  </svg>
);

export { LoadingIcon };
