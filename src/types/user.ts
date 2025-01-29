interface BaseUser {
  _id: string;
  name: string;
  email: string;
}

interface Admin extends BaseUser {
  role: "admin";
}

interface Basic extends BaseUser {
  role: "basic";
  departmentAccess: {
    _id: string;
    title: string;
    category: string;
    access: "member" | "lead";
  }[];
}

export type User = Admin | Basic;
