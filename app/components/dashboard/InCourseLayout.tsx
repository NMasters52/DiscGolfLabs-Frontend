import { useIsMobile } from "~/hooks/use-mobile";
import { MobileDashboard } from "./MobileDashboard";
import { DesktopDashboard } from "./DesktopDashboard";

interface InCourseLayoutProps {
  stats?: any;
  currentDay?: number;
  totalDays?: number;
  lastSession?: {
    maxDistance: number;
    makeRate: number;
    attempts: number;
    date: string;
  } | null;
}

export function InCourseLayout({
  stats,
  currentDay,
  totalDays,
  lastSession,
}: InCourseLayoutProps) {
  const isMobile = useIsMobile();

  return isMobile ? (
    <MobileDashboard
      state="inCourse"
      stats={stats}
      currentDay={currentDay}
      totalDays={totalDays}
      lastSession={lastSession}
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
