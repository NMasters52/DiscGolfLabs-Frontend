import { useIsMobile } from "~/hooks/use-mobile";
import { MobileDashboard } from "./MobileDashboard";
import { DesktopDashboard } from "./DesktopDashboard";

interface CourseCompleteLayoutProps {
  currentDay?: number;
  totalDays?: number;
}

export function CourseCompleteLayout({
  currentDay,
  totalDays,
}: CourseCompleteLayoutProps) {
  const isMobile = useIsMobile();

  return isMobile ? (
    <MobileDashboard
      state="courseComplete"
      currentDay={currentDay}
      totalDays={totalDays}
    />
  ) : (
    <DesktopDashboard
      state="courseComplete"
      currentDay={currentDay}
      totalDays={totalDays}
    />
  );
}
