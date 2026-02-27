import { useIsMobile } from "~/hooks/use-mobile";
import { MobileDashboard } from "./MobileDashboard";
import { DesktopDashboard } from "./DesktopDashboard";

export function InCourseLayout() {
  const isMobile = useIsMobile();

  return isMobile ? (
    <MobileDashboard state="inCourse" />
  ) : (
    <DesktopDashboard state="inCourse" />
  );
}
