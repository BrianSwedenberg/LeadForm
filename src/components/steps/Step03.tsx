import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { step3Schema, type Step3Fields } from '../../lib/validation'
import { useFormStore } from '../../store/formStore'
import { submitLead } from '../../lib/submitLead'
import type { LeadPayload } from '../../types/LeadPayload'
import ProgressBar from '../ui/ProgressBar'
import Button from '../ui/Button'

export default function Step03() {
  const {
    formData,
    setField,
    goToPreviousStep,
    setIsSubmitting,
    setHasSubmitted,
    setSubmissionError,
    isSubmitting,
    submissionError,
    currentStep,
  } = useFormStore()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Step3Fields>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      phone: formData.phone,
      timeline: formData.timeline ?? undefined,
      financing: formData.financing ?? undefined,
    },
  })

  const timeline = watch('timeline')
  const financing = watch('financing')

  const onSubmit = async (data: Step3Fields) => {
    setField('phone', data.phone)
    setField('timeline', data.timeline ?? null)
    setField('financing', data.financing ?? null)

    const params = new URLSearchParams(window.location.search)

    const payload: LeadPayload = {
      Metadata: {
        own_rent: formData.own_rent,
        water_source: formData.water_source,
        taste_odor: formData.taste_odor,
        timeline: data.timeline ?? null,
        financing: data.financing ?? null,
      },
      zip_code: formData.zip_code,
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      phone: data.phone,
      utm_source: params.get('utm_source'),
      utm_medium: params.get('utm_medium'),
      utm_campaign: params.get('utm_campaign'),
      referrer: document.referrer || null,
      submitted_at: new Date().toISOString(),
      full_domain: window.location.href,
      lead_submission_page: window.location.pathname,
      root_domain: window.location.hostname,
    }

    setIsSubmitting(true)
    setSubmissionError(null)

    try {
      await submitLead(payload)
      setHasSubmitted(true)
    } catch (err) {
      setSubmissionError(
        err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleTimeline = (option: NonNullable<Step3Fields['timeline']>) => {
    setValue('timeline', timeline === option ? undefined : option)
  }

  const toggleFinancing = (value: boolean) => {
    setValue('financing', financing === value ? undefined : value)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full max-w-xl mx-auto w-full">
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-6 pt-4 pb-6">
        <div className="mb-8">
          <ProgressBar currentStep={currentStep} />
        </div>

        <div className="mb-6">
          <span className="block font-headline font-bold text-xs uppercase tracking-widest text-on-surface-variant mb-2">
            Step 3 of 3
          </span>
          <h1 className="text-3xl font-headline font-bold text-on-surface leading-tight tracking-tight">
            You're almost there!
          </h1>
          <p className="text-on-surface-variant mt-2 text-sm font-body">
            Willow Water Solutions needs a few final details.
          </p>
        </div>

        <div>
          {/* Phone */}
          <section className="mb-6 bg-surface-container-low p-5 rounded-xl">
            <label
              htmlFor="phone"
              className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1"
            >
              Mobile Phone
            </label>
            <input
              id="phone"
              type="tel"
              inputMode="numeric"
              placeholder="(555) 000-0000"
              {...register('phone')}
              className={`w-full bg-transparent border-0 border-b-2 focus:ring-0 px-0 py-2 text-lg font-medium placeholder:text-on-surface-variant/40 transition-colors outline-none ${
                errors.phone ? 'border-error' : 'border-outline-variant focus:border-primary'
              }`}
            />
            {errors.phone && (
              <p className="text-error text-xs mt-1">{errors.phone.message}</p>
            )}
          </section>

          {/* Timeline */}
          <section className="mb-6">
            <h2 className="text-sm font-bold tracking-tight mb-3 text-on-surface font-headline">
              Start timeline?
            </h2>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => toggleTimeline('Immediately')}
                className={`flex justify-between items-center p-4 rounded-xl transition-all active:scale-95 ${
                  timeline === 'Immediately'
                    ? 'bg-primary text-on-primary-container'
                    : 'bg-surface-container-lowest hover:bg-surface-container-highest'
                }`}
              >
                <span className="font-medium">Immediately</span>
                <span
                  className={`material-symbols-outlined ${
                    timeline === 'Immediately' ? 'text-on-primary-container' : 'text-outline-variant'
                  }`}
                >
                  bolt
                </span>
              </button>
              <div className="grid grid-cols-2 gap-2">
                {(['1-2 Weeks', 'Flexible'] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => toggleTimeline(option)}
                    className={`p-4 rounded-xl text-center font-medium transition-all active:scale-95 ${
                      timeline === option
                        ? 'bg-primary text-on-primary-container'
                        : 'bg-surface-container-lowest hover:bg-surface-container-highest'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Financing */}
          <section className="mb-6">
            <h2 className="text-sm font-bold tracking-tight mb-3 text-on-surface font-headline">
              Interested in financing?
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => toggleFinancing(true)}
                className={`p-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 ${
                  financing === true
                    ? 'bg-primary text-on-primary-container shadow-lg'
                    : 'bg-surface-container-lowest hover:bg-surface-container-highest'
                }`}
              >
                <span className="font-bold">Yes</span>
                {financing === true && (
                  <span
                    className="material-symbols-outlined text-sm"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => toggleFinancing(false)}
                className={`p-4 rounded-xl font-bold transition-all active:scale-95 ${
                  financing === false
                    ? 'bg-primary text-on-primary-container shadow-lg'
                    : 'bg-surface-container-lowest hover:bg-surface-container-highest'
                }`}
              >
                No
              </button>
            </div>
          </section>

          {/* Submission error */}
          {submissionError && (
            <div className="bg-error-container text-on-error-container text-sm px-4 py-3 rounded-xl mb-4">
              {submissionError}
            </div>
          )}
        </div>
      </div>

      {/* Bottom action */}
      <div className="shrink-0 border-t border-surface-container-high px-6 py-4 bg-white/90 backdrop-blur-lg flex gap-4">
        <button
          type="button"
          onClick={goToPreviousStep}
          disabled={isSubmitting}
          className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-3 hover:bg-surface-container-low rounded-xl transition-colors active:scale-[0.98] duration-200 disabled:opacity-50"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          <span className="font-label font-medium text-xs uppercase tracking-widest mt-1">
            Back
          </span>
        </button>
        <Button
          type="submit"
          isLoading={isSubmitting}
          className="flex-1"
        >
          Submit
        </Button>
      </div>
    </form>
  )
}
