import { AnimatePresence, motion } from 'framer-motion'
import { useFormStore } from './store/formStore'
import Header from './components/ui/Header'
import Step01 from './components/steps/Step01'
import Step02 from './components/steps/Step02'
import Step03 from './components/steps/Step03'
import Step04 from './components/steps/Step04'

const STEPS = {
  1: Step01,
  2: Step02,
  3: Step03,
  4: Step04,
} as const

export default function App() {
  const currentStep = useFormStore((s) => s.currentStep)
  const hasSubmitted = useFormStore((s) => s.hasSubmitted)

  // After successful submission, show Step04
  const activeStep = hasSubmitted ? 4 : (currentStep as keyof typeof STEPS)
  const StepComponent = STEPS[activeStep] ?? Step01

  return (
    <div className="bg-surface text-on-surface h-screen flex flex-col overflow-hidden">
      <Header />
      <main className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="h-full flex flex-col"
          >
            <StepComponent />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
