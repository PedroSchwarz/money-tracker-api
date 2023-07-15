export const mapStringToDate = (from: string, endDate = false): Date => {
  const dates = from.split('-').map((date) => Number(date));
  return new Date(dates[0], dates[1] - 1, endDate ? dates[2] + 1 : dates[2]);
};
