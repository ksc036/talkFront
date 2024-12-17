import { action } from 'mobx';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mergeObject = action((source: any, target: any) => {
  Object.keys(target).forEach((prop) => {
    if ({}.hasOwnProperty.call(source, prop)) {
      source[prop] = target[prop];
    }
  });
});
