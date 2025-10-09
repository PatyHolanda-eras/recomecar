import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface WizardStepProps {
  children: React.ReactNode;
  onNext?: () => void;
  onPrev?: () => void;
  showNext?: boolean;
  showPrev?: boolean;
  isLastStep?: boolean;
  nextDisabled?: boolean;
  nextButtonText?: string;
}

export const WizardStep = ({
  children,
  onNext,
  onPrev,
  showNext = true,
  showPrev = true,
  isLastStep = false,
  nextDisabled = false,
  nextButtonText,
}: WizardStepProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <div className="min-h-[400px]">{children}</div>
      
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-border">
        {showPrev ? (
          <Button
            variant="outline"
            onClick={onPrev}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        ) : (
          <div />
        )}
        
        {showNext && (
            <Button
            onClick={onNext}
            disabled={nextDisabled}
            className="gap-2"
          >
            {nextButtonText || (isLastStep ? "Ver Resultados" : "Próximo")}
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </motion.div>
  );
};
