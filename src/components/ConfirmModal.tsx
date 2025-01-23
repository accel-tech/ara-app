import { Modal as _Modal, ModalVariant, Button } from "@patternfly/react-core";
import { Modal as ModalDeprecated } from "@patternfly/react-core/deprecated";
import { FC, useState } from "react";

export const ConfirmModal: FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  confirmPrompt: string;
}> = ({ isOpen, onClose, onConfirm, confirmPrompt }) => {
  const [isLoading, setLoading] = useState(false);

  async function handleConfirm(e: any) {
    e.preventDefault();
    if (isLoading) return;
    setLoading(true);
    await onConfirm();
    setLoading(false);
    onClose();
  }

  function handleClose() {
    if (isLoading) return;
    onClose();
  }

  return (
    <ModalDeprecated
      variant={ModalVariant.small}
      title="Confirm"
      isOpen={isOpen}
      onClose={handleClose}
      actions={[
        <Button
          key="save"
          variant="primary"
          isLoading={isLoading}
          onClick={handleConfirm}
          isDisabled={isLoading}
        >
          Confirm
        </Button>,
        <Button
          key="cancel"
          variant="link"
          onClick={handleClose}
          isDisabled={isLoading}
        >
          Cancel
        </Button>,
      ]}
    >
      <p>{confirmPrompt}</p>
    </ModalDeprecated>
  );
};
