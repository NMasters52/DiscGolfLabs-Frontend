interface AuthRedirectInput {
  isLoaded: boolean;
  isSignedIn: boolean;
  pathname: string;
  search: string;
}

export function getAuthRedirectDestination({
  isLoaded,
  isSignedIn,
  pathname,
  search,
}: AuthRedirectInput) {
  if (!isLoaded || isSignedIn) {
    return null;
  }

  const returnTo = `${pathname}${search}`;
  const params = new URLSearchParams({ redirect_url: returnTo });

  return `/sign-in?${params.toString()}`;
}
