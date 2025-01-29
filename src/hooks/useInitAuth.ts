import { useEffect, useRef } from "react";
import { typedUseStoreActions, typedUseStoreState } from "../store";
import { useFetch } from "./useFetch";
import { User } from "../types/user";

export const useInitAuth = () => {
  const keycloak = typedUseStoreState((state) => state.auth.keycloak);
  const setAuth = typedUseStoreActions((actions) => actions.auth.setAuth);
  const httpRequest = useFetch();

  const hasRun = useRef(false);

  useEffect(() => {
    if (!hasRun.current) {
      hasRun.current = true;
      initAuth();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function initAuth() {
    try {
      await keycloak.init({
        onLoad: "login-required",
      });

      const { data, error } = await httpRequest<User>("/auth/state");

      if (error) {
        setAuth({ isLoading: false, errorMessage: error.message });
        return;
      }

      if (data) {
        if (data.role === "admin") {
          setAuth({
            isLoading: false,
            errorMessage: null,
            user: {
              _id: data._id,
              name: data.name,
              email: data.email,
              role: data.role,
            },
          });
          return;
        } else if (data.role === "basic") {
          setAuth({
            isLoading: false,
            errorMessage: null,
            user: {
              _id: data._id,
              name: data.name,
              email: data.email,
              role: data.role,
              departmentAccess: data.departmentAccess,
            },
          });
        } else {
          console.log(`Unknown user role: ${(data as any).role}`);
        }
      }
    } catch (err: unknown) {
      console.log(err);
      setAuth({ isLoading: false, errorMessage: (err as Error).message });
    }
  }
};
