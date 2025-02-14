import { FC, Fragment, useState } from "react";
import { Report } from "../types/report";
import {
  ActionGroup,
  Alert,
  Button,
  Content,
  Divider,
  Form,
  FormGroup,
  List,
  ListItem,
  Panel,
  TextInput,
  Title,
} from "@patternfly/react-core";
import {
  CalendarAltIcon,
  CheckCircleIcon,
  CheckIcon,
  CircleIcon,
  PauseCircleIcon,
  PlusIcon,
  StopIconConfig,
  WarningTriangleIcon,
  WarningTriangleIconConfig,
} from "@patternfly/react-icons";
import { useDepartmentAccess } from "../hooks/useDepartmentAccess";
import { ProjectSelect } from "./ProjectSelect";
import { useFetch } from "../hooks/useFetch";
import { Project, ProjectTask, ReportProject } from "../types/project";
import { EmployeeSelect } from "./EmployeeSelect";
import { typedUseStoreActions, typedUseStoreState } from "../store";
import { InlineEditTextInput } from "./InlineEditTextInput";
import {
  capitalizeAllWords,
  capitalizeFirstLetter,
  urlizeString,
} from "../utils/misc";

export const ReportProjects: FC<{
  status: Report["status"];
  projects: Report["projects"];
  departmentId: string;
  reportId: string;
}> = ({ status, projects, departmentId, reportId }) => {
  const [addIsOpen, setAddIsOpen] = useState(false);

  const access = useDepartmentAccess(departmentId);
  const userId = typedUseStoreState((state) => state.auth.user!._id);

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

  function onRemoveProject(projectId: string) {
    patchDocument({
      _id: reportId,
      fields: {
        projects: projects.filter((pro) => pro._id !== projectId),
      },
    });
  }

  function onEditProject(args: {
    _id: string;
    fields: Partial<ReportProject>;
  }) {
    patchDocument({
      _id: reportId,
      fields: {
        projects: projects.map((pro) => {
          if (pro._id === args._id) {
            return { ...pro, ...args.fields };
          }
          return pro;
        }),
      },
    });
  }

  return (
    <div>
      {projects.length === 0 && (
        <p
          style={{
            opacity: 0.5,
            fontSize: 11,
            display:
              access === "lead" && status === "draft" ? "none" : undefined,
          }}
        >
          No project
        </p>
      )}

      {projects.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", rowGap: 10 }}>
          {projects
            .sort((a, b) => {
              if (a.overseer._id === userId) return -1;
              if (b.overseer._id === userId) return 1;
              return 0;
            })
            .map((pro) => (
              <ProjectComponent
                key={pro._id}
                project={pro}
                reportId={reportId}
                isEditable={
                  status === "draft" &&
                  (access === "lead" || pro.overseer._id === userId)
                }
                isLead={status === "draft" && access === "lead"}
                onEdit={(fields) => onEditProject({ _id: pro._id, fields })}
                onRemove={() => onRemoveProject(pro._id)}
              />
            ))}
        </div>
      )}

      {status === "draft" && access === "lead" && addIsOpen && (
        <AddProjectPanel
          departmentId={departmentId}
          reportId={reportId}
          onCancel={() => setAddIsOpen(false)}
          onAdd={onNewProject}
        />
      )}

      {status === "draft" && access === "lead" && !addIsOpen && (
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
    <Panel variant="raised" style={{ padding: 10, marginTop: 10 }}>
      <Form onSubmit={handleSubmit}>
        {!newProjectFields ? (
          <Fragment>
            <Button
              variant="link"
              onClick={toggleNewProject}
              icon={<PlusIcon />}
              style={{ marginTop: 10 }}
            >
              Create New Project
            </Button>
            <Divider />
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
              variant="stateful"
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

function ProjectComponent({
  project,
  isEditable,
  reportId,
  onEdit,
  onRemove,
  isLead,
}: {
  reportId: string;
  project: ReportProject;
  isEditable: boolean;
  isLead: boolean;
  onEdit: (fields: Partial<ReportProject>) => void;
  onRemove: () => void;
}) {
  const [newFields, setNewFields] = useState<null | {
    text: string;
    kind: string;
  }>(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const httpRequest = useFetch();

  async function handleAddTask() {
    if (isLoading || !newFields) return;
    if (!newFields.text) {
      setError("Content is required");
      return;
    }
    setLoading(true);
    setError(null);
    const { data, error } = await httpRequest<ProjectTask>("/tasks", {
      method: "POST",
      body: JSON.stringify({
        text: newFields.text,
        kind: newFields.kind,
        reportId: reportId,
        projectId: project._id,
      }),
    });
    setLoading(true);
    if (error) {
      console.log(error, "Failed to add task");
      setError(error.message);
      return;
    }

    if (data && Object.keys(data).length > 0) {
      onEdit({ tasks: [...project.tasks, data] });
      setNewFields(null);
    }
  }

  async function handleEditTask(args: { _id: string; text: string }) {
    if (isLoading) return;
    setLoading(true);
    onEdit({
      tasks: project.tasks.map((task) => ({
        ...task,
        text: task._id === args._id ? args.text : task.text,
      })),
    });
    const { error } = await httpRequest(`/tasks/${args._id}`, {
      method: "PATCH",
      body: JSON.stringify({ text: args.text }),
    });
    setLoading(false);
    if (error) {
      console.log(error, "Failed to edit task");
      setError(error.message);
      onEdit({
        tasks: project.tasks,
      });
      return;
    }
  }

  async function handleDeleteTask(taskId: string) {
    if (isLoading) return;
    setLoading(true);
    onEdit({
      tasks: project.tasks.filter((task) => task._id !== taskId),
    });
    const { error } = await httpRequest(`/tasks/${taskId}`, {
      method: "DELETE",
    });
    setLoading(false);
    if (error) {
      console.log(error, "Failed to delete task");
      setError(error.message);
      onEdit({
        tasks: project.tasks,
      });
      return;
    }
  }

  async function handleRemoveProject() {
    if (isLoading) return;
    setLoading(true);
    const { data, error } = await httpRequest(
      `/reports/${reportId}/projects/${project._id}`,
      {
        method: "DELETE",
      }
    );
    setLoading(false);
    if (error) {
      console.log(error, "Failed to remove project");
      setError(error.message);
      return;
    }
    if (data) {
      onRemove();
    }
  }

  function toggleAddTask(kind: string) {
    setNewFields({ text: newFields?.text || "", kind });
  }

  function cancelAddTask() {
    setNewFields(null);
    setError(null);
  }

  return (
    <Panel
      // variant=""
      style={{
        padding: 10,
        border: "1px solid #d1d1d1",
      }}
    >
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            margin: "5px 0",
          }}
        >
          <Title headingLevel="h3" id={urlizeString(project.title)}>
            {capitalizeFirstLetter(project.title)}
          </Title>
          {isLead && (
            <div>
              <Button
                size="sm"
                variant="link"
                isDanger
                onClick={handleRemoveProject}
                isDisabled={isLoading}
              >
                Remove Project from Report
              </Button>
            </div>
          )}
        </div>
        <Divider />
        <div
          style={{
            marginTop: 5,
            marginBottom: 10,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div>
            <span style={{ opacity: 0.6 }}>Objective:</span>{" "}
            <span>{project.description}</span>
          </div>
          <div>
            <span style={{ opacity: 0.6 }}>Overseer:</span>{" "}
            <span>{capitalizeAllWords(project.overseer.name)}</span>
          </div>
        </div>
      </div>
      {["completed", "upcoming", "challenge", "standby"].map((kind) => (
        <div key={kind}>
          <Divider style={{ marginTop: 10 }} />
          <Title style={{ margin: "5px 0", fontSize: 13 }} headingLevel="h6">
            {/* {getIcon(kind)}  */}
            {getTitle(kind)}
          </Title>
          <Divider style={{ marginBottom: 5 }} />
          {project.tasks.filter((task) => task.kind === kind).length > 0 ? (
            // <ul style={{ marginBottom: 10 }}>
            //   {project.tasks
            //     .filter((task) => task.kind === kind)
            //     .map((task) => (
            //       <li key={task._id}>
            //         <InlineEditTextInput
            //           actualValue={task.text}
            //           onSave={(text) => handleEditTask({ _id: task._id, text })}
            //           onDelete={() => handleDeleteTask(task._id)}
            //           isDisabled={!isEditable}
            //           isDeletable
            //         />
            //       </li>
            //     ))}
            // </ul>
            <List
              style={{ marginBottom: 10, paddingLeft: 0, gap: 0 }}
              className="customized-list"
            >
              {project.tasks
                .filter((task) => task.kind === kind)
                .map((task) => (
                  <ListItem
                    key={task._id}
                    icon={getListIcon(kind)}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    {isEditable ? (
                      <InlineEditTextInput
                        actualValue={task.text}
                        onSave={(text) =>
                          handleEditTask({ _id: task._id, text })
                        }
                        onDelete={() => handleDeleteTask(task._id)}
                        isDeletable
                      />
                    ) : (
                      <p>{task.text}</p>
                    )}
                  </ListItem>
                ))}
            </List>
          ) : (
            <p
              style={{
                opacity: 0.5,
                fontSize: 10,
                display: isLead ? "none" : undefined,
              }}
            >
              No tasks
            </p>
          )}
          {!!newFields && newFields.kind === kind ? (
            <NewTask
              fields={newFields}
              setFields={setNewFields}
              isLoading={isLoading}
              error={error}
              handleAdd={handleAddTask}
              handleCancel={cancelAddTask}
            />
          ) : (
            isEditable && (
              <Button
                size="sm"
                variant="link"
                icon={<PlusIcon />}
                onClick={() => toggleAddTask(kind)}
              />
            )
          )}
        </div>
      ))}
    </Panel>
  );
}

function NewTask({
  fields,
  setFields,
  error,
  isLoading,
  handleAdd,
  handleCancel,
}: {
  fields: { text: string; kind: string };
  setFields: (fields: { text: string; kind: string }) => void;
  error: string | null;
  isLoading: boolean;
  handleAdd: () => void;
  handleCancel: () => void;
}) {
  function handleSubmit(e: any) {
    e.preventDefault();
    handleAdd();
  }
  return (
    <Panel variant="secondary" style={{ padding: 10 }}>
      <Form style={{ display: "flex", columnGap: 5 }} onSubmit={handleSubmit}>
        <TextInput
          value={fields.text}
          onChange={(_e, text) => setFields({ ...fields, text })}
          isDisabled={isLoading}
          autoFocus
        />
        <Button variant="link" onClick={handleSubmit} isDisabled={isLoading}>
          Save
        </Button>
        <Button
          variant="link"
          isDanger
          onClick={handleCancel}
          isDisabled={isLoading}
        >
          Cancel
        </Button>
      </Form>
      {error && (
        <Alert
          variant="danger"
          isInline
          isPlain
          title={error}
          style={{ marginTop: 5 }}
        />
      )}
    </Panel>
  );
}
function getTitle(kind: string) {
  switch (kind) {
    case "completed":
      return "Tasks Completed";
    case "upcoming":
      return "Tasks Upcoming";
    case "challenge":
      return "Particular Challenges";
    case "standby":
      return "Activities on Standby";
    default:
      return "Tasks";
  }
}

function getIcon(kind: string) {
  switch (kind) {
    case "completed":
      return <CheckCircleIcon style={{ color: "green" }} />;
    case "upcoming":
      return <CalendarAltIcon style={{ color: "orange" }} />;
    case "challenge":
      return <WarningTriangleIcon style={{ color: "red" }} />;
    case "standby":
      return <PauseCircleIcon />;
    default:
      return <CircleIcon />;
  }
}

function getListIcon(kind: string) {
  switch (kind) {
    case "completed":
      return <CheckIcon style={{ color: "green" }} />;
    case "upcoming":
      return <CalendarAltIcon style={{ color: "orange" }} />;
    case "challenge":
      return <WarningTriangleIcon style={{ color: "red" }} />;
    case "standby":
      return <PauseCircleIcon style={{ color: "red" }} />;
    default:
      return <CircleIcon />;
  }
}
