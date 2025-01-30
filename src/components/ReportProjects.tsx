import { FC } from "react";
import { Report } from "../types/report";

export const ReportProjects: FC<{
  status: Report["status"];
  projects: Report["projects"];
}> = ({ status, projects }) => {
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
