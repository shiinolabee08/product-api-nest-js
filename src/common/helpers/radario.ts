export const sanitizePostcode = (postcode): string => {
  if (postcode) {
    return postcode.trim().split(' ').join('').toUpperCase();
  }

  return null;
};
