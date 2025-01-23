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
}

export type User = Admin | Basic;
