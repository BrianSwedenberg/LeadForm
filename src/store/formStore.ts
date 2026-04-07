import { create } from 'zustand'

export const TOTAL_FORM_STEPS = 3 // Step 4 is the success screen, not a form step

interface FormData {
  // Step 1
  zip_code: string
  own_rent: string | null
  water_source: string | null
  taste_odor: string | null
  // Step 2
  first_name: string
  last_name: string
  email: string
  // Step 3
  phone: string
  timeline: string | null
  financing: boolean | null
}

interface FormStore {
  currentStep: number
  formData: FormData
  isSubmitting: boolean
  hasSubmitted: boolean
  submissionError: string | null

  setField: <K extends keyof FormData>(field: K, value: FormData[K]) => void
  goToNextStep: () => void
  goToPreviousStep: () => void
  setIsSubmitting: (value: boolean) => void
  setHasSubmitted: (value: boolean) => void
  setSubmissionError: (error: string | null) => void
}

const initialFormData: FormData = {
  zip_code: '',
  own_rent: null,
  water_source: null,
  taste_odor: null,
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  timeline: null,
  financing: null,
}

export const useFormStore = create<FormStore>((set) => ({
  currentStep: 1,
  formData: initialFormData,
  isSubmitting: false,
  hasSubmitted: false,
  submissionError: null,

  setField: (field, value) =>
    set((state) => ({
      formData: { ...state.formData, [field]: value },
    })),

  goToNextStep: () =>
    set((state) => ({ currentStep: state.currentStep + 1 })),

  goToPreviousStep: () =>
    set((state) => ({ currentStep: Math.max(1, state.currentStep - 1) })),

  setIsSubmitting: (value) => set({ isSubmitting: value }),
  setHasSubmitted: (value) => set({ hasSubmitted: value }),
  setSubmissionError: (error) => set({ submissionError: error }),
}))
