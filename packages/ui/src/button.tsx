"use client";

import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  className?: string;
  appName?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export const Button = ({ children, className, appName, onClick, disabled }: ButtonProps) => {
  return (
    <button
      className={className}
      onClick={onClick || (() => appName && alert(`Hello from your ${appName} app!`))}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
