import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(OAuthService);
  const router = inject(Router);

  // if access token exist and valid, allow th e
  if (authService.hasValidAccessToken()) {
    return true;
  }

  // if not token or expired, store the route that user want to navigate
  authService.initLoginFlow(state.url);

  return router.createUrlTree(['/', 'login'], {
    queryParams: { redirectUrl: state.url },
  });
  return false;
};
