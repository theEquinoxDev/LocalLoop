import type { ButtonHTMLAttributes } from 'react';
import { cn } from './cn';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost';
};

export const Button = ({
  variant = 'primary',
  className,
  type = 'button',
  disabled,
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition',
        variant === 'primary' &&
          'bg-slate-900 text-white hover:bg-slate-800',
        variant === 'secondary' &&
          'bg-slate-200 text-slate-900 hover:bg-slate-300',
        variant === 'ghost' &&
          'bg-transparent text-slate-700 hover:bg-slate-100',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      {...props}
    />
  );
};
