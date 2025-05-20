import React from 'react';
import clsx from 'clsx';
import style from './custom-button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline';
  className?: string;
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}

export const CustomButton = ({
  variant = 'primary',
  className = '',
  size = 'medium',
  disabled = false,
  children,
  ...rest
}: ButtonProps) => {
  return (
    <button
      className={clsx(
        style.btn,
        {
          [style['btn--primary']]: variant === 'primary',
          [style['btn--outline']]: variant === 'outline',
        },
        {
          [style['btn--small']]: size === 'small',
          [style['btn--medium']]: size === 'medium',
          [style['btn--large']]: size === 'large',
        },
        {
          [style['btn--disabled']]: disabled,
        },
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
};
