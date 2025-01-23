import { createStore, createTypedHooks } from "easy-peasy";
import { AuthModel, auth } from "./models/auth";

interface StoreModel {
  auth: AuthModel;
}
export const store = createStore<StoreModel>({
  auth: auth,
});

const typedHooks = createTypedHooks<StoreModel>();

export const typedUseStoreActions = typedHooks.useStoreActions;
export const typedUseStoreDispatch = typedHooks.useStoreDispatch;
export const typedUseStoreState = typedHooks.useStoreState;
