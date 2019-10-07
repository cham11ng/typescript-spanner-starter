import { differenceInHours } from 'date-fns';

/**
 * Get the number of hours between the given dates.
 *
 * @param {(Date | string | number)} from
 * @param {(Date | string | number)} to
 * @returns {number}
 */
export function getHourDifferenceFromNow(date: Date | string | number): number {
  return differenceInHours(new Date(), date);
}
