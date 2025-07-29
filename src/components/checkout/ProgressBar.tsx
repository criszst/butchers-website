import { CheckCircle } from "lucide-react";

interface ProgressBarProps {
  currentStep: number;
}

export const ProgressBar = ({ currentStep }: ProgressBarProps) => {
  const steps = [
    { number: 1, label: "Carrinho", completed: true },
    { number: 2, label: "Checkout", completed: currentStep >= 2 },
    { number: 3, label: "Confirmação", completed: currentStep >= 3 },
  ];

  return (
    <div className="bg-card border-b border-border shadow-soft">
      <div className="container py-6">
        <div className="flex items-center justify-center space-x-4 md:space-x-8">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                    step.completed
                      ? "bg-gradient-primary shadow-colored text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step.completed ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <span className="font-bold text-sm">{step.number}</span>
                  )}
                </div>
                <span
                  className={`text-sm font-medium transition-colors duration-300 hidden sm:block ${
                    step.completed ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-12 md:w-16 h-1 rounded-full mx-2 md:mx-4 transition-all duration-500 ${
                    steps[index + 1].completed ? "bg-gradient-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};