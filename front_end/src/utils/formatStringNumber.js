export const formatNumberWithDots = (numberString) => {
  const number = parseInt(numberString, 10);
  return number.toLocaleString("de-DE");
};
