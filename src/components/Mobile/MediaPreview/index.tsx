import { useState } from 'react';

import { useShell } from '@shell/sdk';
import { useDocsStore } from '@tmaxoffice/docs';
import { useCoreStore } from '@wapl/core';
import { MobileMemberSelectorDialog } from '@wapl/core';
import { Icon } from '@wapl/ui';
import { observer } from 'mobx-react';

import { AppIds, RunToppingMessageType, AppType, FileBody } from '@/@types';
import useDownloadFile from '@/hooks/useDownloadFile';
import { useStore } from '@/stores';
import {
  getAttachmentItemInfo,
  timeStampFormat,
  getFormattedSize,
  getDmRoomTypeId,
} from '@/utils';

import ConfirmDialog from '../Dialogs/ConfirmDialog';

import ImageViewer from './ImageViewer';
import * as S from './Styled';
import VideoPlayer from './VideoPlayer';

const MediaPreview = observer(() => {
  const { messageStore, uiStore, fileStore, talkStore, configStore } =
    useStore();
  const { userStore, roomStore, personaStore } = useCoreStore();
  const docsStore = useDocsStore();
  const driveStore = docsStore.getDriveStore();

  const { downloadFile } = useDownloadFile();
  const shell = useShell();

  const { appId } = talkStore;

  const { type } = getAttachmentItemInfo(
    fileStore.mediaPreviewMeta?.extension as string,
  );

  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [showMediaInfo, setShowMediaInfo] = useState<boolean>(false);

  const [mediaWidth, setMediaWidth] = useState<number>(0);
  const [mediaHeight, setMediaHeight] = useState<number>(0);

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();

    uiStore.setOpenMediaPreview(false);
    fileStore.setMediaPreviewMeta(null);
    URL.revokeObjectURL(fileStore.mediaPreviewData?.source || '');
  };

  const handleOpenDrawer = async () => {
    await shell.runApp({
      appId: String(AppIds.DOCS),
      args: {
        runToppingType: RunToppingMessageType.NAVIGATE_TARGET_ROOM,
        docsAppType: AppType.TALKDRIVE,
        roomId: roomStore.currentRoomId,
      },
    });
  };

  const handleDownloadButtonClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (fileStore.mediaPreviewData && fileStore.mediaPreviewMeta) {
      downloadFile({
        fileBlob: fileStore.mediaPreviewData?.file,
        fileName: fileStore.mediaPreviewMeta?.title,
        fileExtension: fileStore.mediaPreviewMeta?.extension,
      });
    }
  };

  const handleDeliverFile = async ({
    selectedPersonaList,
    selectedRoomList,
  }: {
    selectedPersonaList: number[];
    selectedRoomList: number[];
  }) => {
    const nick =
      personaStore.getPersona(userStore.selectedPersona?.id as number)?.nick ??
      '';
    const roomName =
      roomStore.getRoomById(roomStore.currentRoomId as number)?.name ?? '';

    const createRoomResults = selectedPersonaList.map(
      async (personaId: number) => {
        if (personaId === userStore.selectedPersona?.id) {
          return Promise.resolve({
            result: 'created',
            room: roomStore.myRoom,
          });
        } else {
          return roomStore.createRoom({
            appId: appId,
            roomTypeId: getDmRoomTypeId(),
            selectedPersonaIdList: [personaId],
          });
        }
      },
    );

    const roomIdList = selectedRoomList;

    const tempRoomIdList = await Promise.all(createRoomResults);
    tempRoomIdList.forEach((res) => {
      if (res.result === 'created' && res.room?.id) {
        roomIdList.push(res.room.id);
      }
    });

    for (const roomId of roomIdList) {
      const docsRes = await driveStore.requestCopy(roomId, [
        fileStore.mediaPreviewMeta?.documentId as number,
      ]);

      if (docsRes[0]) {
        const deliverFileBody = new FileBody({
          id: docsRes[0].documentId,
          name: docsRes[0].documentName,
          extension: docsRes[0].documentExtension,
          size: docsRes[0].documentSize,
          isDeleted: 0,
        });

        const { type } = getAttachmentItemInfo(docsRes[0].documentExtension);
        const msgType = type === 'image' ? 4 : type === 'video' ? 2048 : 4;

        const msgDto = {
          appId: appId,
          msgType: msgType,
          msgBody: {
            files: [deliverFileBody],
          },
          targetRoomId: roomId,
          nick: nick,
          roomName: roomName,
        };

        const messageRes = await messageStore.deliverMessage(roomId, msgDto);

        if (messageRes) {
          uiStore.openToast('파일이 공유되었습니다.');
        }
      }
    }
  };

  const handleDeleteFile = async () => {
    setShowDeleteDialog(false);

    const res = await driveStore.forceDeleteDocument(
      fileStore.mediaPreviewMeta?.documentId as number,
    );

    if (res) {
      uiStore.openToast('파일이 삭제되었습니다.');

      uiStore.setOpenMediaPreview(false);
      fileStore.setMediaPreviewMeta(null);
      fileStore.setMediaPreviewData(null);
    }
  };

  const handleDeliverButtonClick = () => {
    uiStore.setOpenMediaShare(true);
  };

  const handleDeleteButtonClick = () => {
    setShowDeleteDialog(true);
  };

  const handleMoreButtonClick = () => {
    setShowMediaInfo(!showMediaInfo);
  };

  const handleDeliverDialogClose = () => {
    uiStore.setOpenMediaShare(false);
  };

  const handleDeleteDialogClose = () => {
    setShowDeleteDialog(false);
  };

  const handleMediaInfoClose = () => {
    setShowMediaInfo(false);
  };

  return (
    <S.Overlay>
      <S.MediaHeader>
        <S.MediaHeaderButton onClick={handleClose}>
          <Icon.ArrowBackLine width={24} height={24} color="white" />
        </S.MediaHeaderButton>

        <S.MediaHeaderInfoWrapper>
          <S.UploaderName>
            {fileStore.mediaPreviewMeta?.uploader}
          </S.UploaderName>
          <S.UploadedDate>
            {timeStampFormat(
              fileStore.mediaPreviewMeta?.date ?? '',
              'YYYY.MM.DD a hh:mm',
            )}
          </S.UploadedDate>
        </S.MediaHeaderInfoWrapper>

        <S.MediaHeaderButton onClick={handleOpenDrawer}>
          <Icon.CalendarDayLine width={24} height={24} color="white" />
        </S.MediaHeaderButton>
      </S.MediaHeader>

      <S.MediaContent>
        {uiStore.mediaPreviewLoading ? (
          <Icon.Loading2Motion width={60} height={60} />
        ) : (
          <>
            {
              {
                image: (
                  <ImageViewer
                    setMediaWidth={setMediaWidth}
                    setMediaHeight={setMediaHeight}
                  />
                ),
                video: (
                  <VideoPlayer
                    setMediaWidth={setMediaWidth}
                    setMediaHeight={setMediaHeight}
                  />
                ),
                file: <></>,
              }[type]
            }
          </>
        )}
      </S.MediaContent>

      <S.MediaFooter>
        <S.MediaFooterButton
          onClick={handleDownloadButtonClick}
          disabled={uiStore.mediaPreviewLoading}
        >
          <Icon.DownloadLine width={24} height={24} color="white" />
        </S.MediaFooterButton>

        <S.MediaFooterButton
          onClick={handleDeliverButtonClick}
          disabled={uiStore.mediaPreviewLoading}
        >
          <Icon.MailReplyLine width={24} height={24} color="white" />
        </S.MediaFooterButton>

        <S.MediaFooterButton
          onClick={handleDeleteButtonClick}
          disabled={uiStore.mediaPreviewLoading}
        >
          <Icon.DeleteLine width={24} height={24} color="white" />
        </S.MediaFooterButton>

        <S.MediaFooterButton
          onClick={handleMoreButtonClick}
          disabled={uiStore.mediaPreviewLoading}
        >
          <Icon.MoreLine width={24} height={24} color="white" />
        </S.MediaFooterButton>
      </S.MediaFooter>

      {showMediaInfo && (
        <S.MediaInfoWrapper onClick={handleMediaInfoClose}>
          <S.MediaInfoElementsWrapper>
            <S.MediaInfoLabel>종류</S.MediaInfoLabel>
            <S.MediaInfoValue>
              {fileStore.mediaPreviewMeta?.extension.toUpperCase()}
            </S.MediaInfoValue>
          </S.MediaInfoElementsWrapper>

          <S.MediaInfoElementsWrapper>
            <S.MediaInfoLabel>크기</S.MediaInfoLabel>
            <S.MediaInfoValue>
              {getFormattedSize(fileStore.mediaPreviewMeta?.size ?? 0)}
            </S.MediaInfoValue>
          </S.MediaInfoElementsWrapper>

          <S.MediaInfoElementsWrapper>
            <S.MediaInfoLabel>해상도</S.MediaInfoLabel>
            <S.MediaInfoValue>
              {mediaWidth} x {mediaHeight}
            </S.MediaInfoValue>
          </S.MediaInfoElementsWrapper>
        </S.MediaInfoWrapper>
      )}

      <ConfirmDialog
        open={showDeleteDialog}
        title={'이미지 / 동영상 삭제'}
        content={
          '선택한 사진 또는 동영상을 삭제하시겠습니까?\n삭제한 사진은 복구할 수 없습니다.'
        }
        onClickCancel={handleDeleteDialogClose}
        onClickOk={handleDeleteFile}
        cancelText={'취소'}
        okText={'삭제'}
      />

      <MobileMemberSelectorDialog
        appId={appId}
        title={'파일 공유'}
        isOpen={uiStore.openMediaShare}
        submitButtonOption={{ text: '공유', onClick: handleDeliverFile }}
        onClose={handleDeliverDialogClose}
        detailSearchItemKeys={configStore.MemberSelectorSearchKeys}
      />
    </S.Overlay>
  );
});

export default MediaPreview;
