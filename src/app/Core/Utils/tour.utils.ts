import { Tour } from '../Interfaces/tour.interface';

/** Un tour Express dura hasta 4 días / 3 noches; de ahí en adelante vive en Tours. */
export const EXPRESS_MAX_DAYS = 4;

export function isExpressTour(tour: Tour): boolean {
  return tour.durationDays <= EXPRESS_MAX_DAYS;
}

export function getTourSection(tour: Tour): 'Express' | 'Tours' {
  return isExpressTour(tour) ? 'Express' : 'Tours';
}
