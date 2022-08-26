export const getTotalDaysDifferenceBetweenDates = (
  firstDate: Date,
  secondDate: Date
): number => {
  const difference = secondDate.getTime() - firstDate.getTime();
  const totalDays = Math.ceil(difference / (1000 * 3600 * 24));

  return totalDays;
};
