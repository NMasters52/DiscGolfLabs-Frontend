import { useIsMobile } from "~/hooks/use-mobile";
import { MobileDashboard } from "./MobileDashboard";
import { DesktopDashboard } from "./DesktopDashboard";

interface InCourseLayoutProps {
  stats?: any;
  currentDay?: number;
  totalDays?: number;
}

export function InCourseLayout({
  stats,
  currentDay,
  totalDays,
}: InCourseLayoutProps) {
  const isMobile = useIsMobile();

  return isMobile ? (
    <MobileDashboard
      state="inCourse"
      stats={stats}
      currentDay={currentDay}
      totalDays={totalDays}
    />
  ) : (
    <DesktopDashboard
      state="inCourse"
      stats={stats}
      currentDay={currentDay}
      totalDays={totalDays}
    />
  );
}
