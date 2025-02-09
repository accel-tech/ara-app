import { User } from "./user";

export interface Project {
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

export type ProjectTask = {
  _id: string;
  text: string;
  dateAdded: Date;
  addedBy: Pick<User, "_id" | "name" | "email">;
  kind: "upcoming" | "completed" | "challenge" | "standby";
};

export type ReportProject = Pick<
  Project,
  "_id" | "title" | "description" | "overseer"
> & {
  tasks: Array<ProjectTask>;
};
