import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { step2Schema, type Step2Fields } from '../../lib/validation'
import { useFormStore } from '../../store/formStore'
import ProgressBar from '../ui/ProgressBar'
import Input from '../ui/Input'
import Button from '../ui/Button'

export default function Step02() {
  const { formData, setField, goToNextStep, goToPreviousStep, currentStep } = useFormStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Step2Fields>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
    },
  })

  const onSubmit = (data: Step2Fields) => {
    setField('first_name', data.first_name)
    setField('last_name', data.last_name)
    setField('email', data.email)
    goToNextStep()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full max-w-xl mx-auto w-full">
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-6 pt-4 pb-6">
        <div className="mb-8">
          <ProgressBar currentStep={currentStep} />
        </div>

        <div className="mb-10">
          <span className="block font-headline font-bold text-xs uppercase tracking-widest text-on-surface-variant mb-2">
            Step 2 of 3
          </span>
          <h1 className="text-3xl font-headline font-bold text-on-surface leading-tight tracking-tight">
            Who should we contact about this estimate?
          </h1>
        </div>

        <div className="flex flex-col gap-6">
            <Input
              label="First Name"
              placeholder="Enter your first name"
              type="text"
              autoComplete="given-name"
              error={errors.first_name?.message}
              {...register('first_name')}
            />
            <Input
              label="Last Name"
              placeholder="Enter your last name"
              type="text"
              autoComplete="family-name"
              error={errors.last_name?.message}
              {...register('last_name')}
            />
            <Input
              label="Email Address"
              placeholder="example@email.com"
              type="email"
              autoComplete="email"
              inputMode="email"
              error={errors.email?.message}
              {...register('email')}
            />
          </div>

        {/* Discount badge */}
        <div className="mt-10 flex justify-center">
          <div className="bg-primary-container text-on-primary-container px-4 py-2 rounded-full flex items-center gap-2 shadow-sm">
            <span
              className="material-symbols-outlined text-[18px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              verified
            </span>
            <span className="font-label font-bold text-[10px] uppercase tracking-wider">
              Discount applied: 10% off — Senior / Military
            </span>
          </div>
        </div>
      </div>

      {/* Bottom action */}
      <div className="shrink-0 bg-white/90 backdrop-blur-lg border-t border-surface-container-high px-6 py-4 flex flex-col gap-3">
        <Button type="submit">
          Next
          <span className="material-symbols-outlined text-base">arrow_forward</span>
        </Button>
        <button
          type="button"
          onClick={goToPreviousStep}
          className="text-center text-xs text-on-surface-variant hover:text-on-surface transition-colors"
        >
          ← Back
        </button>
        <p className="text-center text-[10px] text-on-surface-variant font-body">
          By clicking Next, you agree to our{' '}
          <a href="#" className="underline">
            Terms of Service
          </a>
          .
        </p>
      </div>
    </form>
  )
}
