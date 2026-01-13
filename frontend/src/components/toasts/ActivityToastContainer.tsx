import { useActivityToasts } from "../../hooks/useActivityToasts";
import ActivityToast from "./ActivityToast";

/**
 * ActivityToastContainer
 *
 * Container component che gestisce la visualizzazione dei toast di attività.
 *
 * Features:
 * - Mix intelligente di eventi reali e generati
 * - Max 5 toast per sessione
 * - Intervallo 60-90 secondi tra toast
 * - ADHD-friendly design
 * - Responsive mobile
 *
 * Usage:
 * Inserire in LandingPage.tsx dopo CookieBanner:
 * <ActivityToastContainer />
 */
export default function ActivityToastContainer() {
  const { currentToast, closeToast } = useActivityToasts();

  return (
    <ActivityToast
      message={currentToast?.message || ""}
      icon={currentToast?.icon}
      show={!!currentToast}
      onClose={closeToast}
      duration={5000}
    />
  );
}
