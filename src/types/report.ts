import { Department } from "./department";
import { Certification } from "./certification";
import { User } from "./user";
import { Project, ReportProject } from "./project";

type RDNote = {
  _id: string;
  text: string;
  dateAdded: Date;
  addedBy: Pick<User, "_id" | "name" | "email">;
};

interface RDReportData {
  kind: "r&d";
  projects: Array<ReportProject>;
  notes: RDNote[];
  metrics: {
    origins_cpu: number;
    origins_memory: number;
  };
  certifications: Certification[];
}

type ReportStatus =
  | { status: "draft" }
  | { status: "published"; datePublished: Date };

interface GenericReport {
  _id: string;
  title: string;
  dateCreated: Date;
  coveringDates: { from: Date; to: Date };
  department: Pick<Department, "_id" | "title">;
}

type RDReport = RDReportData & ReportStatus & GenericReport;

export type Report = RDReport;
