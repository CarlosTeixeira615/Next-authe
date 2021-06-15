interface ValidateUserPermissionsParams {
  user: User;
  permissions?: string[];
  roles?: string[];
}

interface User {
  permissions: string[];
  roles: string[];
}

export function ValidateUserPermissions({
  user,
  permissions,
  roles,
}: ValidateUserPermissionsParams) {
  if (permissions?.length > 0) {
    const hasAllPermissions = permissions.every((permission) => {
      return user?.permissions.includes(permission);
    });
    if (!hasAllPermissions) {
      return false;
    }
  }

  if (roles?.length > 0) {
    const hasAllroles = roles.some((role) => {
      return user.roles.includes(role);
    });

    if (!hasAllroles) {
      return false;
    }
  }
  return true;
}
