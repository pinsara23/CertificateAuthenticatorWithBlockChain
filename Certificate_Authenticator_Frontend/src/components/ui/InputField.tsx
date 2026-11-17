import type { InputHTMLAttributes } from "react";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const InputField = ({ label, id, error, hint, className = "", ...rest }: InputFieldProps) => (
  <label className="flex flex-col gap-2 text-sm font-medium text-slate-700" htmlFor={id}>
    <span className="flex items-center justify-between gap-3">
      <span>{label}</span>
      {hint ? <span className="text-xs font-normal text-slate-500">{hint}</span> : null}
    </span>
    <input
      id={id}
      className={`w-full rounded-xl border border-slate-200/90 bg-white/90 px-4 py-3 text-sm text-slate-900 outline-none ring-primary-200 transition duration-200 placeholder:text-slate-400 focus:border-primary-300 focus:ring-4 ${className}`}
      {...rest}
    />
    {error ? <span className="text-xs font-medium text-rose-600">{error}</span> : null}
  </label>
);
