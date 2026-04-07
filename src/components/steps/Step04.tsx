import { TOTAL_FORM_STEPS } from '../../store/formStore'

export default function Step04() {
  return (
    <div className="flex flex-col h-full max-w-xl mx-auto w-full">
      <div className="flex-1 overflow-y-auto px-6 pt-4 pb-8 flex flex-col items-center">
        {/* Full progress bar */}
        <div className="w-full flex gap-1 mb-12">
          {Array.from({ length: TOTAL_FORM_STEPS }, (_, i) => (
            <div key={i} className="h-1 flex-1 rounded-full bg-primary" />
          ))}
        </div>

        <div className="w-full space-y-8 text-center">
          {/* Hero image with checkmark overlay */}
          <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-sm bg-surface-container-low">
            <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
              <div className="bg-surface-container-lowest rounded-full p-6 shadow-xl">
                <span
                  className="material-symbols-outlined text-primary text-5xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check_circle
                </span>
              </div>
            </div>
          </div>

          {/* Copy */}
          <div className="space-y-4">
            <h1 className="text-3xl font-headline font-extrabold tracking-tight text-on-surface leading-tight">
              Thank you! Your request has been received.
            </h1>
            <p className="text-on-surface-variant text-lg leading-relaxed px-2 font-body">
              A Willow Water Solutions representative will reach out to you shortly to
              schedule your free water test.
            </p>
          </div>

          {/* CTA */}
          <div className="pt-4">
            <button
              type="button"
              className="w-full bg-primary text-on-primary-container py-5 px-8 rounded-full font-headline font-bold text-lg shadow-lg active:scale-95 transition-all duration-200"
              onClick={() => window.location.reload()}
            >
              Return to Home
            </button>
          </div>
        </div>

        {/* Support callout */}
        <div className="mt-16 w-full p-6 rounded-xl bg-surface-container-low flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-primary">support_agent</span>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest font-bold text-primary-fixed-dim mb-1">
              Need immediate help?
            </p>
            <p className="text-sm font-medium text-on-surface">
              Our team is available 24/7 for urgent water quality inquiries.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
