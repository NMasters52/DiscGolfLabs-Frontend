import { useIsMobile } from "~/hooks/use-mobile";
import { MobileDashboard } from "./MobileDashboard";
import { DesktopDashboard } from "./DesktopDashboard";

interface InCourseLayoutProps {
  stats?: any;
}

export function InCourseLayout({ stats }: InCourseLayoutProps) {
  const isMobile = useIsMobile();

  return isMobile ? (
    <MobileDashboard state="inCourse" stats={stats} />
  ) : (
    <DesktopDashboard state="inCourse" stats={stats} />
  );
}
