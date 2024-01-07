import { type Value } from '../types/stylesheet';

export const toPx = (val: Value): number => {
  return Array.isArray(val) && val[1] === 'px' ? val[0] : 0;
};
