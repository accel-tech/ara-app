import { createStore, createTypedHooks } from "easy-peasy";
import { AuthModel, auth } from "./models/auth";
import { createDocumentModel, DocumentModel } from "./models/document";
import { Report } from "../types/report";

interface StoreModel {
  auth: AuthModel;
  reports: DocumentModel<Report>;
}
export const store = createStore<StoreModel>({
  auth: auth,
  reports: createDocumentModel<Report>([]),
});

const typedHooks = createTypedHooks<StoreModel>();

export const typedUseStoreActions = typedHooks.useStoreActions;
export const typedUseStoreDispatch = typedHooks.useStoreDispatch;
export const typedUseStoreState = typedHooks.useStoreState;
