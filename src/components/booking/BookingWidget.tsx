import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useBooking } from "../../context/BookingContext";
import { StepJourney } from "./StepJourney";
import { StepQuote } from "./StepQuote";
import { StepConfirm } from "./StepConfirm";

interface BookingWidgetProps {
  /**
   * compact = hero widget mode (step 1 only, advances to /book page)
   * full = booking page mode (all 3 steps)
   */
  mode: "compact" | "full";
}

export const BookingWidget = ({ mode }: BookingWidgetProps) => {
  const booking = useBooking();
  const [prevStep, setPrevStep] = useState(booking.currentStep);

  useEffect(() => {
    setPrevStep(booking.currentStep);
  }, [booking.currentStep]);

  const goToStep = (step: number) => {
    booking.setStep(step);
    if (mode === "full") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (mode === "compact") {
    return (
      <StepJourney
        compact
        onNext={() => {
          window.location.href = "/book";
        }}
      />
    );
  }

  const direction = booking.currentStep > prevStep ? 1 : -1;

  const variants = {
    initial: (dir: number) => ({
      x: dir > 0 ? 20 : -20,
      opacity: 0,
    }),
    animate: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -20 : 20,
      opacity: 0,
      transition: { duration: 0.2, ease: "easeIn" },
    }),
  };

  return (
    <div className="flex flex-col relative overflow-hidden">
      <AnimatePresence mode="wait" custom={direction} initial={false}>
        <motion.div
          key={booking.currentStep}
          custom={direction}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="w-full"
        >
          {booking.currentStep === 1 && (
            <StepJourney onNext={() => goToStep(2)} />
          )}
          {booking.currentStep === 2 && (
            <StepQuote
              onNext={() => goToStep(3)}
              onBack={() => goToStep(1)}
            />
          )}
          {booking.currentStep === 3 && (
            <StepConfirm onBack={() => goToStep(2)} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
