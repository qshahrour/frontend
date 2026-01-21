import { inject } from '@angular/core';
import { signalStore, withMethods } from '@ngrx/signals';
import { tapResponse } from '@ngrx/operators';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, exhaustMap } from 'rxjs';
import { CHECK_IDENTITY_ROUTE } from '@core/constants';
import { injectAuthStore, injectSettingsStore } from '@core/store';
import { AuthApiService, AuthService } from '@core/services';

export const LogoutStore = signalStore(
  { providedIn: 'root' },
  // Public methods
  withMethods(() => {
    const authApiService = AuthApiService();
    const authService = AuthService();
    const authStore = injectAuthStore();
    const settingsStore = injectSettingsStore();

    return {
      logout: rxMethod<void>(
        pipe(
          exhaustMap(() =>
            authApiService.logout().pipe(
              tapResponse({
                next: () => {
                  authStore.clearAuth();
                  authService.handleRedirectSuccess(
                    `${settingsStore.baseUrl()}/${CHECK_IDENTITY_ROUTE}`,
                  );
                },
                error: () => {
                  authStore.clearAuth();
                  authService.handleRedirectSuccess(
                    `${settingsStore.baseUrl()}/${CHECK_IDENTITY_ROUTE}`,
                  );
                },
                finalize: () => {
                  authStore.clearAuth();
                },
              }),
            ),
          ),
        ),
      ),
    };
  }),
);

export const injectLogoutStore = () => inject(LogoutStore);
