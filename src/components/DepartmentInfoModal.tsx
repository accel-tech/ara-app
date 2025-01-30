import { FC, useState } from "react";
import { useDepartment } from "../hooks/useDepartment";
import {
  Modal,
  ModalVariant,
  ModalHeader,
  ModalBody,
  FormGroup,
  Form,
  TextInput,
} from "@patternfly/react-core";
import { useFetch } from "../hooks/useFetch";

export const CreateReportModal: FC<{
  departmentId: string | null;
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose, departmentId }) => {
  if (!departmentId) return <></>;
  const [department, setDepartment] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const httpRequest = useFetch();

  async function fetchDepartmentInfo() {
    if (isLoading) return;
    setLoading(true);
    // cosnt fetch
  }

  function handleClose() {
    onClose();
  }
  function Body() {}

  return (
    <Modal variant={ModalVariant.small} isOpen={isOpen} onClose={handleClose}>
      <ModalHeader
        title={"loading or error or deparmtn not found or dep name"}
        description="Department Info"
      />

      <ModalBody>
        <p>department info</p>
        <p>datalist </p>
        <p>lead name</p>
        <p>members list</p>
        <p>supervisors list</p>
      </ModalBody>
    </Modal>
  );
};
