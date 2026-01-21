import { inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { patchState, signalStore, withState, withMethods } from '@ngrx/signals';
import { tapResponse } from '@ngrx/operators';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, tap, map, exhaustMap } from 'rxjs';
import { REDIRECT_AUTHENTICATED_ROUTE } from '@core/constants';
import { AuthPayload } from '@core/payloads';
import { injectAuthStore, injectSettingsStore } from '@core/store';
import { AuthApiService, AuthService } from '@core/services';
import { getErrorMessage } from '@core/utils';
interface TLoginState {
  isLoading: boolean;
  errorMessage: string | null;
}

const initialState: TLoginState = {
  isLoading: false,
  errorMessage: null,
};

export const LoginStore = signalStore(
  withState(initialState),
  // Private methods
  withMethods((store) => ({
    _updateState(data: Partial<TLoginState>): void {
      patchState(store, { ...data });
    },
    _resetState(): void {
      patchState(store, { ...initialState });
    },
  })),
  // Public methods
  withMethods((store) => {
    const authApiService = AuthApiService();
    const authService = AuthService();
    const authStore = injectAuthStore();
    const settingsStore = injectSettingsStore();

    return {
      login: rxMethod<AuthPayload & { rememberMe: boolean }>(
        pipe(
          tap(() => {
            store._updateState({ isLoading: true, errorMessage: null });
          }),
          exhaustMap(({ rememberMe, ...payload }) =>
            authApiService.login(payload).pipe(
              map((authTokens) => ({ authTokens, rememberMe })),
              tapResponse({
                next: ({ authTokens, rememberMe }) => {
                  authStore.saveAuth({ ...authTokens, rememberMe });
                  store._resetState();
                  const loginUrl =
                    settingsStore.redirectURL() ||
                    `${settingsStore.baseUrl()}/${REDIRECT_AUTHENTICATED_ROUTE}`;
                  authService.handleRedirectSuccess(loginUrl);
                },
                error: (error: HttpErrorResponse) => {
                  store._updateState({
                    isLoading: false,
                    errorMessage: getErrorMessage(error),
                  });
                },
                finalize: () => {
                  store._updateState({ isLoading: false });
                },
              }),
            ),
          ),
        ),
      ),
    };
  }),
);

export const injectLoginStore = () => inject(LoginStore);
