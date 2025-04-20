const StartIcon = () => (
  <svg
    width="128"
    height="128"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ display: "block", margin: "0 auto" }}
  >
    <circle
      cx="12"
      cy="12"
      r="11"
      stroke="var(--primary-color)"
      strokeWidth="2"
    />
    <path
      d="M12 8V16"
      stroke="var(--primary-color)"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M8 12L12 16L16 12"
      stroke="var(--primary-color)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export { StartIcon };
