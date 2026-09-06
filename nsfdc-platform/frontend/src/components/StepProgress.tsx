interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
}

export default function StepProgress({ currentStep, totalSteps, labels = [] }: StepProgressProps) {
  return (
    <div className="w-full">
      {/* Progress bar */}
      <div className="relative h-1.5 bg-black/5 rounded-full overflow-hidden mb-4">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-violet-500 to-amber-400 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${((currentStep) / totalSteps) * 100}%` }}
        />
      </div>

      {/* Step indicators */}
      <div className="flex justify-between">
        {Array.from({ length: totalSteps }, (_, i) => {
          const stepNum = i + 1;
          const isCompleted = stepNum < currentStep;
          const isActive = stepNum === currentStep;

          return (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
                  isCompleted
                    ? 'bg-gradient-to-br from-violet-500 to-violet-700 text-[#272727] shadow-lg shadow-violet-500/30'
                    : isActive
                      ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-black shadow-lg shadow-amber-400/30 scale-110'
                      : 'bg-black/5 text-[#9ca3af] border border-black/5'
                }`}
              >
                {isCompleted ? '✓' : stepNum}
              </div>
              {labels[i] && (
                <span
                  className={`text-[11px] font-medium transition-colors duration-300 hidden sm:block ${
                    isActive ? 'text-[#013e4e]' : isCompleted ? 'text-[#013e4e]' : 'text-[#9ca3af]'
                  }`}
                >
                  {labels[i]}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
