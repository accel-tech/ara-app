import { FC, Fragment, useState } from "react";
import { useDepartment } from "../hooks/useDepartment";
import {
  Modal,
  ModalVariant,
  ModalHeader,
  ModalBody,
  FormGroup,
  Form,
  TextInput,
  Checkbox,
  DatePicker,
  ModalFooter,
  Button,
  Alert,
  AlertActionLink,
} from "@patternfly/react-core";
import { useFetch } from "../hooks/useFetch";
import { departmentToUrl } from "../utils/misc";
import { Link, useNavigate } from "react-router-dom";

export const CreateReportModal: FC<{
  departmentId: string | null;
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose, departmentId }) => {
  if (!departmentId) return <></>;

  const department = useDepartment(departmentId);

  if (department?.access !== "lead") {
    return <></>;
  }

  const blankFields = {
    title: "",
    coveringDates: {
      from: "",
      to: "",
    },
    options: { autoPopulateProjects: true, ignoreDateConflicts: false },
  };

  const [fields, setFields] = useState(blankFields);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdId, setCreatedId] = useState<string | null>(null);

  const httpRequest = useFetch();
  const navigate = useNavigate();

  function handleClose() {
    if (isLoading) return;
    setError(null);
    setCreatedId(null);
    setFields(blankFields);
    onClose();
  }

  function goToCreated() {
    if (!department) return;
    const target =
      departmentToUrl({
        title: department.title,
        category: department.category,
      }) + `?reportId=${createdId}`;
    navigate(target);
    onClose();
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    if (isLoading) return;
    if (!fields.title) {
      setError("Title is required");
      return;
    }
    if (!fields.coveringDates.from) {
      setError("Starting date is required");
      return;
    }
    if (!fields.coveringDates.to) {
      setError("Ending date is required");
      return;
    }
    setError(null);
    setLoading(true);
    const { data, error } = await httpRequest<any>("/reports", {
      method: "POST",
      body: JSON.stringify({ ...fields, departmentId }),
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    if (data) {
      setFields(blankFields);
      setCreatedId(data._id);
    }
  }

  return (
    <Modal variant={ModalVariant.medium} isOpen={isOpen} onClose={handleClose}>
      <ModalHeader
        title={department.title}
        description="Generate a new report"
      />

      <ModalBody>
        {error && (
          <Alert
            variant="danger"
            isInline
            title={error}
            style={{ marginBottom: 15 }}
          />
        )}
        {createdId && (
          <Alert variant="success" isInline title={"Creation Successful"}>
            The draft report has been created successfully.
          </Alert>
        )}

        <Form
          onSubmit={handleSubmit}
          style={{ display: createdId ? "none" : undefined }}
        >
          <FormGroup label="Report Title" isRequired>
            <TextInput
              isRequired
              type="text"
              value={fields.title}
              placeholder={`Example: Weekly Activities`}
              onChange={(_e, title) => setFields({ ...fields, title })}
              isDisabled={isLoading}
            />
          </FormGroup>
          <FormGroup label="Covering Dates" isRequired>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
                rowGap: 10,
                maxWidth: 400,
              }}
            >
              <div
                style={{ display: "flex", flexDirection: "column", rowGap: 5 }}
              >
                <p>Starting From: </p>
                <DatePicker
                  value={fields.coveringDates.from} // max to
                  isDisabled={isLoading}
                  onChange={(_event, from) =>
                    setFields({
                      ...fields,
                      coveringDates: { ...fields.coveringDates, from },
                    })
                  }
                />
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", rowGap: 5 }}
              >
                <p>Up to: </p>
                <DatePicker
                  value={fields.coveringDates.to}
                  isDisabled={isLoading} // min from
                  onChange={(_event, to) =>
                    setFields({
                      ...fields,
                      coveringDates: { ...fields.coveringDates, to },
                    })
                  }
                />
              </div>
            </div>
          </FormGroup>
          <FormGroup label="Options">
            <div
              style={{ display: "flex", flexDirection: "column", rowGap: 10 }}
            >
              <Checkbox
                label="Automatically populate projects"
                description="Selecting this option will cause the newly reported report to include all active projects in the department - ready to be filled with current tasks."
                isChecked={fields.options.autoPopulateProjects}
                onChange={(_e, autoPopulateProjects) =>
                  setFields({
                    ...fields,
                    options: { ...fields.options, autoPopulateProjects },
                  })
                }
                id="controlled-check-2"
                name="check2"
                isDisabled={isLoading}
              />
              <Checkbox
                label="Ignore conflicting Dates"
                description="Selecting this option will cause the report to be created despite there being other reports covering the same dates."
                isChecked={fields.options.ignoreDateConflicts}
                onChange={(_e, ignoreDateConflicts) =>
                  setFields({
                    ...fields,
                    options: { ...fields.options, ignoreDateConflicts },
                  })
                }
                id="controlled-check-1"
                name="check1"
                isDisabled={isLoading}
              />
            </div>
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button
          variant="stateful"
          onClick={handleSubmit}
          isDisabled={isLoading}
          style={{ display: createdId ? "none" : undefined }}
        >
          Create Draft
        </Button>
        <Button
          key="cancel"
          variant="link"
          onClick={handleClose}
          isDisabled={isLoading}
          style={{ display: createdId ? "none" : undefined }}
        >
          Cancel
        </Button>

        <Button
          variant="link"
          isLoading={isLoading}
          style={{ display: !createdId ? "none" : undefined }}
          onClick={goToCreated}
        >
          Open Report
        </Button>
      </ModalFooter>
    </Modal>
  );
};
