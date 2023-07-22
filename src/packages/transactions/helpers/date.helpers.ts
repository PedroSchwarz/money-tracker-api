import { DateTime } from 'luxon';

export const mapStringToDate = (from: string, endDate = false): Date => {
  const dates = from.split('-').map((date) => Number(date));
  const date = DateTime.fromObject({
    day: endDate ? dates[2] + 1 : dates[2],
    month: dates[1],
    year: dates[0],
    hour: 0,
  });
  /// .minus({ hours: 3 })
  /// Australia .plus({ hours: 10 })
  return date.toJSDate();
};

export const brazilTimeZone = (): Date => {
  const brazilTimeZone = DateTime.now();
  /// .minus({ hours: 3 })
  /// Australia .plus({ hours: 10 })
  return brazilTimeZone.toJSDate();
};
