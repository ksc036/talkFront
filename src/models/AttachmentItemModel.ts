import { makeAutoObservable } from 'mobx';

import { ItemInfo } from '@/@types/attach';
import {
  getAttachmentItemInfo,
  getNativeFileInfo,
  getFormattedSize,
  generateImageThumbnail,
  generateVideoThumbnail,
} from '@/utils';

export class AttachmentItemModel {
  item: File;
  size: File['size'];
  name: string;
  fullName: string;
  extension: string;
  id: string;
  formattedSize: string;
  type: ItemInfo['type'];
  icon: ItemInfo['icon'];
  url: string | null = null;
  thumbnailFile: File | null = null;
  constructor(item: File) {
    makeAutoObservable(this);
    const { name, fullName, extension, id } = getNativeFileInfo(item);
    getNativeFileInfo(item);
    const { type, icon } = getAttachmentItemInfo(extension);
    const formattedSize = getFormattedSize(item.size);
    this.item = item;
    this.size = item.size;
    this.name = name;
    this.fullName = fullName;
    this.extension = extension;
    this.id = id;
    this.type = type;
    this.icon = icon;
    this.formattedSize = formattedSize;
  }

  async generateThumbnail() {
    if (this.type === 'image') {
      const { thumbnailImageFile, thumnailURL } = await generateImageThumbnail(
        this.item,
      );
      this.url = thumnailURL;
      this.thumbnailFile = thumbnailImageFile;
    } else if (this.type === 'video') {
      const { thumbnailVideoFile, thumnailURL } = await generateVideoThumbnail(
        this.item,
      );
      this.url = thumnailURL;
      this.thumbnailFile = thumbnailVideoFile;
    }
  }
}
