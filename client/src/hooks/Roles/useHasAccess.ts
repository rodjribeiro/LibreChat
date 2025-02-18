import { useMemo, useCallback } from 'react';
import { PermissionTypes, Permissions } from 'librechat-data-provider';
import { useAuthContext } from '~/hooks/AuthContext';
import { userEndpointsConfig } from '~/config/userEndpointsConfig';

const useHasAccess = ({
  permissionType,
  permission,
  endpoint,
}: {
  permissionType: PermissionTypes;
  permission: Permissions;
  endpoint?: string;
}) => {
  const { isAuthenticated, user, roles } = useAuthContext();

  const checkAccess = useCallback(
    ({ user, permissionType, permission, endpoint }) => {
      if (isAuthenticated && user?.role != null && roles && roles[user.role]) {
        const hasPermission = roles[user.role]?.[permissionType]?.[permission] === true;
        const hasEndpointAccess = endpoint
          ? userEndpointsConfig[user.email]?.includes(endpoint)
          : true;
        return hasPermission && hasEndpointAccess;
      }
      return false;
    },
    [isAuthenticated, roles],
  );

  const hasAccess = useMemo(
    () => checkAccess({ user, permissionType, permission, endpoint }),
    [user, permissionType, permission, endpoint, checkAccess],
  );

  return hasAccess;
};

export default useHasAccess;