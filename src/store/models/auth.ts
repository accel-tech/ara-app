import { Action, action } from "easy-peasy";
import { User } from "../../types/user";
import Keycloak from "keycloak-js";

export interface AuthModel {
  isLoading: boolean;
  user: User | null;
  errorMessage: string | null;
  keycloak: Keycloak;
  setAuth: Action<
    AuthModel,
    { user?: User; isLoading?: boolean; errorMessage?: string | null }
  >;
}

export const auth: AuthModel = {
  isLoading: true,
  user: null,
  errorMessage: null,
  keycloak: new Keycloak({
    url: import.meta.env.VITE_KEYCLOAK_URL,
    realm: import.meta.env.VITE_KEYCLOAK_REALM,
    clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
  }),
  setAuth: action((state, payload) => {
    if (typeof payload.user !== "undefined") state.user = payload.user;
    if (typeof payload.isLoading !== "undefined")
      state.isLoading = payload.isLoading;
    if (typeof payload.errorMessage !== "undefined")
      state.errorMessage = payload.errorMessage;
  }),
};
