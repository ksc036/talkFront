import type { Base64, EmoticonKey } from '@/@types/common';

export enum EmoticonType {
  LEGACY = '',
  EMOJI = 'emoticon', // 작은 이모티콘
  STICKER = 'sticker', // 큰 이모티콘
}

export type EmoticonTab = {
  normal: Base64;
  active: Base64;
};

export type EmoticonData = {
  key: EmoticonKey;
  type: EmoticonType;
  image: Base64;
  thumbnail: Base64;
};

export interface RecentEmoticonData extends EmoticonData {
  selectedTime: number;
}
