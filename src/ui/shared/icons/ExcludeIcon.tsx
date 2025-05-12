export const ExcludeIcon = ({
  className = "",
  size = 20,
  color = "currentColor",
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
    <line
      x1="6"
      y1="18"
      x2="18"
      y2="6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);
