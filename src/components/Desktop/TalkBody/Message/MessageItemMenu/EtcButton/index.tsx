import React, { useCallback, useEffect } from 'react';
import { useState } from 'react';

import { useDocsStore } from '@tmaxoffice/docs';
import { useCoreStore, RoomModel } from '@wapl/core';
import { Icon, useTheme, Tooltip } from '@wapl/ui';
import JSZip from 'jszip';
import { observer } from 'mobx-react-lite';

import { FileBody } from '@/@types';
import { ChatBan } from '@/assets/icons/ChatBan';
import { ConfirmDialog } from '@/components/Common/Dialog/ConfirmDialog';
import UnreadCountUser from '@/components/Desktop/Dialogs/UnreadCountUser';
import useDownloadFile from '@/hooks/useDownloadFile';
import { MessageModel } from '@/models';
import { useStore } from '@/stores';
import {
  copyToClipboard,
  parseContent,
  getAuthority,
  isFulfilled,
  getFormattedSize,
  unescapeHtml,
} from '@/utils';
import * as T from '@types';

import * as S from './styled';

interface EtcButtonProps {
  message: MessageModel;
  openEmojiMenu: () => void;
  anchorEl: null | HTMLDivElement;
  openUnreadMenu: () => void;
  closeUnreadMenu: () => void;
  openToast: (message: string) => void;
  menuType: string;
  menuActivate: Record<T.MessageMenu, boolean>;
  isMine: boolean;
}

type DialogType = 'fileAuthority' | 'deleteError';

const EtcDotButton = observer((props: EtcButtonProps) => {
  const {
    message,
    openEmojiMenu,
    anchorEl,
    openUnreadMenu,
    closeUnreadMenu,
    openToast,
    menuType,
    menuActivate,
    isMine,
  } = props;
  const theme = useTheme();
  const { roomStore, userStore } = useCoreStore();
  const { uiStore, messageStore, noticeStore, configStore } = useStore();
  const docsStore = useDocsStore();
  const driveStore = docsStore.getDriveStore();
  const { downloadFile } = useDownloadFile();

  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);
  const [anchorMenu, setAnchorMenu] = useState<null | HTMLElement>(null);

  const [dialogType, setDialogType] = useState<DialogType>('fileAuthority');
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);
  const [openReportedAlertDialog, setOpenReportedAlertDialog] =
    useState<boolean>(false);
  const [openSetNoticeDialog, setOpenSetNoticeDialog] =
    useState<boolean>(false);

  const openMenu = Boolean(anchorMenu);

  const authority = getAuthority(
    message,
    roomStore.getRoomById(roomStore.currentRoomId as number) as RoomModel,
    userStore.selectedPersona,
  );

  const {
    copy,
    save,
    deliver,
    notice,
    unreadUser,
    delete: deleteMessage,
    blind,
    report,
  } = menuActivate;

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorMenu(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorMenu(null);
    messageStore.setHoveredMessageId(-1);
  };

  const dialogTitle = () => {
    switch (dialogType) {
      case 'fileAuthority':
        return '권한 확인';
      case 'deleteError':
        return '메시지를 삭제할 수 있는 시간이 지났습니다.';
      default:
        return '';
    }
  };
  const dialogContent = () => {
    switch (dialogType) {
      case 'fileAuthority':
        return '소유자 권한을 가진 문서에 대해서만 전달이 가능합니다.';
      case 'deleteError':
        return '';
      default:
        return '';
    }
  };
  const handleOpenConfirmDialog = (type: DialogType) => {
    setDialogType(type);
    setOpenConfirmDialog(true);
  };
  const handleOnClickOk = useCallback(() => {
    switch (dialogType) {
      case 'fileAuthority':
      case 'deleteError':
        setOpenConfirmDialog(false);
        handleCloseMenu();
        break;
      default:
        break;
    }
  }, []);
  const handleClickRepoertedAlertOk = () => {
    setOpenReportedAlertDialog(false);
    handleCloseMenu();
  };
  const handleCloseSetNoticeDialog = () => {
    setOpenSetNoticeDialog(false);
    handleCloseMenu();
  };

  // 복사
  const handleClickCopy = async () => {
    if (message.msgBody.content) {
      const plainMessage = message.msgType.includes('editor')
        ? message.rawContent
        : parseContent(message.msgBody.content);
      try {
        await copyToClipboard(unescapeHtml(plainMessage));
        openToast('복사되었습니다.');
        handleCloseMenu();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleClickSetNotice = async () => {
    const room = roomStore.getRoomById(
      roomStore.currentRoomId as number,
    ) as RoomModel;
    const nick = userStore.selectedPersona?.nick ?? '';
    if (message.msgType.includes('editor')) {
      await noticeStore.createNotice({
        noticeBody: {
          ...message.msgBody,
          content: message.rawContent,
        },
        roomId: room.id,
        isActive: true,
        roomName: room.name,
        nick,
      });
    } else
      await noticeStore.createNotice({
        noticeBody: message.msgBody,
        roomId: room.id,
        isActive: true,
        roomName: room.name,
        nick,
      });
    handleCloseMenu();
  };

  const handleClickUnreadUser = () => {
    openUnreadMenu();
    setAnchorMenu(null);
  };

  const handleClickDelete = async () => {
    const myId = userStore.selectedPersona?.id.toString() ?? '';
    const res = await messageStore.deleteMessage({
      messageIds: [message.msgId],
      isMyRoom: authority.isMyRoom,
      personaId: myId,
    });
    if (!res) {
      handleOpenConfirmDialog('deleteError');
    }

    if (
      message.msgType.includes('file') ||
      message.msgType.includes('image') ||
      message.msgType.includes('video')
    ) {
      message?.msgBody?.files?.forEach((file) =>
        driveStore.forceDeleteDocument(Number(file.id)),
      );
    }
  };

  const handleClickBlind = async () => {
    // const deletedFrom = authority.isAdmin ? 3 : 2;
    handleCloseMenu();
  };
  // 신고
  const handleClickReport = () => {
    setIsReportOpen(true);
  };
  // const handleReportClose = () => {
  //   setIsReportOpen(false);
  //   handleCloseMenu();
  // };

  // TODO: 신고하기 기능 주석 처리
  // const handleReportCreate = async () =>
  // type: ReportDTO.ReportType,
  // text: string,
  // {
  // const reportDTO = {
  //   toPersonaId: message.personaId,
  //   contentId: message.msgId,
  //   contentType: '',
  //   reportType: type,
  //   reportText: text,
  //   contentText: '',
  //   roomId: roomStore.currentRoomId,
  //   etc: '',
  // };
  // if (message.msgBody.content) {
  //   reportDTO.contentType = 'CHAT';
  //   reportDTO.contentText = parseContent(message.msgBody.content);
  // } else if (message.msgBody.files) {
  //   const reportFiledata = {
  //     id: message.msgBody.files[0].id,
  //     name: message.msgBody.files[0].name,
  //     extension: message.msgBody.files[0].extension,
  //     size: message.msgBody.files[0].size,
  //   };
  //   reportDTO.contentType = 'FILE';
  //   reportDTO.etc = JSON.stringify(reportFiledata);
  // }
  // const res = await reportStore.createReport(reportDTO as ReportDTO.Report);
  // if (res?.success) {
  //   handleCloseMenu();
  // } else {
  //   //이미 존재하는 신고인 경우
  //   setOpenReportedAlertDialog(true);
  // }
  // };

  const handleClickDeliver = async () => {
    // Todo: 파일 메시지 권한 임시 제거, 필요 시 추가
    // if (message.msgType.includes('file') && message.msgBody.files) {
    //   const myId = userStore.selectedPersona?.id.toString() ?? '';
    //   const promiseFileAuth = message.msgBody.files?.map(async (file) => {
    //     return fileStore.authCheckFile({
    //       documentId: file.id as number,
    //       userId: myId,
    //     });
    //   });
    //   const authCheckResult = await Promise.all(promiseFileAuth);
    //   let deliverPossibility = true;
    //   authCheckResult.map((result) => {
    //     if (!result) deliverPossibility = false;
    //   });
    //   if (!deliverPossibility) {
    //     handleOpenConfirmDialog('fileAuthority');
    //     return;
    //   }
    // }
    uiStore.openDialog('deliver');
    messageStore.setHoveredMessage(message);
    handleCloseMenu();
  };

  const handleClickSave = async () => {
    handleCloseMenu();

    if (message.msgBody?.files?.length) {
      if (message.msgBody?.files?.length === 1) {
        const documentId = Number(message.msgBody?.files?.[0]?.id);

        if (!isNaN(documentId)) {
          const documentInfo = await driveStore.requestDocumentInfo(documentId);

          if (documentInfo?.deleted === 0) {
            const media = await driveStore.requestDownload(documentId);

            if (media) {
              downloadFile({
                fileBlob: media,
                fileName: message.msgBody.files[0].name,
                fileExtension: message.msgBody.files[0].extension,
              });
            }
          } else {
            uiStore.openDialog('invalidFile');
          }
        }
      } else if (message.msgBody?.files?.length > 1) {
        uiStore.openDialog('zipDownloading');

        let downloadedFileSize = 0;
        const totalFileSize = message.msgBody.files.reduce((acc, cur) => {
          return acc + cur.size;
        }, 0);

        uiStore.setZipDownloadSize(
          `${getFormattedSize(0)} / ${getFormattedSize(totalFileSize)}`,
        );

        const downloadImages = message.msgBody.files.map(
          async (item: FileBody) => {
            const documentInfo = await driveStore.requestDocumentInfo(
              Number(item.id),
            );

            if (documentInfo?.deleted === 0) {
              const res = (await driveStore.requestDownload(
                Number(item.id),
              )) as File;

              if (res) {
                downloadedFileSize += item.size;
                uiStore.setZipDownloadSize(
                  `${getFormattedSize(downloadedFileSize)} / ${getFormattedSize(
                    totalFileSize,
                  )}`,
                );

                return res;
              } else {
                return null;
              }
            } else {
              return null;
            }
          },
        );

        const downloadResults = await Promise.allSettled(downloadImages);
        const fulfilledImages = downloadResults
          .filter(isFulfilled)
          .map((item) => item.value);

        const zip = new JSZip();
        fulfilledImages.forEach((fulfilledImage: File | null) => {
          if (fulfilledImage) {
            const extension = fulfilledImage.type.split('/')[1];
            zip.file(`${fulfilledImage.name}.${extension}`, fulfilledImage);
          }
        });

        const zippedImages = await zip.generateAsync({ type: 'blob' });

        if (zippedImages && uiStore.openZipDownloading) {
          const todayDate = new Date();
          const zippedFileName = `${todayDate.getFullYear()}${String(
            todayDate.getMonth() + 1,
          ).padStart(2, '0')}${String(todayDate.getDate()).padStart(2, '0')}`;

          downloadFile({
            fileBlob: zippedImages,
            fileName: `${zippedFileName}`,
            fileExtension: 'zip',
            toastString: `${fulfilledImages.length}개의 파일이 내 PC에 저장되었습니다.`,
          });

          uiStore.closeDialog('zipDownloading');
        }
      }
    }
  };

  return (
    <>
      {configStore.MsgMenuType !== '' ? (
        <>
          {/* 슈퍼앱이 아닐 경우 */}
          {copy && (
            <Tooltip
              title="복사"
              sx={{
                '.MuiTooltip-tooltip': {
                  color: theme.Color.Background[0],
                  backgroundColor: theme.Color.Gray[900],
                },
              }}
            >
              <S.EtcButton onClick={handleClickCopy}>
                <Icon.CopyLine
                  width={20}
                  height={20}
                  color={configStore.MessageMenuStyle.IconColor}
                />
              </S.EtcButton>
            </Tooltip>
          )}
          {/* {message.msgType.includes('media') ||
            (message.msgType.includes('file') && (
              <S.EtcButton>
                <Icon.DownloadLine
                  width={20}
                  height={20}
                  color={theme.Color.Gray[600]}
                />
              </S.EtcButton>
            ))} */}
          {deliver && (
            <Tooltip
              title="전달"
              sx={{
                '.MuiTooltip-tooltip': {
                  color: theme.Color.Background[0],
                  backgroundColor: theme.Color.Gray[900],
                },
              }}
            >
              <S.EtcButton onClick={handleClickDeliver}>
                <Icon.DeliverLine
                  width={20}
                  height={20}
                  color={theme.Color.Gray[600]}
                />
              </S.EtcButton>
            </Tooltip>
          )}
          {notice && (
            <Tooltip
              title="공지"
              sx={{
                '.MuiTooltip-tooltip': {
                  color: theme.Color.Background[0],
                  backgroundColor: theme.Color.Gray[900],
                },
              }}
            >
              <S.EtcButton onClick={handleClickSetNotice}>
                <Icon.NoticeLine
                  width={20}
                  height={20}
                  color={theme.Color.Gray[600]}
                />
              </S.EtcButton>
            </Tooltip>
          )}
          {unreadUser && (
            <Tooltip
              title="안 읽은 인원"
              sx={{
                '.MuiTooltip-tooltip': {
                  color: theme.Color.Background[0],
                  backgroundColor: theme.Color.Gray[900],
                },
              }}
            >
              <S.EtcButton onClick={handleClickUnreadUser}>
                <Icon.UserLine
                  width={20}
                  height={20}
                  color={theme.Color.Gray[600]}
                />
              </S.EtcButton>
            </Tooltip>
          )}
          {deleteMessage && (
            <Tooltip
              title="삭제"
              sx={{
                '.MuiTooltip-tooltip': {
                  color: theme.Color.Background[0],
                  backgroundColor: theme.Color.Gray[900],
                },
              }}
            >
              <S.EtcButton onClick={handleClickDelete}>
                <Icon.DeleteLine
                  width={20}
                  height={20}
                  color={theme.Color.Gray[600]}
                />
              </S.EtcButton>
            </Tooltip>
          )}
          {/* <S.EtcButton>
            <Icon.MailLine
              width={16}
              height={16}
              color={theme.Color.Gray[900]}
            />
          </S.EtcButton> */}
        </>
      ) : (
        <>
          {/* 슈퍼앱일 경우 */}
          <S.EtcButton onClick={handleOpenMenu}>
            <Icon.MoreLine
              width={20}
              height={20}
              color={theme.Color.Gray[600]}
            />
          </S.EtcButton>
          <S.Menu
            anchorEl={anchorMenu}
            open={openMenu}
            onClose={handleCloseMenu}
            anchorOrigin={
              isMine
                ? {
                    vertical: 36,
                    horizontal: 'right',
                  }
                : {
                    vertical: 36,
                    horizontal: 'left',
                  }
            }
            transformOrigin={
              isMine
                ? {
                    vertical: 'top',
                    horizontal: 'right',
                  }
                : {
                    vertical: 'top',
                    horizontal: 'left',
                  }
            }
          >
            {copy && (
              <S.MenuItem onClick={handleClickCopy}>
                <Icon.CopyLine
                  width={16}
                  height={16}
                  color={theme.Color.Gray[900]}
                />
                <S.MenuItemText>{'복사'}</S.MenuItemText>
              </S.MenuItem>
            )}
            {save && (
              <S.MenuItem onClick={handleClickSave}>
                <Icon.DownloadLine
                  width={16}
                  height={16}
                  color={theme.Color.Gray[900]}
                />
                <S.MenuItemText>{'저장'}</S.MenuItemText>
              </S.MenuItem>
            )}
            {deliver && (
              <S.MenuItem onClick={handleClickDeliver}>
                <Icon.DeliverLine
                  width={16}
                  height={16}
                  color={theme.Color.Gray[900]}
                />
                <S.MenuItemText>{'전달'}</S.MenuItemText>
              </S.MenuItem>
            )}
            {notice && (
              <S.MenuItem onClick={() => setOpenSetNoticeDialog(true)}>
                <Icon.NoticeLine
                  width={16}
                  height={16}
                  color={theme.Color.Gray[900]}
                />
                <S.MenuItemText>{'공지'}</S.MenuItemText>
              </S.MenuItem>
            )}
            {unreadUser && (
              <S.MenuItem onClick={handleClickUnreadUser}>
                <Icon.UserLine
                  width={16}
                  height={16}
                  color={theme.Color.Gray[900]}
                />
                <S.MenuItemText>{'안 읽은 인원'}</S.MenuItemText>
              </S.MenuItem>
            )}
            {deleteMessage && (
              <S.MenuItem onClick={handleClickDelete}>
                <Icon.DeleteLine
                  width={16}
                  height={16}
                  color={theme.Color.Gray[900]}
                />
                <S.MenuItemText>{'삭제'}</S.MenuItemText>
              </S.MenuItem>
            )}
            {report && (
              <S.MenuItem onClick={handleClickReport}>
                <Icon.SpamLine
                  width={16}
                  height={16}
                  color={theme.Color.Gray[900]}
                />
                <S.MenuItemText>{'신고'}</S.MenuItemText>
              </S.MenuItem>
            )}
            {blind && (
              <S.MenuItem onClick={handleClickBlind}>
                <ChatBan />
                <S.MenuItemText>{'블라인드'}</S.MenuItemText>
              </S.MenuItem>
            )}
            {/* <S.MenuItem>
          <Icon.MailLine width={16} height={16} color={theme.Color.Gray[900]} />
          <S.MenuItemText>{'메일'}</S.MenuItemText>
        </S.MenuItem> */}
          </S.Menu>
        </>
      )}
      <ConfirmDialog
        open={openConfirmDialog}
        title={dialogTitle()}
        content={dialogContent()}
        onClickOk={handleOnClickOk}
      />
      <ConfirmDialog
        open={openReportedAlertDialog}
        title={'이미 신고가 접수된 콘텐츠입니다.'}
        onClickOk={handleClickRepoertedAlertOk}
      />
      <ConfirmDialog
        open={openSetNoticeDialog}
        title={'공지 등록'}
        content={`${configStore.FeatureNameType.Room} 상단 공지는 1건만 노출됩니다.`}
        onClickOk={handleClickSetNotice}
        onClickCancel={handleCloseSetNoticeDialog}
      />
      <UnreadCountUser
        anchorEl={anchorEl}
        closeUnreadMenu={closeUnreadMenu}
        roomId={roomStore.currentRoomId as number}
        msgId={message.msgId}
        menuType={menuType}
        isMine={isMine}
      />
    </>
  );
});

export default EtcDotButton;
