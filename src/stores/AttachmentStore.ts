import { makeAutoObservable } from 'mobx';

import { AttachmentItemModel } from '@/models';

import { RootStore } from './RootStore';

export class AttachmentStore {
  rootStore: RootStore;
  attachments: AttachmentItemModel[];
  failModalVisible: boolean;
  rejectString: string;
  unsupportedExtensions: string[];
  readyToUpload: boolean;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    this.attachments = [];
    this.failModalVisible = false;
    this.rejectString = '';
    this.unsupportedExtensions = [];
    this.readyToUpload = true;
    makeAutoObservable(this);
  }

  async addAttachments(attachments: FileList | File[]) {
    try {
      // 파일 첨부 실패 다이얼로그가 호출되어 있으면 파일을 첨부하지 않음
      if (this.failModalVisible) return;
      if (attachments.length === 0) return;
      this.setReadyToUpload(false);

      const attachs: AttachmentItemModel[] = [];

      // 파일 확장자 지원 여부 확인
      for await (const item of attachments) {
        const itemModel = new AttachmentItemModel(item);
        await itemModel.generateThumbnail();
        if (itemModel.extension !== '') {
          if (
            this.rootStore.configStore.isUnsupportedFile(itemModel.extension)
          ) {
            this.unsupportedExtensions.push(itemModel.extension);
            this.failModalVisible = true;
          } else {
            attachs.push(itemModel);
          }
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 0));

      // 중복이면 추가안함
      const filteredAttachs = attachs.filter((item) => {
        const alreadyHas = this.attachments.find((item2) => {
          return item.id === item2.id;
        });
        return !alreadyHas;
      });
      this.attachments = [...this.attachments, ...filteredAttachs];

      if (this.unsupportedExtensions.length === 1) {
        this.rejectString = `.${this.unsupportedExtensions[0]}는 지원하지 않는 파일입니다.\n다시 시도해 주세요.`;
      } else if (this.unsupportedExtensions.length > 1) {
        this.rejectString = `.${this.unsupportedExtensions[0]}외 ${
          this.unsupportedExtensions.length - 1
        }개는 지원하지 않는 파일입니다.\n다시 시도해 주세요.`;
      }
    } catch (e) {
      console.log('addAttachments error: ', e);
    } finally {
      this.setReadyToUpload(true);
    }
  }

  removeAttachments(item: AttachmentItemModel): void {
    if (item.url) URL.revokeObjectURL(item.url);
    this.attachments = this.attachments.filter((temp) => temp.id !== item.id);
  }

  removeAttachmentsAll(): void {
    this.attachments.forEach((item) => {
      if (item.url) URL.revokeObjectURL(item.url);
    });
    this.attachments = [];
  }

  setFailModalVisible(value: boolean) {
    this.failModalVisible = value;
  }

  setRejectString(value: string) {
    this.rejectString = value;
  }

  clearUnsupportedExtensions() {
    this.unsupportedExtensions = [];
  }

  setReadyToUpload(readyToUpload: boolean) {
    this.readyToUpload = readyToUpload;
  }
}
