export const isIdUnique = (id: string) => {
  // Check if id contains only digits using regex
  const containsOnlyDigits = /^\d+$/.test(id);
  // Return false if only digits, true otherwise
  return !containsOnlyDigits;
};
