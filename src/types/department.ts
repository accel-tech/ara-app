export interface Department {
  _id: string;
  title: string;
  dateCreated: Date;
  category: string;
  reportKind: "r&d" | "something-else";
}
