import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { step1Schema, type Step1Fields } from '../../lib/validation'
import { useFormStore } from '../../store/formStore'
import ProgressBar from '../ui/ProgressBar'
import Button from '../ui/Button'

export default function Step01() {
  const [isChecking, setIsChecking] = useState(false)
  const { formData, setField, goToNextStep, currentStep } = useFormStore()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors },
  } = useForm<Step1Fields>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      zip_code: formData.zip_code,
      own_rent: formData.own_rent ?? undefined,
      water_source: formData.water_source ?? undefined,
      taste_odor: formData.taste_odor ?? undefined,
    },
  })

  const ownRent = watch('own_rent')
  const waterSource = watch('water_source')
  const tasteOdor = watch('taste_odor')

  const onSubmit = async (data: Step1Fields) => {
    const url =
      import.meta.env.VITE_ZIP_VALIDATE_URL ??
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/validate-zip`
    setIsChecking(true)
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zip: data.zip_code }),
      })
      const result = await res.json()
      if (!result.allowed) {
        setError('zip_code', {
          message: "Sorry, we don't yet have service in this area, please try back on a future date.",
        })
        return
      }
    } catch (err) {
      console.error('zip validation request failed, proceeding:', err)
    } finally {
      setIsChecking(false)
    }

    setField('zip_code', data.zip_code)
    setField('own_rent', data.own_rent ?? null)
    setField('water_source', data.water_source ?? null)
    setField('taste_odor', data.taste_odor ?? null)
    goToNextStep()
  }

  const toggle = <T extends string>(
    field: keyof Step1Fields,
    current: T | undefined,
    value: T
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setValue(field, current === value ? (undefined as any) : value)
  }

  return (
    <div className="flex flex-col h-full max-w-xl mx-auto w-full">
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-6 pt-4 pb-6">
        <div className="mb-4">
          <ProgressBar currentStep={currentStep} />
        </div>

        <div className="space-y-0.5 mb-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant font-label">
            Step 1 of 3
          </p>
          <h1 className="text-xl font-bold leading-tight tracking-tight text-on-surface font-headline">
            Schedule your FREE water test
          </h1>
        </div>

        {/* Zip Code */}
        <div className="space-y-1">
          <label className="block font-bold text-on-surface-variant uppercase tracking-wider text-xs font-label">
            Your Location
          </label>
          <input
            {...register('zip_code')}
            type="text"
            inputMode="numeric"
            maxLength={5}
            placeholder="Enter Zip Code"
            className={`w-full bg-surface-container-low border-0 border-b-2 focus:ring-0 text-base py-2 px-0 transition-all font-body placeholder:text-on-surface-variant/50 outline-none ${
              errors.zip_code
                ? 'border-error'
                : 'border-outline-variant/30 focus:border-primary'
            }`}
          />
          {errors.zip_code && (
            <p className="text-error text-xs">{errors.zip_code.message}</p>
          )}
        </div>

        {/* Home Status */}
        <div className="space-y-1.5 mt-8">
          <label className="block font-bold text-on-surface-variant uppercase tracking-wider text-xs font-label">
            Home Status
          </label>
          <div className="grid grid-cols-2 p-1 bg-surface-container-low rounded-lg">
            {(['Own', 'Rent'] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => toggle('own_rent', ownRent, option)}
                className={`py-2 text-xs font-bold rounded-md transition-all ${
                  ownRent === option
                    ? 'bg-surface-container-lowest shadow-sm text-primary'
                    : 'text-on-surface-variant'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Water Source */}
        <div className="space-y-2 mt-8">
          <label className="block font-bold text-on-surface-variant uppercase tracking-wider text-xs font-label">
            Water Source
          </label>
          <div className="flex flex-col gap-1.5">
            {(['Well Water', 'City Water'] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => toggle('water_source', waterSource, option)}
                className={`flex items-center justify-between p-3 rounded-xl text-left transition-colors ${
                  waterSource === option
                    ? 'bg-primary'
                    : 'bg-surface-container-lowest hover:bg-surface-container-low'
                }`}
              >
                <span
                  className={`text-sm font-bold ${
                    waterSource === option ? 'text-on-primary-container' : 'text-on-surface'
                  }`}
                >
                  {option}
                </span>
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                    waterSource === option
                      ? 'border-on-primary-container'
                      : 'border-outline-variant'
                  }`}
                >
                  {waterSource === option && (
                    <div className="w-1.5 h-1.5 bg-on-primary-container rounded-full" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Taste / Odor */}
        <div className="space-y-2 mt-8">
          <label className="block font-bold text-on-surface-variant uppercase tracking-wider text-xs font-label leading-tight">
            Does your water have a strong taste or odor?
          </label>
          <div className="flex gap-2">
            {(['Yes', 'No'] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => toggle('taste_odor', tasteOdor, option)}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                  tasteOdor === option
                    ? 'bg-primary text-on-primary-container'
                    : 'bg-surface-container-lowest border border-transparent hover:border-outline-variant'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom action */}
      <div className="shrink-0 bg-white/90 backdrop-blur-lg border-t border-surface-container-high px-6 py-4">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Button type="submit" isLoading={isChecking}>Next</Button>
        </form>
      </div>
    </div>
  )
}
