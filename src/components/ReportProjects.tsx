import { FC, Fragment, useState } from "react";
import { Report } from "../types/report";
import {
  ActionGroup,
  Alert,
  Button,
  Form,
  FormGroup,
  Panel,
  TextInput,
} from "@patternfly/react-core";
import { PlusIcon } from "@patternfly/react-icons";
import { useDepartmentAccess } from "../hooks/useDepartmentAccess";
import { ProjectSelect } from "./ProjectSelect";
import { useFetch } from "../hooks/useFetch";
import { Project, ReportProject } from "../types/project";
import { EmployeeSelect } from "./EmployeeSelect";
import { typedUseStoreActions } from "../store";

export const ReportProjects: FC<{
  status: Report["status"];
  projects: Report["projects"];
  departmentId: string;
  reportId: string;
}> = ({ status, projects, departmentId, reportId }) => {
  const access = useDepartmentAccess(departmentId);
  const [addIsOpen, setAddIsOpen] = useState(false);

  const patchDocument = typedUseStoreActions(
    (actions) => actions.reports.patchDocument
  );

  function onNewProject(newProject: ReportProject) {
    patchDocument({
      _id: reportId,
      fields: {
        projects: [...projects, newProject],
      },
    });
  }

  if (status === "draft") {
    return (
      <div>
        {access !== "lead" && projects.length === 0 && (
          <p>No projects have been added by the department lead.</p>
        )}
        {projects.map((pro) => (
          <p key={pro._id}>Project {pro.title}</p>
        ))}
        {access === "lead" && addIsOpen && (
          <AddProjectPanel
            departmentId={departmentId}
            reportId={reportId}
            onCancel={() => setAddIsOpen(false)}
            onAdd={onNewProject}
          />
        )}
        {access === "lead" && !addIsOpen && (
          <Button
            variant="link"
            icon={<PlusIcon />}
            onClick={() => setAddIsOpen(true)}
          >
            Add Project
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

function AddProjectPanel({
  departmentId,
  reportId,
  onCancel,
  onAdd,
}: {
  departmentId: string;
  reportId: string;
  onAdd: (project: ReportProject) => void;
  onCancel: () => void;
}) {
  const [fields, setFields] = useState({ projectId: "" });
  const [newProjectFields, setNewProjectFields] = useState<{
    title: string;
    description: string;
    overseerId: string;
  } | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const httpRequest = useFetch();

  function toggleNewProject() {
    setNewProjectFields({ title: "", description: "", overseerId: "" });
  }

  async function handleSubmitExisting() {
    if (isLoading) return;
    if (!fields.projectId) {
      setError("You must select a 'Project'");
      return;
    }
    setError(null);
    setLoading(true);
    const { data, error } = await httpRequest<Project>(
      `/reports/${reportId}/projects`,
      {
        method: "POST",
        body: JSON.stringify(fields),
      }
    );
    setLoading(false);
    if (error) {
      console.log(error, "Failed to add project to report");
      setError(error.message);
      return;
    }
    if (data && Object.keys(data).length > 0) {
      onAdd({
        _id: data._id,
        title: data.title,
        description: data.description,
        overseer: data.overseer,
        tasks: [],
      });
    }
  }

  async function handleSubmitNew() {
    if (isLoading || !newProjectFields) return;
    if (!newProjectFields.title) {
      setError("You must provide a 'title'");
      return;
    }
    if (!newProjectFields.description) {
      setError("You must provide a 'description'");
      return;
    }
    if (!newProjectFields.overseerId) {
      setError("You must provide an 'overseer'");
      return;
    }
    setError(null);
    setLoading(true);
    const { data, error } = await httpRequest<Project>(`/projects`, {
      method: "POST",
      body: JSON.stringify({ ...newProjectFields, departmentId }),
    });
    setLoading(false);
    if (error) {
      console.log(error, "Failed to create project");
      setError(error.message);
      return;
    }
    if (data && Object.keys(data).length > 0) {
      onAdd({
        _id: data._id,
        title: data.title,
        overseer: data.overseer,
        description: data.description,
        tasks: [],
      });
    }
  }

  function handleSubmit(e: any) {
    e.preventDefault();
    if (!newProjectFields) return handleSubmitExisting();
    else return handleSubmitNew();
  }

  function handleCancel() {
    if (newProjectFields) {
      setNewProjectFields(null);
    } else {
      onCancel();
    }
  }

  return (
    <Panel variant="raised" style={{ padding: 20 }}>
      <Form onSubmit={handleSubmit}>
        {!newProjectFields ? (
          <Fragment>
            <FormGroup label="Create new Project">
              <Button variant="link" onClick={toggleNewProject}>
                Create Project
              </Button>
            </FormGroup>
            <FormGroup>or</FormGroup>
            <FormGroup label="Select Existing Project">
              <ProjectSelect
                departmentId={departmentId}
                value={fields.projectId}
                onValueChange={(projectId) =>
                  setFields({ ...fields, projectId })
                }
                isDisabled={isLoading}
              />
            </FormGroup>
          </Fragment>
        ) : (
          <Fragment>
            <FormGroup label="Title">
              <TextInput
                value={newProjectFields.title}
                onChange={(_e, title) =>
                  setNewProjectFields({ ...newProjectFields, title })
                }
                placeholder="Project Title"
                isDisabled={isLoading}
              />
            </FormGroup>
            <FormGroup label="Description">
              <TextInput
                value={newProjectFields.description}
                onChange={(_e, description) =>
                  setNewProjectFields({ ...newProjectFields, description })
                }
                placeholder="Project Description"
                isDisabled={isLoading}
              />
            </FormGroup>
            <FormGroup label="Overseer">
              <EmployeeSelect
                departmentId={departmentId}
                value={newProjectFields.title}
                onValueChange={(overseerId) =>
                  setNewProjectFields({ ...newProjectFields, overseerId })
                }
                isDisabled={isLoading}
              />
            </FormGroup>
          </Fragment>
        )}

        {error && <Alert variant="danger" isInline isPlain title={error} />}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: 10,
          }}
        >
          {(fields.projectId || !!newProjectFields) && (
            <Button
              isLoading={isLoading}
              isDisabled={isLoading}
              onClick={handleSubmit}
              // icon={<PlusIcon />}
            >
              {!!newProjectFields
                ? "Create New Project"
                : "Add Existing Project"}
            </Button>
          )}
          {/* <span>or</span>
          <Button variant="link">Create new project</Button>
          <span>or</span> */}
          <Button
            variant="link"
            isDanger
            onClick={handleCancel}
            isDisabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </Form>
    </Panel>
  );
}
