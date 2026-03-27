"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

type PrimaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  loading?: boolean;
  loadingText?: string;
  fullWidth?: boolean;
};

export default function PrimaryButton({
  children,
  loading = false,
  loadingText = "Processing...",
  fullWidth = false,
  className = "",
  disabled,
  type = "button",
  ...props
}: PrimaryButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={[
        "inline-flex items-center justify-center",
        "h-[40px] px-[14px] py-[10px]",
        "bg-[#121212] text-white",
        "text-[14px] leading-[19px]",
        "transition-colors hover:bg-black/90",
        "disabled:cursor-not-allowed disabled:opacity-50",
        fullWidth ? "w-full" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {loading ? loadingText : children}
    </button>
  );
}
