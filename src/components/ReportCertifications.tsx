import { FC } from "react";
import { Report } from "../types/report";

export const ReportCertifications: FC<{
  status: Report["status"];
  certifications: Report["certifications"];
}> = ({ status, certifications }) => {
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
