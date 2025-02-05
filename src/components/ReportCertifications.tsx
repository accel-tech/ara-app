import { FC, Fragment, useState } from "react";
import { Report } from "../types/report";
import {
  ActionGroup,
  Alert,
  Button,
  Content,
  ContentVariants,
  DataList,
  DataListAction,
  DataListCell,
  DataListContent,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  DatePicker,
  Form,
  FormGroup,
  Grid,
  GridItem,
  List,
  ListItem,
  Panel,
  Radio,
  TextInput,
} from "@patternfly/react-core";
import {
  CalendarAltIcon,
  CalendarDayIcon,
  CheckCircleIcon,
  CheckIcon,
  PenIcon,
  PlusIcon,
  TimesIcon,
  TrashIcon,
} from "@patternfly/react-icons";
import { useDepartmentAccess } from "../hooks/useDepartmentAccess";
import { EmployeeSelect } from "./EmployeeSelect";
import { useFetch } from "../hooks/useFetch";
import { Certification } from "../types/certification";
import { typedUseStoreActions } from "../store";
import { fmtDate1, fmtDate2 } from "../utils/misc";

export const ReportCertifications: FC<{
  reportId: string;
  status: Report["status"];
  certifications: Report["certifications"];
  departmentId: string;
}> = ({ status, certifications, departmentId, reportId }) => {
  const [newCertificationOpen, setNewCertificationOpen] = useState(false);

  const access = useDepartmentAccess(departmentId);

  const patchDocument = typedUseStoreActions(
    (actions) => actions.reports.patchDocument
  );

  function toggleAdd() {
    setNewCertificationOpen(true);
  }

  function onNewCertification(newCert: Certification) {
    patchDocument({
      _id: reportId,
      fields: {
        certifications: [...certifications, newCert],
      },
    });
  }

  function onEditCertification(_id: string, fields: Partial<Certification>) {
    patchDocument({
      _id: reportId,
      fields: {
        certifications: certifications.map((cert) => {
          if (cert._id === _id) {
            return { ...cert, ...fields };
          }
          return cert;
        }),
      },
    });
  }

  function onRemoveCertification(id: string) {
    patchDocument({
      _id: reportId,
      fields: {
        certifications: certifications.filter((cert) => cert._id !== id),
      },
    });
  }

  const projectedCerts = certifications.filter(
    (cert) => cert.status === "projected"
  );
  const completedCerts = certifications.filter(
    (cert) => cert.status === "completed"
  );

  if (status === "draft") {
    return (
      <div>
        {access !== "lead" && certifications.length === 0 && (
          <p>No certifications have been added by the department lead.</p>
        )}
        {completedCerts.length > 0 && (
          <div style={{ marginBottom: 15 }}>
            <List isPlain>
              {completedCerts.map((cert) => (
                <CompletedCertificate
                  key={cert._id}
                  cert={cert}
                  onEdit={(changes) => onEditCertification(cert._id, changes)}
                  onRemove={() => onRemoveCertification(cert._id)}
                  isEditable
                />
              ))}
            </List>
          </div>
        )}
        {projectedCerts.length > 0 && (
          <div style={{ marginBottom: 15 }}>
            <Content style={{ marginBottom: 5 }}>Upcoming:</Content>
            <DataList aria-label="upcoming-certifications" isCompact>
              <DataListItem style={{ background: "transparent" }}>
                {projectedCerts.map((cert) => (
                  <ProjectedCertificate
                    cert={cert}
                    key={cert._id}
                    onEdit={(changes) => onEditCertification(cert._id, changes)}
                    onRemove={() => onRemoveCertification(cert._id)}
                    isEditable
                  />
                ))}
              </DataListItem>
            </DataList>
          </div>
        )}

        {newCertificationOpen && (
          <NewCertificationForm
            departmentId={departmentId}
            onAdd={onNewCertification}
            onClose={() => setNewCertificationOpen(false)}
          />
        )}

        {(access === "lead" || access === "member") &&
          !newCertificationOpen && (
            <Button variant="link" icon={<PlusIcon />} onClick={toggleAdd}>
              Add Certification
            </Button>
          )}
      </div>
    );
  }

  if (status === "published") {
    return (
      <div>
        {certifications.length === 0 && (
          <p>No certifications have been added by the department lead.</p>
        )}
      </div>
    );
  }

  return <></>;
};

function ProjectedCertificate({
  cert,
  isEditable,
  onEdit,
  onRemove,
}: {
  cert: Certification & { status: "projected" };
  isEditable: boolean;
  onEdit: (fields: Partial<Certification>) => void;
  onRemove: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  console.log(cert);
  return (
    <DataListItemRow>
      <DataListItemCells
        dataListCells={
          !isEditing
            ? [
                <DataListCell key="employee" isFilled={false}>
                  {cert.employee.name}
                </DataListCell>,
                <DataListCell key="cert">
                  <>
                    {cert.title}{" "}
                    {cert.examCode && (
                      <a href={cert.examLink} target="_blank">
                        ({cert.examCode})
                      </a>
                    )}
                  </>
                </DataListCell>,
                <DataListCell key="date" isFilled={false}>
                  <Fragment>
                    <CalendarDayIcon style={{ marginRight: 5 }} />{" "}
                    <span>Projected for </span>
                    {fmtDate1(cert.dateProjected, "long")}
                  </Fragment>
                </DataListCell>,
              ]
            : [
                <DataListCell key="edit" isFilled={true}>
                  <EditCertification
                    cert={cert}
                    onCancel={() => setIsEditing(false)}
                    onEdit={onEdit}
                    onRemove={onRemove}
                  />
                </DataListCell>,
              ]
        }
      />
      <DataListAction
        aria-labelledby="clickable-action-item1 clickable-action-action1"
        id="clickable-action-action1"
        aria-label="Actions"
      >
        {isEditable && !isEditing && (
          <Button
            variant="plain"
            icon={<PenIcon />}
            isInline
            size="sm"
            onClick={() => setIsEditing(true)}
          />
        )}
      </DataListAction>
    </DataListItemRow>
  );
}

function CompletedCertificate({
  cert,
  isEditable,
  onEdit,
  onRemove,
}: {
  cert: Certification & { status: "completed" };
  isEditable: boolean;
  onEdit: (fields: Partial<Certification>) => void;
  onRemove: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  return (
    <ListItem key={cert._id}>
      {!isEditing ? (
        <Content component={ContentVariants.h6}>
          &#x1F389;{" "}
          <span style={{ fontWeight: 900 }}>{cert.employee.name}</span>{" "}
          <span style={{ fontWeight: 400 }}>is now a</span>{" "}
          <span style={{ fontWeight: 900 }}>{cert.title}</span>{" "}
          {cert.examCode && (
            <a href={cert.examLink} target="_blank" style={{ fontWeight: 400 }}>
              ({cert.examCode})
            </a>
          )}{" "}
          &#x1F389;
          {isEditable && (
            <Button
              variant="plain"
              icon={<PenIcon />}
              isInline
              size="sm"
              onClick={() => setIsEditing(true)}
            />
          )}
        </Content>
      ) : (
        <EditCertification
          cert={cert}
          onCancel={() => setIsEditing(false)}
          onEdit={onEdit}
          onRemove={onRemove}
        />
      )}
    </ListItem>
  );
}

function NewCertificationForm({
  departmentId,
  onClose,
  onAdd,
}: {
  departmentId: string;
  onClose: () => void;
  onAdd: (newCert: Certification) => void;
}) {
  const [blankFields, setBlankFields] = useState<{
    title: string;
    examCode: string;
    examLink: string;
    status: string;
    statusDate: string;
    employeeId?: string;
  }>({
    title: "",
    examCode: "",
    examLink: "",
    status: "projected",
    statusDate: "",
  });
  const [error, setError] = useState<null | string>(null);
  const [isLoading, setLoading] = useState(false);
  const httpRequest = useFetch();
  const access = useDepartmentAccess(departmentId);

  async function handleAdd(e: any) {
    e.preventDefault();
    if (isLoading || !blankFields) return;
    setLoading(true);
    setError(null);

    const { data, error } = await httpRequest<Certification>(
      `/certifications`,
      {
        method: "POST",
        body: JSON.stringify({
          title: blankFields.title,
          examCode: blankFields.examCode,
          examLink: blankFields.examLink,
          status: blankFields.status,
          employeeId: blankFields.employeeId,
          departmentId: departmentId,
          [blankFields.status === "projected"
            ? "dateProjected"
            : "dateCompleted"]: blankFields.statusDate,
        }),
      }
    );
    setLoading(false);
    if (error) {
      console.log(error);
      setError(error.message);
      return;
    }

    if (data && Object.keys(data).length > 0) {
      onClose();
      onAdd(data);
    }
  }
  return (
    <Panel variant="raised" style={{ padding: 20 }}>
      <Form onSubmit={handleAdd}>
        <Grid hasGutter md={6}>
          <GridItem span={12}>
            <FormGroup label="Title">
              <TextInput
                aria-label="title"
                value={blankFields.title}
                onChange={(_e, title) =>
                  setBlankFields({ ...blankFields, title })
                }
                placeholder="Ex: Red Hat Certified System Administrator"
                isDisabled={isLoading}
              />
            </FormGroup>
          </GridItem>
          <GridItem span={3}>
            <FormGroup label="Exam Code">
              <TextInput
                aria-label="exam-code"
                value={blankFields.examCode}
                onChange={(_e, examCode) =>
                  setBlankFields({ ...blankFields, examCode })
                }
                placeholder="Ex: EX200"
                isDisabled={isLoading}
              />
            </FormGroup>
          </GridItem>
          <GridItem span={9}>
            <FormGroup label="Exam Link">
              <TextInput
                aria-label="exam-link"
                value={blankFields.examLink}
                onChange={(_e, examLink) =>
                  setBlankFields({ ...blankFields, examLink })
                }
                placeholder="Ex: https://www.redhat.com/en/services/certification/rhcsa"
                isDisabled={isLoading}
              />
            </FormGroup>
          </GridItem>
          <GridItem span={3}>
            <FormGroup label="Status">
              <Radio
                name="status"
                label={
                  <>
                    Projected <CalendarAltIcon style={{ color: "orange" }} />
                  </>
                }
                id="status-01"
                checked={blankFields.status === "projected"}
                onChange={(_e, checked) =>
                  setBlankFields({
                    ...blankFields,
                    status: checked ? "projected" : "completed",
                    statusDate: "",
                  })
                }
                isDisabled={isLoading}
              />
              <Radio
                name="status"
                label={
                  <>
                    Completed <CheckCircleIcon style={{ color: "green" }} />
                  </>
                }
                id="status-02"
                checked={blankFields.status === "completed"}
                onChange={(_e, checked) =>
                  setBlankFields({
                    ...blankFields,
                    status: checked ? "completed" : "projected",
                    statusDate: "",
                  })
                }
                isDisabled={isLoading}
              />
            </FormGroup>
          </GridItem>
          <GridItem>
            <FormGroup
              label={
                blankFields.status === "projected"
                  ? "Date Projected"
                  : "Date Completed"
              }
            >
              <DatePicker
                value={blankFields.statusDate}
                onChange={(_event, statusDate) =>
                  setBlankFields({ ...blankFields, statusDate })
                }
                isDisabled={isLoading}
              />
            </FormGroup>
          </GridItem>
          {access === "lead" && (
            <GridItem span={4}>
              <FormGroup label="Employee">
                <EmployeeSelect
                  value={blankFields.employeeId || ""}
                  onValueChange={(employeeId) =>
                    setBlankFields({ ...blankFields, employeeId })
                  }
                  isDisabled={isLoading}
                  departmentId={departmentId}
                />
              </FormGroup>
            </GridItem>
          )}
        </Grid>
        {error && (
          <p style={{ color: "red" }}>
            <Alert variant="danger" isInline isPlain title={error} />{" "}
          </p>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            gap: 10,
          }}
        >
          <Button
            variant="primary"
            isLoading={isLoading}
            isDisabled={isLoading}
            onClick={handleAdd}
          >
            Submit
          </Button>
          <Button variant="link" onClick={onClose} isDisabled={isLoading}>
            Cancel
          </Button>
        </div>
      </Form>
    </Panel>
  );
}

function EditCertification({
  cert,
  onEdit,
  onRemove,
  onCancel,
}: {
  cert: Certification;
  onEdit: (fields: Partial<Certification>) => void;
  onRemove: () => void;
  onCancel: () => void;
}) {
  const [editFields, setEditFields] = useState({
    title: cert.title,
    examCode: cert.examCode,
    examLink: cert.examLink,
    status: cert.status,
    statusDate: fmtDate2(
      cert.status === "completed" ? cert.dateCompleted : cert.dateProjected
    ),
  });
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const httpRequest = useFetch();

  async function handleSubmit(e: any) {
    e.preventDefault();
    if (isLoading) return;

    const changedFields: Record<string, string | undefined> = {};
    if (cert.title !== editFields.title) {
      changedFields.title = editFields.title;
    }
    if (cert.examCode !== editFields.examCode) {
      changedFields.examCode = editFields.examCode;
    }
    if (cert.examLink !== editFields.examLink) {
      changedFields.examLink = editFields.examLink;
    }

    if (cert.status !== editFields.status) {
      changedFields.status = editFields.status;
      if (!editFields.statusDate) {
        setError("'Date' is required");
        return;
      }
    }

    if (
      fmtDate2(
        cert.status === "completed" ? cert.dateCompleted : cert.dateProjected
      ) !== fmtDate2(editFields.statusDate)
    ) {
      if (editFields.status === "completed") {
        changedFields["dateCompleted"] = editFields.statusDate;
      }
      if (editFields.status === "projected") {
        changedFields["dateProjected"] = editFields.statusDate;
      }
    }

    setLoading(true);
    setError(null);
    const { data, error } = await httpRequest<Partial<Certification>>(
      `/certifications/${cert._id}`,
      { method: "PATCH", body: JSON.stringify(changedFields) }
    );
    setLoading(false);
    if (error) {
      console.log(error, "failed to edit certification");
      setError(error.message);
      return;
    }

    if (data) {
      onEdit(changedFields);
    }
  }

  async function handleRemove() {
    if (isLoading) return;
    setLoading(true);
    setError(null);
    const { data, error } = await httpRequest<Partial<Certification>>(
      `/certifications/${cert._id}`,
      { method: "DELETE" }
    );
    setLoading(false);
    if (error) {
      console.log(error, "failed to delete certification");
      setError(error.message);
      return;
    }

    if (data) {
      onRemove();
    }
  }

  return (
    <Panel variant="bordered" style={{ padding: 20 }}>
      <Form onSubmit={handleSubmit}>
        <Grid hasGutter md={6}>
          <GridItem span={12}>
            <FormGroup label="Title">
              <TextInput
                aria-label="title"
                value={editFields.title}
                onChange={(_e, title) =>
                  setEditFields({ ...editFields, title })
                }
                placeholder="Ex: Red Hat Certified System Administrator"
                isDisabled={isLoading}
              />
            </FormGroup>
          </GridItem>
          <GridItem span={3}>
            <FormGroup label="Exam Code">
              <TextInput
                aria-label="exam-code"
                value={editFields.examCode}
                onChange={(_e, examCode) =>
                  setEditFields({ ...editFields, examCode })
                }
                placeholder="Ex: EX200"
                isDisabled={isLoading}
              />
            </FormGroup>
          </GridItem>
          <GridItem span={9}>
            <FormGroup label="Exam Link">
              <TextInput
                aria-label="exam-link"
                value={editFields.examLink}
                onChange={(_e, examLink) =>
                  setEditFields({ ...editFields, examLink })
                }
                placeholder="Ex: https://www.redhat.com/en/services/certification/rhcsa"
                isDisabled={isLoading}
              />
            </FormGroup>
          </GridItem>
          <GridItem span={3}>
            <FormGroup label="Status">
              <Radio
                name="status"
                label={
                  <>
                    Projected <CalendarAltIcon style={{ color: "orange" }} />
                  </>
                }
                id="status-01"
                checked={editFields.status === "projected"}
                onChange={(_e, checked) =>
                  setEditFields({
                    ...editFields,
                    status: checked ? "projected" : "completed",
                    statusDate: "",
                  })
                }
                isDisabled={isLoading}
              />
              <Radio
                name="status"
                label={
                  <>
                    Completed <CheckCircleIcon style={{ color: "green" }} />
                  </>
                }
                id="status-02"
                checked={editFields.status === "completed"}
                onChange={(_e, checked) =>
                  setEditFields({
                    ...editFields,
                    status: checked ? "completed" : "projected",
                    statusDate: "",
                  })
                }
                isDisabled={isLoading}
              />
            </FormGroup>
          </GridItem>
          <GridItem>
            <FormGroup
              label={
                editFields.status === "projected"
                  ? "Date Projected"
                  : "Date Completed"
              }
            >
              <DatePicker
                value={editFields.statusDate}
                onChange={(_event, statusDate) =>
                  setEditFields({ ...editFields, statusDate })
                }
                isDisabled={isLoading}
              />
            </FormGroup>
          </GridItem>

          <GridItem span={4}>
            <FormGroup label="Employee">
              <TextInput
                readOnly
                isDisabled
                defaultValue={cert.employee.name}
              />
            </FormGroup>
          </GridItem>
        </Grid>
        {error && (
          <p style={{ color: "red" }}>
            <Alert variant="danger" isInline isPlain title={error} />{" "}
          </p>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            gap: 10,
          }}
        >
          <Button
            variant="primary"
            isLoading={isLoading}
            isDisabled={isLoading}
            onClick={handleSubmit}
          >
            Submit
          </Button>
          <Button variant="link" onClick={onCancel} isDisabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="link"
            onClick={handleRemove}
            isDisabled={isLoading}
            isDanger
          >
            Delete
          </Button>
        </div>
      </Form>
    </Panel>
  );
}
