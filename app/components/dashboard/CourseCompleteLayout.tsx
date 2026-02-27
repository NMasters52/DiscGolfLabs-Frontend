import { useIsMobile } from "~/hooks/use-mobile";
import { MobileDashboard } from "./MobileDashboard";
import { DesktopDashboard } from "./DesktopDashboard";

export function CourseCompleteLayout() {
  const isMobile = useIsMobile();

  return isMobile ? (
    <MobileDashboard state="courseComplete" />
  ) : (
    <DesktopDashboard state="courseComplete" />
  );
}
