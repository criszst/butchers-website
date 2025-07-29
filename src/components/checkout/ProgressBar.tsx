import { CheckCircle, Package, CreditCard } from "lucide-react";

interface ProgressBarProps {
  currentStep: number;
}

export const ProgressBar = ({ currentStep }: ProgressBarProps) => {
  const steps = [
    { step: 1, label: "Carrinho", icon: Package },
    { step: 2, label: "Checkout", icon: CreditCard },
    { step: 3, label: "Confirmação", icon: CheckCircle }
  ];

  return (
    <div className="bg-white border-b-2 border-gray-200 shadow-sm">
      <div className="container py-4 md:py-6">
        <div className="flex items-center justify-center space-x-2 md:space-x-8 overflow-x-auto">
          {steps.map((stepData, index) => {
            const Icon = stepData.icon;
            const isActive = currentStep >= stepData.step;
            const isCompleted = currentStep > stepData.step;
            
            return (
              <div key={stepData.step} className="flex items-center min-w-max">
                {/* Step */}
                <div className="flex items-center space-x-2 md:space-x-3">
                  <div 
                    className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                      isCompleted 
                        ? "bg-green-500 border-green-500 shadow-lg" 
                        : isActive 
                          ? "bg-blue-500 border-blue-500 shadow-lg" 
                          : "bg-gray-100 border-gray-300"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-white" />
                    ) : (
                      <Icon className={`h-4 w-4 md:h-5 md:w-5 ${
                        isActive ? "text-white" : "text-gray-500"
                      }`} />
                    )}
                  </div>
                  <span className={`text-xs md:text-base font-medium transition-colors whitespace-nowrap ${
                    isActive ? "text-blue-600" : "text-gray-500"
                  }`}>
                    {stepData.label}
                  </span>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className={`w-4 md:w-16 h-1 mx-1 md:mx-4 rounded-full transition-all duration-300 ${
                    currentStep > stepData.step ? "bg-green-500" : "bg-gray-300"
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};