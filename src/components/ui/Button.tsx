import { LoaderCircle } from "lucide-react";
import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-primary-800 via-primary-700 to-indigo-700 text-white shadow-lg shadow-primary-200 hover:from-primary-700 hover:via-primary-600 hover:to-indigo-600",
  secondary: "border border-primary-200 bg-white text-primary-700 hover:bg-primary-50",
  ghost: "bg-transparent text-slate-700 hover:bg-slate-100"
};

export const Button = ({
  children,
  loading,
  variant = "primary",
  className = "",
  disabled,
  ...rest
}: PropsWithChildren<ButtonProps>) => (
  <button
    disabled={disabled || loading}
    className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses[variant]} ${className}`}
    {...rest}
  >
    {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
    {children}
  </button>
);
