import React from "react";
import style from "./button.module.css";
import clsx from "clsx";


interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "unchecked";
  className?: string;
  children: React.ReactNode;
}

const Button = ({ variant = "primary", className = "", children, ...rest }: ButtonProps) => {
  return (
    <button
      className={clsx(
        style.btn,
        {
          [style["btn-primary"]]: variant === "primary",
          [style["btn-secondary"]]: variant === "secondary",
          [style["btn-unchecked"]]: variant === "unchecked",
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
