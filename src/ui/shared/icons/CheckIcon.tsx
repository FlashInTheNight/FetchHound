import React from 'react';

interface CheckIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export const CheckIcon: React.FC<CheckIconProps> = ({ className = '', ...props }) => (
  <svg
    className={className}
    width="34"
    height="34"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <polyline
      points="20 6 9 17 4 12"
      stroke="#fff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
