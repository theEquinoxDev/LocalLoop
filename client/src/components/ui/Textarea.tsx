import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from './cn';

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-900 resize-none',
          className
        )}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';

