import { FC, useState } from "react";
import { Report } from "../types/report";
import {
  Alert,
  Button,
  Content,
  ContentVariants,
  DataList,
  DataListCell,
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
  PlusIcon,
} from "@patternfly/react-icons";
import { useDepartmentAccess } from "../hooks/useDepartmentAccess";
import { EmployeeSelect } from "./EmployeeSelect";
import { useFetch } from "../hooks/useFetch";
import { RDCertification } from "../types/rd-certification";
import { typedUseStoreActions } from "../store";
import { fmtDate1 } from "../utils/misc";

export const ReportCertifications: FC<{
  reportId: string;
  status: Report["status"];
  certifications: Report["certifications"];
  departmentId: string;
}> = ({ status, certifications, departmentId, reportId }) => {
  const [blankFields, setBlankFields] = useState<null | {
    title: string;
    examCode: string;
    examLink: string;
    status: string;
    statusDate: string;
    employeeId?: string;
  }>(null);
  const [error, setError] = useState<null | string>(null);
  const [isLoading, setLoading] = useState(false);

  const access = useDepartmentAccess(departmentId);
  const httpRequest = useFetch();
  const patchDocument = typedUseStoreActions(
    (actions) => actions.reports.patchDocument
  );

  function toggleAdd() {
    setBlankFields({
      title: "",
      examCode: "",
      examLink: "",
      status: "projected",
      statusDate: "",
    });
  }
  function cancelAdd() {
    setBlankFields(null);
    setError(null);
  }

  async function handleAdd(e: any) {
    e.preventDefault();
    if (isLoading || !blankFields) return;
    setLoading(true);
    setError(null);

    const { data, error } = await httpRequest<RDCertification>(
      `/reports/${reportId}/certifications`,
      {
        method: "POST",
        body: JSON.stringify({
          title: blankFields.title,
          examCode: blankFields.examCode,
          examLink: blankFields.examLink,
          status: blankFields.status,
          [blankFields.status === "projected"
            ? "dateProjected"
            : "dateCompleted"]: blankFields.statusDate,
          employee: blankFields.employeeId
            ? { _id: blankFields.employeeId }
            : undefined,
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
      setBlankFields(null);
      patchDocument({
        _id: reportId,
        fields: {
          certifications: [...certifications, data],
        },
      });
    }
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
                <ListItem key={cert._id}>
                  <Content component={ContentVariants.h6}>
                    &#x1F389;{" "}
                    <span style={{ fontWeight: 900 }}>
                      {cert.employee.name}
                    </span>{" "}
                    <span style={{ fontWeight: 400 }}>is now a</span>{" "}
                    <span style={{ fontWeight: 900 }}>{cert.title}</span>{" "}
                    {cert.examCode && (
                      <a
                        href={cert.examLink}
                        target="_blank"
                        style={{ fontWeight: 400 }}
                      >
                        ({cert.examCode})
                      </a>
                    )}{" "}
                    &#x1F389;
                  </Content>
                </ListItem>
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
                  <DataListItemRow>
                    <DataListItemCells
                      dataListCells={[
                        <DataListCell key="employee" isFilled={false}>
                          {cert.employee.name}
                        </DataListCell>,
                        <DataListCell key="cert">
                          {cert.title}{" "}
                          {cert.examCode && (
                            <a href={cert.examLink} target="_blank">
                              ({cert.examCode})
                            </a>
                          )}
                        </DataListCell>,
                        <DataListCell key="date" isFilled={false}>
                          <CalendarDayIcon style={{ marginRight: 5 }} />{" "}
                          <span>Projected for </span>
                          {fmtDate1(cert.dateProjected, "long")}
                        </DataListCell>,
                      ]}
                    />
                  </DataListItemRow>
                ))}
              </DataListItem>
            </DataList>
          </div>
        )}
        {/* {projectedCerts.length > 0 && (
          <div style={{ marginBottom: 10 }}>
            <Content style={{ marginBottom: 5 }}>Upcoming:</Content>
            <List>
              {projectedCerts.map((cert) => (
                <ListItem key={cert._id}>
                  {cert.title}{" "}
                  {cert.examCode && (
                    <a href={cert.examLink} target="_blank">
                      ({cert.examCode})
                    </a>
                  )}
                  {" - "} {cert.employee.name} (
                  {fmtDate1(cert.dateProjected, "long")})
                </ListItem>
              ))}
            </List>
          </div>
        )} */}

        {blankFields && (
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
                          Projected{" "}
                          <CalendarAltIcon style={{ color: "orange" }} />
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
                          Completed{" "}
                          <CheckCircleIcon style={{ color: "green" }} />
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
                <Button
                  variant="link"
                  onClick={cancelAdd}
                  isDisabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            </Form>
          </Panel>
        )}
        {access === "lead" && !blankFields && (
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
        <p>form to update</p>
      </div>
    );
  }

  return <></>;
};
