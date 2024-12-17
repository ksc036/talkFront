import { EmoticonKey } from '@/@types';
import {
  RecentEmoticonData,
  EmoticonTab,
  EmoticonType,
} from '@/@types/emoticon';
import { EmoticonModel } from '@/models/EmoticonModel';

const LOCAL_STORAGE_KEY = 'stickerHistory';

export class RecentEmoticonModel extends EmoticonModel {
  recentEmoticons: RecentEmoticonData[] = [];

  constructor(
    tooltip = '',
    type: EmoticonType = EmoticonType.LEGACY,
    tab: EmoticonTab = { normal: '', active: '' },
    inactiveIcon: JSX.Element,
    activeIcon: JSX.Element,
  ) {
    super(tooltip, type, tab, inactiveIcon, activeIcon);
    const local = localStorage.getItem(LOCAL_STORAGE_KEY);
    const parsed = local ? JSON.parse(local) : [];
    this.recentEmoticons = parsed.map((emo: RecentEmoticonData) => {
      const sticker = EmoticonModel.globalEmoticonMap.get(emo.key);
      emo.thumbnail = sticker?.thumbnail || '';
      return emo;
    });
  }

  // override
  insertEmoticon(key: EmoticonKey): void {
    const selected = EmoticonModel.globalEmoticonMap.get(key);
    if (!selected) return;
    const sticker: RecentEmoticonData = {
      ...selected,
      selectedTime: new Date().getTime(),
    };

    const filtered = this.emoticons.filter((item) => item.key !== sticker.key);
    this.recentEmoticons = [sticker, ...filtered];
    this.updateLocalStorage();
  }

  updateLocalStorage() {
    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify(this.recentEmoticons),
    );
  }

  // override
  get emoticons(): RecentEmoticonData[] {
    return this.recentEmoticons
      .sort((a, b) => b.selectedTime - a.selectedTime)
      .slice(0, 32);
  }
}
