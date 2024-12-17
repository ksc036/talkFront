import { CancelTokenSource } from 'axios';
import { makeAutoObservable } from 'mobx';

import * as T from '@/@types';
import { uploadDto } from '@/dto';
import { MessageModel } from '@/models';
import { FileRepoImpl, FileRepository } from '@/repositories/FileRepository';

import { RootStore } from './RootStore';

interface MediaPreviewMeta {
  documentId: number;
  title: string;
  extension: string;
  size: number;
  uploader?: string;
  date?: string;
}

interface MediaPreviewData {
  file: Blob;
  source: string;
}

export class FileStore {
  rootStore: RootStore;
  repo: FileRepository;
  uploadTempInfo: {
    [tempId: string]: {
      source: CancelTokenSource;
    };
  } = {};
  isInit;
  // 이미지 미리보기하려고 select한 파일의 정보
  mediaPreviewMeta: MediaPreviewMeta | null;
  mediaPreviewData: MediaPreviewData | null;
  fileValidityCacheMap: Map<number, boolean>;
  thumbnailCacheMap: Map<number, string>;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    this.mediaPreviewMeta = null;
    this.mediaPreviewData = null;
    this.fileValidityCacheMap = new Map();
    this.thumbnailCacheMap = new Map();
    this.repo = FileRepoImpl;
    this.isInit = false;
    makeAutoObservable(this);
  }

  initialize() {
    this.rootStore.talkStore?.addHandler('DELETE_DOCUMENT', (jsonMessage) => {
      this.handleDeleteDocument(jsonMessage as T.SocketMessage);
    });
  }

  handleDeleteDocument(jsonMessage: T.SocketMessage) {
    const deletedDocumentInfos = jsonMessage.documentWebRes;

    if (deletedDocumentInfos) {
      for (const { msgId, documentId } of deletedDocumentInfos) {
        const targetMessages = this.rootStore.messageStore.messages.filter(
          (message: MessageModel) => message.msgId === msgId,
        );

        targetMessages.forEach((targetMessage: MessageModel) => {
          targetMessage.setDocumentDeleted(documentId);
        });
      }
    }
  }

  setIsInit = (isInit: boolean) => {
    this.isInit = isInit;
  };

  uploadFile = async ({ file, dto }: { file: File; dto: uploadDto }) => {
    try {
      const { status, data } = await this.repo.uploadFile({
        file,
        dto,
      });
      if (status === 'OK' && data) return data;
    } catch (error) {
      console.log(error);
    }
  };

  getThumbnail = async (documentId: number) => {
    try {
      const { arrayBuffer } = await this.repo.getThumbnail(documentId);
      if (arrayBuffer) {
        const blob = new Blob([arrayBuffer], { type: 'image/jpeg' });
        return blob;
      }
    } catch (error) {
      console.log(error);
    }
  };

  downloadFile = async (documentId: number) => {
    try {
      const { arrayBuffer } = await this.repo.downloadFile(documentId);
      if (arrayBuffer) {
        const blob = new Blob([arrayBuffer], { type: 'image/jpeg' });
        return blob;
      }
    } catch (error) {
      console.log(error);
    }
  };

  uploadThumbnail = async ({
    file,
    dto,
  }: {
    file: File;
    dto: { docId: number };
  }) => {
    try {
      const { status, data } = await this.repo.uploadThumbnail({
        file,
        dto,
      });
      if (status === 'OK' && data) return data;
    } catch (error) {
      console.log(error);
    }
  };

  setMediaPreviewMeta = (meta: MediaPreviewMeta | null) => {
    this.mediaPreviewMeta = meta;
  };

  setMediaPreviewData = (data: MediaPreviewData | null) => {
    this.mediaPreviewData = data;
  };

  getThumbnailCacheMap = (documentId: number) => {
    return this.thumbnailCacheMap.get(documentId);
  };

  setThumbnailCacheMap = (documentId: number, url: string) => {
    this.thumbnailCacheMap.set(documentId, url);
  };

  clearCache = () => {
    this.thumbnailCacheMap.forEach((thumbnail: string) => {
      if (thumbnail) {
        URL.revokeObjectURL(thumbnail);
      }
    });
    this.fileValidityCacheMap.clear();
    this.thumbnailCacheMap.clear();
  };

  openHancomOffice = ({
    personaId,
    documentId,
    documentExtension,
  }: {
    personaId: number;
    documentId: number;
    documentExtension: string;
  }) => {
    const hancomUrl = window.env?.HANCOM_OFFICE_URL;
    const langSet = 'ko_KR';
    const hasEditPermission = true;

    const appType = (() => {
      switch (documentExtension) {
        case 'docx':
        case 'doc':
          return hasEditPermission ? 'WRITE_EDITOR' : 'WRITE_VIEWER';
        case 'xlsx':
        case 'xls':
          return hasEditPermission ? 'CALC_EDITOR' : 'CALC_VIEWER';
        case 'pptx':
        case 'ppt':
          return hasEditPermission ? 'SHOW_EDITOR' : 'SHOW_VIEWER';
        case 'hwpx':
        case 'hwp':
          return hasEditPermission ? 'HWP_EDITOR' : 'HWP_VIEWER';
        default:
          return '';
      }
    })();

    const url = `${hancomUrl}?app=${appType}&docId=${documentId}&user_id=${personaId}&lang=${langSet}`;

    window.open(url);
  };
}
