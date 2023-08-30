// Create an object with the updated attributes only

export const getUpdatedAttributes = <T>(initial: T, updated: Partial<T>): Partial<T> => {
  const updatedAttributes: Partial<T> = {};

  for (const key in updated) {
    if (initial[key] !== updated[key]) {
      updatedAttributes[key] = updated[key];
    }
  }

  return updatedAttributes;
};

