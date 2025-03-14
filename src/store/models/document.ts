import { Action, action } from "easy-peasy";
import { concatWithoutDuplicates } from "../../utils/misc";

export interface DocumentModel<T> {
  key: number;
  isLoading: boolean;
  isInitialized: boolean;
  documents: Array<T>;
  loadingDocs: string[];
  errorMessage: string | null;
  setDocuments: Action<
    DocumentModel<T>,
    {
      documents?: Array<T>;
      isLoading?: boolean;
      isInitialized?: boolean;
      errorMessage?: string | null;
    }
  >;
  addDocuments: Action<DocumentModel<T>, Array<T>>;
  patchDocument: Action<DocumentModel<T>, { _id: string; fields: Partial<T> }>;
  removeDocument: Action<DocumentModel<T>, string>;
  replaceDocument: Action<DocumentModel<T>, T>;
  setLoadingDocument: Action<
    DocumentModel<T>,
    { _id: string; isLoading: boolean }
  >;
}

export interface AltDocumentModel<T> {
  loading: string[];
  initialized: string[];
  allDocuments: Array<T>;
  addDocuments: Action<AltDocumentModel<T>, Array<T>>;
  setLoading: Action<AltDocumentModel<T>, { id: string; isLoading: boolean }>;
  setInitialized: Action<
    AltDocumentModel<T>,
    { id: string; isInitialized: boolean }
  >;
}

export function createDocumentModel<T extends { _id: string }>(
  initialDocuments?: T[]
): DocumentModel<T> {
  return {
    key: 0,
    isLoading: false,
    isInitialized: false,
    documents: initialDocuments || [],
    loadingDocs: [],
    errorMessage: null,
    setDocuments: action((state, payload) => {
      if (typeof payload.documents !== "undefined")
        state.documents = payload.documents;
      if (typeof payload.isLoading !== "undefined")
        state.isLoading = payload.isLoading;
      if (typeof payload.isInitialized !== "undefined")
        state.isInitialized = payload.isInitialized;
      if (typeof payload.errorMessage !== "undefined")
        state.errorMessage = payload.errorMessage;
    }),
    addDocuments: action((state, payload) => {
      state.documents = state.documents.concat(payload); // concatWithoutDuplicates
      state.key += 1;
    }),
    patchDocument: action((state, payload) => {
      state.documents = state.documents.map((doc) => {
        if (doc._id === payload._id) {
          state.key += 1;
          return { ...doc, ...payload.fields };
        }
        return doc;
      });
    }),
    removeDocument: action((state, payload) => {
      state.documents = state.documents.filter((doc) => doc._id !== payload);
      state.key += 1;
    }),
    replaceDocument: action((state, payload) => {
      state.documents = state.documents.map((doc) => {
        if (doc._id !== payload._id) return doc;
        else return payload;
      });
    }),
    setLoadingDocument: action((state, payload) => {
      if (payload.isLoading) {
        state.loadingDocs = [...state.loadingDocs, payload._id];
      } else {
        state.loadingDocs = state.loadingDocs.filter(
          (id) => id !== payload._id
        );
      }
    }),
  };
}

export function createAltDocumentModel<
  T extends { _id: string }
>(): AltDocumentModel<T> {
  return {
    loading: [],
    initialized: [],
    allDocuments: [],
    setLoading: action((state, payload) => {
      if (payload.isLoading === false) {
        state.loading = state.loading.filter((id) => id !== payload.id);
      }
      if (payload.isLoading === true) {
        state.loading = [...state.loading, payload.id];
      }
    }),
    setInitialized: action((state, payload) => {
      if (payload.isInitialized === false) {
        state.initialized = state.initialized.filter((id) => id !== payload.id);
      }
      if (payload.isInitialized === true) {
        state.initialized = [...state.initialized, payload.id];
      }
    }),
    addDocuments: action((state, payload) => {
      state.allDocuments = concatWithoutDuplicates(state.allDocuments, payload);
    }),
  };
}
