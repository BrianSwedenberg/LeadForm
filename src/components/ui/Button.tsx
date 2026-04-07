interface Props {
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit'
  variant?: 'primary' | 'ghost'
  disabled?: boolean
  isLoading?: boolean
  className?: string
}

export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  isLoading = false,
  className = '',
}: Props) {
  const base =
    'w-full font-headline font-bold py-4 rounded-full transition-all active:scale-[0.98] duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary:
      'bg-primary text-on-primary-container shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:opacity-90',
    ghost:
      'bg-transparent text-primary border border-outline-variant hover:bg-surface-container-low',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {isLoading ? (
        <>
          <span className="material-symbols-outlined text-base animate-spin">
            progress_activity
          </span>
          Processing…
        </>
      ) : (
        children
      )}
    </button>
  )
}
