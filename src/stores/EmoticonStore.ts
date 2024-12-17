import { makeAutoObservable } from 'mobx';

import { EmoticonData } from '@/@types/emoticon';
import { EmoticonsAll } from '@/assets/emoticons';
import RecentEmoticons from '@/assets/emoticons/recentEmoticon';

import { RootStore } from './RootStore';

export class EmoticonStore {
  rootStore: RootStore;
  tabIndex = 0;
  selectedSticker = '';

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  get emoticons() {
    return this.rootStore.configStore.ShowRecentEmoticons
      ? [RecentEmoticons, ...EmoticonsAll]
      : [...EmoticonsAll];
  }

  get selectedTab() {
    return this.emoticons[this.tabIndex];
  }

  setIndex(index: number) {
    if (index < this.emoticons.length) {
      this.tabIndex = index;
    } else {
      this.tabIndex = 0;
    }
  }
  setSelectedSticker(key: string) {
    this.selectedSticker = key;
  }
  updateRecentEmoticons(keys: EmoticonData['key'][]) {
    keys.forEach((key) => {
      RecentEmoticons.insertEmoticon(key);
    });
  }
}
