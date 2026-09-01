interface EnrollmentRedirectInput {
  courseSlug: string;
  enrolled: boolean;
}

export function getEnrollmentDestination({
  courseSlug,
  enrolled,
}: EnrollmentRedirectInput) {
  if (enrolled) {
    return null;
  }

  return `/courses/${courseSlug}`;
}
