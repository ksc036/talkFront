import type { RefObject } from 'react';

import { makeAutoObservable } from 'mobx';

export type refName = 'attachRef';

export class RefStore {
  refMap: Map<string, RefObject<HTMLElement>> = new Map();

  constructor() {
    makeAutoObservable(this);
  }
}
