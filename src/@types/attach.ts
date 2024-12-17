export interface ItemInfo {
  type: 'video' | 'image' | 'file';
  icon: React.ReactElement;
}

export type Extension =
  | 'image'
  | 'executable'
  | 'media'
  | 'voice'
  | 'docs'
  | 'zip';
