import { FC } from "react";
import { Report } from "../types/report";
import { Button } from "@patternfly/react-core";
import { PlusIcon } from "@patternfly/react-icons";
import { useDepartmentAccess } from "../hooks/useDepartmentAccess";

export const ReportNotes: FC<{
  status: Report["status"];
  notes: Report["notes"];
  departmentId: string;
}> = ({ status, notes, departmentId }) => {
  const access = useDepartmentAccess(departmentId);

  if (status === "draft") {
    return (
      <div>
        {access !== "lead" && notes.length === 0 && (
          <p>No notes have been added by the department lead.</p>
        )}
        {access === "lead" && (
          <Button variant="link" icon={<PlusIcon />}>
            Add Note
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
