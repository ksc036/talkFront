import { useShell } from '@shell/sdk';
import { useCoreStore } from '@wapl/core';

import { useStore } from '@/stores';
import { dataUrlToFile } from '@/utils/dataUrlToFile';

import { checkValid } from './useAttachInput';

const useSuperOS = () => {
  const shell = useShell();

  const { roomStore } = useCoreStore();
  const { messageStore, talkStore } = useStore();

  const { getAttachmentStore } = useStore();
  const attachmentStore = getAttachmentStore(roomStore.currentRoomId as number);
  const { appId } = talkStore;

  // 앨범 API 호출
  const startAlbumView = async () => {
    try {
      const { _type, albumViewOptions, files, errorMessage } =
        await shell.mobile.camera.startAlbumView({
          appId: appId,
          isMultiple: true,
          mimeTypes: ['video/*', 'image/*'],
        });

      // 앨범 API 응답 처리
      if (_type === 'startAlbumView' && albumViewOptions?.appId === appId) {
        if (errorMessage?.includes('ERROR: Selected Media size too big')) {
          const fileLimit = errorMessage.match(/\d+/)?.[0];
          attachmentStore.setFailModalVisible(true);
          attachmentStore.setRejectString(
            `파일 용량이 ${fileLimit}MB를 초과하는 경우, 업로드할 수 없습니다.`,
          );

          return;
        } else if (files) {
          const { valid, reason } = checkValid(
            files,
            attachmentStore.attachments,
          );

          if (valid) {
            messageStore.clearSticker();
            attachmentStore.addAttachments(files);
          } else {
            attachmentStore.setFailModalVisible(true);
            attachmentStore.setRejectString(reason);
            return;
          }
        }
      }
    } catch (error) {
      console.error(error);
      attachmentStore.setFailModalVisible(true);
      attachmentStore.setRejectString(
        '알 수 없는 오류로 파일이 전송되지 않았습니다.',
      );
    }
  };

  // 카메라 API 호출
  const startCamera = () => {
    shell.mobile.camera.startPreview();
  };

  // 카메라 API 응답 처리
  const handleMobileCameraUpload = () => {
    shell.mobile.camera.setOnCapture(
      (data: { buffer_string: string; mime_type: string }[]) => {
        try {
          const { buffer_string, mime_type } = data?.[0];

          const { getAttachmentStore } = useStore();
          const attachmentStore = getAttachmentStore(
            roomStore.currentRoomId as number,
          );

          const cameraImage = [dataUrlToFile(buffer_string, mime_type)];

          const { valid, reason } = checkValid(
            cameraImage,
            attachmentStore.attachments,
          );

          if (valid) {
            messageStore.clearSticker();
            attachmentStore.addAttachments(cameraImage);
          } else {
            attachmentStore.setFailModalVisible(true);
            attachmentStore.setRejectString(reason);
            return;
          }
        } catch (error) {
          console.error(error);
          attachmentStore.setFailModalVisible(true);
          attachmentStore.setRejectString(
            '알 수 없는 오류로 파일이 전송되지 않았습니다.',
          );
        }
      },
      (data: any) => {
        console.error(data);
        attachmentStore.setFailModalVisible(true);
        attachmentStore.setRejectString(
          '알 수 없는 오류로 파일이 전송되지 않았습니다.',
        );
      },
    );
  };

  return {
    startAlbumView,
    startCamera,
    handleMobileCameraUpload,
  };
};

export default useSuperOS;
