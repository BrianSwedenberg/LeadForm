import { forwardRef } from 'react'

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, Props>(({ label, error, ...props }, ref) => (
  <div className="space-y-1">
    <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant px-1">
      {label}
    </label>
    <input
      ref={ref}
      className={`w-full bg-surface-container-highest border-0 border-b-2 transition-colors px-4 py-4 rounded-t-lg font-body text-on-surface outline-none placeholder:text-on-surface-variant/50 ${
        error
          ? 'border-error'
          : 'border-outline-variant focus:border-primary'
      }`}
      {...props}
    />
    {error && <p className="text-error text-xs px-1">{error}</p>}
  </div>
))

Input.displayName = 'Input'
export default Input
