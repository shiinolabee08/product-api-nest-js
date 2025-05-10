export const displayNumberFormat = (value: Number): string => {
  const formattedValue = value.toFixed(2).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1,');

  return formattedValue;
};
