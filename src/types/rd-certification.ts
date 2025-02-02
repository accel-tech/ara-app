type GenericProps = {
  _id: string;
  title: string;
  examCode?: string;
  examLink?: string;
  employee: { _id: string; name: string; email: string };
  dateAdded: Date;
};

interface Projected extends GenericProps {
  status: "projected";
  dateProjected: Date;
}

interface Completed extends GenericProps {
  status: "completed";
  dateCompleted: Date;
  dateProjected?: Date;
}

export type RDCertification = Projected | Completed;
