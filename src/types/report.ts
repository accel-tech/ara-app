import { Department } from "./department";
import { User } from "./user";

export type RDProjectData = {
  completedTasks: Array<{
    text: string;
    dateAdded: Date;
    addedBy: Pick<User, "_id" | "name" | "email">;
  }>;
  upcomingTasks: Array<{
    text: string;
    dateAdded: Date;
    addedBy: Pick<User, "_id" | "name" | "email">;
  }>;
  particularChallenges: Array<{
    text: string;
    dateAdded: Date;
    addedBy: Pick<User, "_id" | "name" | "email">;
  }>;
  issuesOnStandby: Array<{
    text: string;
    dateAdded: Date;
    addedBy: Pick<User, "_id" | "name" | "email">;
  }>;
};

interface RDProject {
  _id: string;
  title: string;
  description: string;
  dateCreated: Date;
  isActive: boolean;
  overseer: {
    _id: string;
    name: string;
    email: string;
  };
  department: {
    _id: string;
    title: string;
  };
  dateClosed?: Date;
}

interface RDReportData {
  kind: "r&d";
  projects: Array<
    Pick<RDProject, "_id" | "title" | "description" | "overseer"> &
      RDProjectData
  >;
  notes: Array<{
    text: string;
    dateAdded: Date;
    addedBy: Pick<User, "_id" | "name" | "email">;
  }>;
  metrics: {
    origins_cpu: number;
    origins_memory: number;
  };
  certifications: {
    completed: Array<{
      title: string;
      author: { _id: string; name: string; email: string };
      dateCompleted: Date;
      dateAdded: Date;
      link?: string;
      dateProjected?: Date;
    }>;
    projected: Array<{
      title: string;
      author: { _id: string; name: string; email: string };
      dateProjected: Date;
      dateAdded: Date;
      link?: string;
    }>;
  };
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
