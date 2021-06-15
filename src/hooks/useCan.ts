import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { ValidateUserPermissions } from "../utils/ValidateUserPermissions";

interface UseCanParams {
  permissions?: string[];
  roles?: string[];
}

export function useCan({ permissions, roles }: UseCanParams) {
  const { user, isAuthenticated } = useContext(AuthContext);
  if (isAuthenticated) {
    return false;
  }
  console.log(user);

  const userHasValidPermissions = ValidateUserPermissions({
    user,
    permissions,
    roles,
  });
  return userHasValidPermissions;
}
