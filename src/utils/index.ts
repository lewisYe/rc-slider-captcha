import { ClassNamesType } from '../types';
export const classNames = (name: string, others: ClassNamesType) => {
  const names = [name];
  for (const key in others) {
    // eslint-disable-next-line no-prototype-builtins
    if (others.hasOwnProperty(key) && others[key]) {
      names.push(key);
    }
  }
  return names.join(' ');
};
