import { TOTAL_FORM_STEPS } from '../../store/formStore'

interface Props {
  currentStep: number
}

export default function ProgressBar({ currentStep }: Props) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: TOTAL_FORM_STEPS }, (_, i) => (
        <div
          key={i}
          className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
            i < currentStep ? 'bg-primary' : 'bg-secondary-container'
          }`}
        />
      ))}
    </div>
  )
}
