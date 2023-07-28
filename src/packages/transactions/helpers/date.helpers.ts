export const mapStringToDate = (from: string, endDate = false): Date => {
  const dates = from.split('-').map((date) => Number(date));
  const date = new Date(
    dates[0],
    dates[1] - 1,
    endDate ? dates[2] + 1 : dates[2],
  );
  date.setHours(date.getHours() - 3);
  return date;
};

export const brazilTimeZone = (): Date => {
  const date = new Date();
  date.setHours(date.getHours() - 3);
  return date;
};
