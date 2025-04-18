import React from "react";
import style from "./button.module.css";
import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "unchecked";
  className?: string;
  children: React.ReactNode;
  textSize?: "small" | "medium" | "large";
}

const Button = ({
  variant = "primary",
  className = "",
  textSize = "medium",
  children,
  ...rest
}: ButtonProps) => {
  return (
    <button
      className={clsx(
        style.btn,
        {
          [style["btn-primary"]]: variant === "primary",
          [style["btn-secondary"]]: variant === "secondary",
          [style["btn-unchecked"]]: variant === "unchecked",
        },
        {
          [style["btn-size-small"]]: textSize === "small",
          [style["btn-size-medium"]]: textSize === "medium",
          [style["btn-size-large"]]: textSize === "large",
        },
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
};

export { Button };
