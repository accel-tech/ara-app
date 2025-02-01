import { FC } from "react";
import { Report } from "../types/report";
import { Button } from "@patternfly/react-core";
import { PlusIcon } from "@patternfly/react-icons";
import { useDepartmentAccess } from "../hooks/useDepartmentAccess";

export const ReportCertifications: FC<{
  status: Report["status"];
  certifications: Report["certifications"];
  departmentId: string;
}> = ({ status, certifications, departmentId }) => {
  const access = useDepartmentAccess(departmentId);

  if (status === "draft") {
    return (
      <div>
        {access !== "lead" &&
          certifications.completed.length + certifications.projected.length ===
            0 && (
            <p>No certifications have been added by the department lead.</p>
          )}
        {access === "lead" && (
          <Button variant="link" icon={<PlusIcon />}>
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
