import mappings from '@/constants/permissions';

/**
 * Checks if the role can perform the specificied action
 * @param {String} role
 * @param {String} action
 * @returns {Boolean}
 */
export const hasPermission = (role: string, action: string): boolean => {
  if (mappings.has(action)) {
    return mappings.get(action).includes(role);
  }

  return false;
};
