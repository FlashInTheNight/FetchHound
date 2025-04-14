import "./Button.css";

const Button = ({ variant = "primary", className = "", children, ...rest }) => {
  return (
    <button className={`btn btn-${variant} ${className}`} {...rest}>
      {children}
    </button>
  );
};

export { Button };
