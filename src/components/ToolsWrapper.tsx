import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";

import { UserPreferencesModal } from "./UserPreferencesModal";
import { ConfirmModal } from "./ConfirmModal";
import { ToastAlert, Toasts } from "./Toasts";

type context = {
  openPreferencesModal: () => void;
  openConfirmModal: (args: {
    onConfirm: () => void;
    confirmPrompt: string;
  }) => void;
  showToast: (alert: Omit<ToastAlert, "key">) => void;
};

const context = createContext<context>({
  openPreferencesModal: () => {},
  openConfirmModal: (_args) => {},
  showToast: (_args) => {},
});

export const ToolsWrapper: FC<PropsWithChildren> = ({ children }) => {
  const [preferencesModalOpen, setPreferencesModalOpen] = useState(false);

  const [confirmModalState, setConfirmModalState] = useState<{
    onConfirm: null | (() => void);
    confirmPrompt: string;
  }>({ onConfirm: null, confirmPrompt: "" });

  const [toastAlerts, setToastAlerts] = useState<ToastAlert[]>([]);

  function openPreferencesModal() {
    setPreferencesModalOpen(true);
  }

  function openConfirmModal(args: {
    onConfirm: () => void;
    confirmPrompt: string;
  }) {
    setConfirmModalState(args);
  }

  function showToast(arg: Omit<ToastAlert, "key">) {
    setToastAlerts([...toastAlerts, { ...arg, key: toastAlerts.length + 1 }]);
  }

  return (
    <context.Provider
      value={{
        openPreferencesModal,
        openConfirmModal,
        showToast,
      }}
    >
      {children}
      <UserPreferencesModal
        isOpen={preferencesModalOpen}
        onClose={() => setPreferencesModalOpen(false)}
      />
      <ConfirmModal
        isOpen={!!confirmModalState.onConfirm}
        onClose={() =>
          setConfirmModalState({ onConfirm: null, confirmPrompt: "" })
        }
        onConfirm={confirmModalState.onConfirm!}
        confirmPrompt={confirmModalState.confirmPrompt}
      />
      <Toasts
        alerts={toastAlerts}
        setAlerts={(alerts) => setToastAlerts(alerts)}
      />
    </context.Provider>
  );
};

export const usePreferencesModal = () => {
  return useContext(context).openPreferencesModal;
};

export const useConfirmModal = () => {
  return useContext(context).openConfirmModal;
};

export const useToast = () => {
  return useContext(context).showToast;
};
