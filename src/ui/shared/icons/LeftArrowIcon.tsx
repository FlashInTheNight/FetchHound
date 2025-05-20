import React from 'react';

interface LeftArrowIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number;
  color?: string;
}

export const LeftArrowIcon: React.FC<LeftArrowIconProps> = ({
  className = '',
  size = 24,
  color = 'currentColor',
  ...props
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <polyline
      points="15 6 9 12 15 18"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
