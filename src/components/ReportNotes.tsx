import { FC } from "react";
import { Report } from "../types/report";

export const ReportNotes: FC<{
  status: Report["status"];
  notes: Report["notes"];
}> = ({ status, notes }) => {
  if (status === "draft") {
    return (
      <div>
        <p>form to update</p>
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
