import { FC } from "react";
import { Report } from "../types/report";
import { Button } from "@patternfly/react-core";
import { PlusIcon } from "@patternfly/react-icons";
import { useDepartmentAccess } from "../hooks/useDepartmentAccess";

export const ReportProjects: FC<{
  status: Report["status"];
  projects: Report["projects"];
  departmentId: string;
}> = ({ status, projects, departmentId }) => {
  const access = useDepartmentAccess(departmentId);

  if (status === "draft") {
    return (
      <div>
        {access !== "lead" && projects.length === 0 && (
          <p>No projects have been added by the department lead.</p>
        )}
        {access === "lead" && (
          <Button variant="link" icon={<PlusIcon />}>
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
