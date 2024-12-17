import { useCallback, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useShell } from '@shell/sdk';
import { useDocsStore } from '@tmaxoffice/docs';
import { RoomModel, useCoreStore } from '@wapl/core';
import { Icon, useTheme } from '@wapl/ui';
import JSZip from 'jszip';
import { observer } from 'mobx-react';

import { FileBody } from '@/@types';
import { ChatBan } from '@/assets/icons/ChatBan';
import { ConfirmDialog } from '@/components/Common/Dialog/ConfirmDialog';
import useDownloadFile from '@/hooks/useDownloadFile';
import { useStore } from '@/stores';
import {
  parseContent,
  getAuthority,
  unescapeHtml,
  getFormattedSize,
  isFulfilled,
} from '@/utils';

import ReactionMenu from './ReactionMenu';
import * as S from './styled';

const MessageContextMenu = observer(() => {
  const {
    uiStore,
    reactionStore,
    messageStore,
    noticeStore,
    configStore,
    fileStore,
  } = useStore();
  const { roomStore, userStore } = useCoreStore();
  const { Color } = useTheme();
  const navigate = useNavigate();
  const { hash } = useLocation();
  const docsStore = useDocsStore();
  const driveStore = docsStore.getDriveStore();
  const shell = useShell();
  const { downloadFile } = useDownloadFile();

  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);
  const [openReportedAlertDialog, setOpenReportedAlertDialog] =
    useState<boolean>(false);
  const [openSetNoticeDialog, setOpenSetNoticeDialog] =
    useState<boolean>(false);

  const ref = useRef<HTMLDivElement>(null);
  const message = messageStore.hoveredMessage;

  const authority = getAuthority(
    message,
    roomStore.getRoomById(roomStore.currentRoomId as number) as RoomModel,
    userStore.selectedPersona,
  );

  const messageId = messageStore.hoveredMessageId;

  // 복사
  const copyActivate =
    (message?.msgType.includes('text') ||
      message?.msgType.includes('editor')) &&
    !message?.msgType.includes('meeting') &&
    configStore.MessageMenu.includes('copy');

  // 저장
  const saveActivate =
    message?.msgType.includes('file') ||
    message?.msgType.includes('image') ||
    message?.msgType.includes('video');

  // 전달
  const deliverActivate =
    !message?.msgType.includes('vote') &&
    !message?.msgType.includes('notice') &&
    !message?.msgType.includes('meeting') &&
    !message?.msgType.includes('calendar') &&
    configStore.MessageMenu.includes('deliver');

  // 공지
  const setNoticeActivate =
    (messageStore.hoveredMessage?.msgType.includes('text') ||
      messageStore.hoveredMessage?.msgType.includes('editor')) &&
    !messageStore.hoveredMessage?.msgType.includes('meeting') &&
    configStore.MessageMenu.includes('notice');

  // 안 읽은 인원
  const unreadUserActivate =
    !authority.isMyRoom &&
    message?.unReadCount !== 0 &&
    configStore.MessageMenu.includes('unreadUser');

  // 삭제
  const deleteActivate =
    authority.isMine && configStore.MessageMenu.includes('delete');

  // 블라인드
  const blindActivate =
    configStore.MessageMenu.includes('blind') &&
    (authority.isRoomLeader || authority.isAdmin); // 룸의 어드민(방장)이거나 어드민일 경우

  // 신고
  const reportActivate =
    !authority.isMine &&
    (message?.msgType.includes('text') ||
      message?.msgType.includes('file') ||
      message?.msgType.includes('url')) &&
    !message?.msgType.includes('meeting') &&
    !message?.msgType.includes('vote') &&
    !message?.msgType.includes('notice') &&
    configStore.MessageMenu.includes('report');

  const handleCloseMenu = useCallback(() => {
    navigate(-1);
  }, []);

  const handleCloseConfirmDialog = useCallback(() => {
    setOpenConfirmDialog(false);
  }, []);
  const handleClickReportedAlertOk = () => {
    setOpenReportedAlertDialog(false);
  };
  const handleOpenSetNoticeDialog = () => {
    setOpenSetNoticeDialog(true);
    handleCloseMenu();
  };

  const handleClickReply = () => {
    uiStore.setReplyVisible(true);
    messageStore.setReplyMessage(messageId);
    handleCloseMenu();
  };

  const handleClickNumOfReaction = () => {
    reactionStore.setTargetMessageId(messageId);
    navigate('#reaction-dialog', { replace: true });
  };

  const handleClickDelete = () => {
    navigate('#delete-mode', { replace: true });
  };

  // 복사
  const handleClickCopy = async () => {
    if (message?.msgBody.content) {
      const plainMessage = message?.msgType.includes('editor')
        ? message.rawContent
        : parseContent(message.msgBody.content);
      const res = await shell.mobile.clipboard.write({
        string: unescapeHtml(plainMessage),
      });

      if (res) {
        uiStore.openToast('복사되었습니다.');
        handleCloseMenu();
      }
    }
  };

  const handleClickDeliver = async () => {
    // Todo: 파일 메시지 권한 임시 제거, 필요 시 추가
    // if (message && message.msgType.includes('file') && message.msgBody.files) {
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
    //     handleCloseMenu();
    //     setOpenConfirmDialog(true);
    //     return;
    //   }
    // }
    navigate('#deliver-dialog', { replace: true });
  };

  const handleClickBlind = async () => {
    // const deletedFrom = authority.isAdmin ? 3 : 2;
    handleCloseMenu();
  };

  const handleClickReport = () => {
    navigate('#message-report', { replace: true });
  };
  // const handleReportClose = () => {
  //   navigate(-1);
  // };

  // TODO: 신고하기 기능 주석 처리
  // const handleReportCreate = async () =>
  // type: ReportDTO.ReportType,
  // text: string,
  //   {
  // const reportDTO = {
  //   toPersonaId: message?.personaId,
  //   contentId: message?.msgId,
  //   contentType: '',
  //   reportType: type,
  //   reportText: text,
  //   contentText: '',
  //   roomId: roomStore.currentRoomId,
  //   etc: '',
  // };
  // if (message?.msgBody.content) {
  //   reportDTO.contentType = 'CHAT';
  //   reportDTO.contentText = parseContent(message.msgBody.content);
  // } else if (message?.msgType.includes('file') && message.msgBody.files) {
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
  //   };

  const handleClickUnreadUser = () => {
    const roomId = roomStore.currentRoomId;
    navigate(`/talk/${roomId}/unreadUser`, { replace: true });
  };

  // const handleClickMail = () => {
  //   console.log('handleClickMail');
  // };
  // const handleClickShare = () => {
  //   console.log('handleClickShare');
  // };
  const handleClickSetNotice = async () => {
    const room = roomStore.getRoomById(
      roomStore.currentRoomId as number,
    ) as RoomModel;
    const nick = userStore.selectedPersona?.nick ?? '';
    const message = messageStore.hoveredMessage;
    if (message?.msgBody) {
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
      setOpenSetNoticeDialog(false);
    }
  };

  const handleClickSave = async () => {
    handleCloseMenu();

    if (message?.msgBody?.files?.length) {
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
          ).padStart(2, '0')}${String(todayDate.getDate()).padStart(
            2,
            '0',
          )}_${String(todayDate.getHours()).padStart(2, '0')}${String(
            todayDate.getMinutes(),
          ).padStart(2, '0')}${String(todayDate.getSeconds()).padStart(
            2,
            '0',
          )}`;

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
      {configStore.MessageMenu.length > 0 && (
        <S.BottomContextMenu
          anchor={'bottom'}
          open={hash === '#message-context-menu'}
          onClose={handleCloseMenu}
          disablePortal
        >
          {messageStore.hoveredMessage && (
            <S.MenuList ref={ref}>
              {configStore.MessageMenu.includes('reaction') && <ReactionMenu />}

              {reactionStore.getAllReactions(messageId).length > 0 && (
                <S.MenuItem onClick={handleClickNumOfReaction}>
                  <Icon.UserLine
                    width={20}
                    height={20}
                    color={Color.Gray[900]}
                  />
                  <S.MenuItemText>{'공감한 인원'}</S.MenuItemText>
                </S.MenuItem>
              )}
              <S.MenuItem onClick={handleClickReply}>
                <Icon.ReplyLine
                  width={20}
                  height={20}
                  color={Color.Gray[900]}
                />
                <S.MenuItemText>{'답장'}</S.MenuItemText>
              </S.MenuItem>
              {deleteActivate && (
                <S.MenuItem onClick={handleClickDelete}>
                  <Icon.DeleteLine
                    width={20}
                    height={20}
                    color={Color.Gray[900]}
                  />
                  <S.MenuItemText>{'삭제'}</S.MenuItemText>
                </S.MenuItem>
              )}
              {copyActivate && (
                <S.MenuItem onClick={handleClickCopy}>
                  <Icon.CopyLine
                    width={20}
                    height={20}
                    color={Color.Gray[900]}
                  />
                  <S.MenuItemText>{'복사'}</S.MenuItemText>
                </S.MenuItem>
              )}
              {saveActivate && (
                <S.MenuItem onClick={handleClickSave}>
                  <Icon.DownloadLine
                    width={16}
                    height={16}
                    color={Color.Gray[900]}
                  />
                  <S.MenuItemText>{'저장'}</S.MenuItemText>
                </S.MenuItem>
              )}
              {deliverActivate && (
                <S.MenuItem onClick={handleClickDeliver}>
                  <Icon.DeliverLine
                    width={20}
                    height={20}
                    color={Color.Gray[900]}
                  />
                  <S.MenuItemText>
                    {configStore.messageDeliverText}
                  </S.MenuItemText>
                </S.MenuItem>
              )}
              {unreadUserActivate && (
                <S.MenuItem onClick={handleClickUnreadUser}>
                  <Icon.UserLine
                    width={20}
                    height={20}
                    color={Color.Gray[900]}
                  />
                  <S.MenuItemText>{'안 읽은 인원'}</S.MenuItemText>
                </S.MenuItem>
              )}
              {/* <S.MenuItem onClick={handleClickMail}>
              <Icon.MailLine width={20} height={20} color={Color.Gray[900]} />
              <S.MenuItemText>{'메일로 전달'}</S.MenuItemText>
            </S.MenuItem> */}
              {/* <S.MenuItem onClick={handleClickShare}>
              <Icon.ShareLine width={20} height={20} color={Color.Gray[900]} />
              <S.MenuItemText>{'외부 앱으로 공유'}</S.MenuItemText>
            </S.MenuItem> */}
              {setNoticeActivate && (
                <S.MenuItem onClick={handleOpenSetNoticeDialog}>
                  <Icon.NoticeLine
                    width={20}
                    height={20}
                    color={Color.Gray[900]}
                  />
                  <S.MenuItemText>{'공지'}</S.MenuItemText>
                </S.MenuItem>
              )}
              {reportActivate && (
                <S.MenuItem onClick={handleClickReport}>
                  <Icon.SpamLine
                    width={20}
                    height={20}
                    color={Color.Gray[900]}
                  />
                  <S.MenuItemText>{'신고'}</S.MenuItemText>
                </S.MenuItem>
              )}
              {blindActivate && (
                <S.MenuItem onClick={handleClickBlind}>
                  <ChatBan />
                  <S.MenuItemText>{'블라인드'}</S.MenuItemText>
                </S.MenuItem>
              )}
            </S.MenuList>
          )}
        </S.BottomContextMenu>
      )}
      <ConfirmDialog
        open={openConfirmDialog}
        title={'권한 확인'}
        content={'소유자 권한을 가진 문서에 대해서만 전달이 가능합니다.'}
        onClickOk={handleCloseConfirmDialog}
      />
      <ConfirmDialog
        open={openSetNoticeDialog}
        title={'공지 등록'}
        content={`${configStore.FeatureNameType.Room} 상단 공지는 1건만 노출됩니다.`}
        onClickOk={handleClickSetNotice}
        onClickCancel={() => setOpenSetNoticeDialog(false)}
      />
      <ConfirmDialog
        open={openReportedAlertDialog}
        title={'이미 신고가 접수된 콘텐츠입니다.'}
        onClickOk={handleClickReportedAlertOk}
      />
    </>
  );
});

export default MessageContextMenu;
