import { DOCUMENT_ITEM, UploadOutputDTO } from '@tmaxoffice/docs';
import axios from 'axios';

import { CreateMessageDto } from '@/dto';
import { AttachmentItemModel } from '@/models';
import { rootStore, useStore } from '@/stores';
import { isFulfilled } from '@/utils';
import { FileBody } from '@types';

const useSendAttach = ({
  nick,
  roomName,
  msg,
  parentId,
  docsUploadCallback,
  docsUploadFunction,
}: {
  myId: number;
  nick: string;
  roomName: string;
  msg?: CreateMessageDto;
  parentId?: number;
  docsUploadCallback?: (fileId: number) => void;
  docsUploadFunction: (
    item: File,
    roomId: number,
    // token: CancelToken,
  ) => Promise<UploadOutputDTO>;
}) => {
  const { messageStore, getAttachmentStore, fileStore, uiStore, talkStore } =
    useStore();
  const { appId } = talkStore;
  const roomId = rootStore.coreStore?.roomStore.currentRoomId as number;
  const attachmentStore = getAttachmentStore(roomId);
  const attachments = attachmentStore.attachments;

  const AttachFormatter = (
    attachs: AttachmentItemModel[],
    msgType?: number,
    createURL = true,
  ): CreateMessageDto => {
    const files = attachs.map((item) => {
      const sendFileBody = new FileBody({
        id: Number(item.id),
        name: item.name.normalize('NFC'),
        extension: item.extension,
        size: item.size,
        ...(createURL && { tempURL: URL.createObjectURL(item.item) }),
        isDeleted: 0,
      });

      return new FileBody(sendFileBody);
    });
    const dto: CreateMessageDto = {
      msgType: msgType ?? 2,
      msgBody: { files: files },
      targetRoomId: roomId,
      nick: nick,
      roomName: roomName,
      appId: appId,
      parentId: parentId,
    };
    return dto;
  };

  // 오피스 업로드는 업로드 순서등 상관 x
  const officeUpload = async (file: AttachmentItemModel, tempId: string) => {
    const source = axios.CancelToken.source();
    fileStore.uploadTempInfo[tempId] = { source: source };

    const res = await docsUploadFunction(
      file.item,
      roomId,
      // source.token,
    );

    if (res.documentItem) delete fileStore.uploadTempInfo[tempId];

    if (
      res?.documentItem?.documentId &&
      typeof docsUploadCallback === 'function'
    )
      docsUploadCallback(res.documentItem.documentId);

    return res.documentItem;
  };

  const createFileMessage = async (
    dto: CreateMessageDto,
    data: DOCUMENT_ITEM,
    tempId: string,
  ) => {
    if (dto.msgBody.files?.length && typeof data.documentId === 'number') {
      dto.msgBody.files[0].id = Number(data.documentId);
      dto.msgBody.files[0].name = encodeURIComponent(
        data.documentName.normalize('NFC'),
      );
    }
    messageStore.deleteTempMessage({ messageId: tempId });
    return await messageStore.createMessage(dto);
  };

  const chunkArray = <T,>(arr: T[], chunkSize: number): T[][] => {
    const result = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      result.push(arr.slice(i, i + chunkSize));
    }
    return result;
  };

  const sendImages = async (images: AttachmentItemModel[]) => {
    const imagesMessageDto = AttachFormatter(images, 4);
    const { tempId } = messageStore.createTempMessage(imagesMessageDto);
    const uploadRes = images.map(async (item: AttachmentItemModel) => {
      const res: UploadOutputDTO = await docsUploadFunction(item.item, roomId);
      return { ...res, prevId: item.id };
    });
    const fulfilledList = (await Promise.allSettled(uploadRes)).filter(
      isFulfilled,
    );
    const successList = fulfilledList.filter(
      (item) =>
        item.value.status === 0 &&
        typeof item.value.documentItem?.documentId === 'number',
    );
    const successPrevIds = successList.map((item) => item.value.prevId);

    const successImages = images.filter((image) =>
      successPrevIds.includes(image.id),
    );
    const failedImages = images.filter(
      (image) => !successPrevIds.includes(image.id),
    );

    if (failedImages.length > 0) {
      uiStore.setUploadFailedFileNames([
        ...uiStore.uploadFailedFileNames,
        ...failedImages.map((item) => item.fullName),
      ]);
    }

    const mappedImages = successImages.map((image: AttachmentItemModel) => {
      const found = successList.find((item) => item.value.prevId === image.id);
      if (!found?.value.documentItem) return image;
      return {
        ...image,
        id: String(found.value.documentItem?.documentId),
        name: encodeURIComponent(
          found.value.documentItem?.documentName.normalize('NFC'),
        ),
      };
    });
    const successImagesMessageDto = AttachFormatter(
      mappedImages as AttachmentItemModel[],
      4,
      false,
    );
    messageStore.deleteTempMessage({ messageId: tempId });
    return await messageStore.createMessage(successImagesMessageDto);
  };

  // 이미지 동영상 파일 여러개 보냈을때 전송 실패 모달 시나리오 고려해야함
  const sendAttach = async () => {
    let toDelete = '';
    let result;
    const images = attachments.filter((item) => item.type === 'image');
    const videos = attachments.filter((item) => item.type === 'video');
    const files = attachments.filter((item) => item.type === 'file');

    if (images.length) {
      result = await sendImages(images);
    }

    if (videos.length) {
      for (const item of videos) {
        const video = AttachFormatter([item], 2048);
        const { tempId } = messageStore.createTempMessage(video);
        try {
          const documentItem = await officeUpload(item, tempId);
          if (documentItem) {
            result = await createFileMessage(video, documentItem, tempId);
          } else {
            messageStore.uploadMessageInfo[tempId].status = 'fail';
            messageStore.uploadMessageInfo[tempId].retryAttach = item;
            uiStore.setUploadFailedFileNames([
              ...uiStore.uploadFailedFileNames,
              item.fullName,
            ]);
          }
        } catch {
          // 유저가 업로드 취소하는 경우 uploadAPI cancelToken --> catch
          messageStore.uploadMessageInfo[tempId].status = 'fail';
          messageStore.uploadMessageInfo[tempId].retryAttach = item;
        }
      }
    }

    if (files.length) {
      for (const item of files) {
        const file = AttachFormatter([item], 2);
        const { tempId } = messageStore.createTempMessage(file);
        try {
          const documentItem = await officeUpload(item, tempId);
          if (documentItem) {
            result = await createFileMessage(file, documentItem, tempId);
          } else {
            messageStore.uploadMessageInfo[tempId].status = 'fail';
            messageStore.uploadMessageInfo[tempId].retryAttach = item;
            uiStore.setUploadFailedFileNames([
              ...uiStore.uploadFailedFileNames,
              item.fullName,
            ]);
          }
        } catch {
          // 유저가 업로드 취소하는 경우 uploadAPI cancelToken --> catch
          messageStore.uploadMessageInfo[tempId].status = 'fail';
          messageStore.uploadMessageInfo[tempId].retryAttach = item;
        }
      }
    }

    if (msg?.msgType) {
      const { tempId } = messageStore.createTempMessage(msg);
      toDelete = tempId;
    }

    return { toDelete: toDelete, attachResult: result };
  };

  const clearAttach = () => {
    attachmentStore.removeAttachmentsAll();
  };

  const uploadRetry = async (
    item: AttachmentItemModel,
    tempId: string,
    msgType?: number,
  ) => {
    const file = AttachFormatter([item], msgType);
    messageStore.uploadMessageInfo[tempId].status = 'loading';
    try {
      const documentItem = await officeUpload(item, tempId);
      if (documentItem) {
        await createFileMessage(file, documentItem, tempId);
      } else {
        messageStore.uploadMessageInfo[tempId].status = 'fail';
      }
    } catch {
      // 유저가 업로드 취소하는 경우 uploadAPI cancelToken --> catch
      messageStore.uploadMessageInfo[tempId].status = 'fail';
      messageStore.uploadMessageInfo[tempId].retryAttach = item;
    }
  };

  return {
    clearAttach,
    sendAttach,
    uploadRetry,
  };
};

export default useSendAttach;
