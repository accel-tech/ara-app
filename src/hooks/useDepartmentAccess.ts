import { typedUseStoreState } from "../store";

export const useDepartmentAccess = (departmentId: string) => {
  const user = typedUseStoreState((state) => state.auth.user);
  if (user?.role !== "basic") return null;
  const department = user.departmentAccess.find(
    (dep) => dep._id === departmentId
  );

  return department?.access || null;
};
