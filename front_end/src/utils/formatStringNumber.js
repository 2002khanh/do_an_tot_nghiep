export const formatNumberWithDots = (numberString) => {
  console.log(numberString);
  const number = parseInt(numberString, 10);
  return number.toLocaleString("de-DE");
};
