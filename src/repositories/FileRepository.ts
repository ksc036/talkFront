import {
  // ws,
  WsAPI,
} from '@wapl/core';

import {
  uploadDto,
  // SyncFileDto
} from '@/dto';

// import { OfficeAPI, docsEventUrlPath } from './API';

export class FileRepository {
  // 임시로 docs api 사용
  uploadFile = async ({ file, dto }: { file: File; dto: uploadDto }) => {
    const serviceName = 'DocsServer/UploadObjectService';
    const requestBody = {
      serviceType: 1,
      dto,
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: file.lastModified,
    };
    const buffer = await file.arrayBuffer();
    try {
      const res = await WsAPI.send(serviceName, requestBody, buffer);
      return {
        status: res?.header.statusCode,
        data: res?.body,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  uploadThumbnail = async ({
    file,
    dto,
  }: {
    file: File;
    dto: { docId: number };
  }) => {
    const serviceName = 'DocsServer/UploadObjectService';
    const requestBody = {
      serviceType: 4,
      dto,
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: file.lastModified,
    };
    const buffer = await file.arrayBuffer();
    try {
      const res = await WsAPI.send(serviceName, requestBody, buffer);
      return {
        status: res?.header.statusCode,
        data: res?.body,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  getThumbnail = async (documentId: number) => {
    const requestBody = {
      serviceType: 4,
      dto: documentId,
    };
    try {
      const serviceName = `DocsServer/DownloadObjectService`;
      const { header, body, file } = await WsAPI.send(serviceName, requestBody);
      return { header, body, arrayBuffer: file };
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  downloadFile = async (documentId: number) => {
    const requestBody = {
      serviceType: 1,
      dto: {
        documentId,
      },
    };
    try {
      const serviceName = `DocsServer/DownloadObjectService`;
      const { header, body, file } = await WsAPI.send(serviceName, requestBody);
      return { header, body, arrayBuffer: file };
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
}

export const FileRepoImpl = new FileRepository();
