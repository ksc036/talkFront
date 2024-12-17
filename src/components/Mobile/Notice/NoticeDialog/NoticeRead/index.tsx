import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { RoomModel, useCoreStore } from '@wapl/core';
import { Avatar, Icon, useTheme, AppBar, AppBarBackButton } from '@wapl/ui';
import { observer } from 'mobx-react';

import { ConfirmDialog } from '@/components/Common/Dialog/ConfirmDialog';
import PlainMessage from '@/components/Common/Message/MessageItem/PlainMessage';
import { useStore } from '@/stores';
import {
  timeStampFormat,
  // parseContent,
  getAuthority,
  activateActions,
} from '@/utils';

import * as S from './styled';

const NoticeRead = observer(() => {
  const { uiStore, noticeStore, configStore } = useStore();
  const { roomStore, personaStore, userStore } = useCoreStore();
  const { Color } = useTheme();
  const navigate = useNavigate();
  const { hash } = useLocation();

  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);
  const [openReportedAlertDialog, setOpenReportedAlertDialog] =
    useState<boolean>(false);

  const authority = getAuthority(
    noticeStore.currentNotice,
    roomStore.getRoomById(roomStore.currentRoomId as number) as RoomModel,
    userStore.selectedPersona,
  );

  const activateDelete = activateActions(
    'delete',
    configStore.CanDeleteEditContents.Delete,
    authority,
  );

  const activateEdit = activateActions(
    'edit',
    configStore.CanDeleteEditContents.Edit,
    authority,
  );

  const activateReport =
    !authority.isMine && configStore.MessageMenu.includes('report');

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setOpenMenu(true);
  };
  const handleCloseMenu = () => {
    setOpenMenu(false);
  };

  const handleOpenConfirmDialog = () => {
    handleCloseMenu();
    setOpenConfirmDialog(true);
  };
  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };
  const handleClickRepoertedAlertOk = () => {
    setOpenReportedAlertDialog(false);
    navigate(-1);
  };

  const handleClickBack = () => {
    navigate(-1);
  };

  const handleClickDelete = async () => {
    const noticeId = noticeStore.currentNoticeId;
    const roomId = roomStore.currentRoomId as number;
    await noticeStore.deleteNotice({
      noticeId,
      roomId,
    });
    navigate(-1);
    uiStore.openToast('공지가 삭제되었습니다.');
  };
  const handleClickModify = () => {
    navigate(`/talk/${roomStore.currentRoomId}/notice#update`);
  };
  const handleOpenReportDialog = () => {
    navigate('#notice-report');
  };
  // const handleReportClose = () => {
  //   navigate(-1);
  // };

  // TODO: 신고하기 기능 주석 처리
  // const handleReportCreate = async () =>
  //   // type: ReportDTO.ReportType,
  //   // text: string,
  //   {
  //     // if (noticeStore.currentNotice?.noticeBody.content) {
  //     //   const parsedContentText = parseContent(
  //     //     noticeStore.currentNotice.noticeBody.content,
  //     //   );
  //     //   const reportDTO = {
  //     //     toPersonaId: noticeStore.currentNotice.personaId,
  //     //     contentId: noticeStore.currentNotice.noticeId,
  //     //     contentType: 'NOTICE',
  //     //     reportType: type,
  //     //     reportText: text,
  //     //     contentText: parsedContentText,
  //     //     roomId: roomStore.currentRoomId,
  //     //   };
  //     //   const res = await reportStore.createReport(reportDTO as ReportDTO.Report);
  //     //   if (res?.success) {
  //     //     handleReportClose();
  //     //   } else {
  //     //     setOpenReportedAlertDialog(true);
  //     //   }
  //     // }
  //   };
  const handlePinNotice = async () => {
    const noticeId = noticeStore.currentNoticeId;
    const room = roomStore.getRoomById(
      roomStore.currentRoomId as number,
    ) as RoomModel;
    const nick = userStore.selectedPersona?.nick ?? '';
    await noticeStore.pinNotice({
      roomId: room.id,
      noticeId,
      roomName: room.name,
      nick,
    });
    handleCloseMenu();
  };

  useEffect(() => {
    const getNotice = async () => {
      const noticeId = noticeStore.currentNoticeId;
      const roomId = roomStore.currentRoomId as number;
      const res = await noticeStore.getNotice({ noticeId, roomId });
      if (!res) uiStore.openDialog('confirmDeletedNotice');
      setIsLoading(false);
    };
    if (hash === '#read') {
      getNotice();
    }
  }, []);

  return (
    <>
      {!isLoading && noticeStore.currentNotice && (
        <S.Wrapper>
          <S.NoticeHeader>
            <AppBar
              title={'공지'}
              style={{
                boxSizing: 'border-box',
                backgroundColor: Color.Background[0],
              }}
              leftSide={<AppBarBackButton onClick={handleClickBack} />}
            />
          </S.NoticeHeader>
          <S.NoticeBody>
            <S.NoticeHeaderWrapper>
              <Avatar
                imgSrc={
                  personaStore.getPersona(noticeStore.currentNotice.personaId)
                    ?.profileImage ??
                  personaStore.getPersona(noticeStore.currentNotice.personaId)
                    ?.color ??
                  ''
                }
              />
              <S.NoticeContent>
                <S.NameText>
                  {personaStore.getPersona(noticeStore.currentNotice.personaId)
                    ?.nick ?? ''}
                </S.NameText>
                <S.TimeText>
                  {`${timeStampFormat(
                    noticeStore.currentNotice.updatedAt,
                    'MM월 DD일 a HH:mm',
                  )} 공지`}
                </S.TimeText>
              </S.NoticeContent>
              <S.IconButton onClick={handleOpenMenu}>
                <Icon.MoreLine width={20} height={20} color={Color.Gray[500]} />
              </S.IconButton>
            </S.NoticeHeaderWrapper>
            <S.NoticeDetailText>
              <PlainMessage
                msgId={noticeStore.currentNotice.noticeId}
                content={noticeStore.currentNotice.noticeBody.content ?? ''}
                getLink={true}
                getMention={false}
                allowKeywordSearch={false}
              />
            </S.NoticeDetailText>
            <S.BottomContextMenu
              anchor={'bottom'}
              open={openMenu}
              onClose={handleCloseMenu}
            >
              <S.MenuTitle>공지</S.MenuTitle>
              {activateEdit && (
                <S.MenuItem onClick={handleClickModify}>
                  <Icon.EditLine
                    width={20}
                    height={20}
                    color={Color.Gray[900]}
                  />
                  <S.MenuItemText>{'수정'}</S.MenuItemText>
                </S.MenuItem>
              )}
              {activateDelete && (
                <S.MenuItem onClick={handleOpenConfirmDialog}>
                  <Icon.DeleteLine
                    width={20}
                    height={20}
                    color={Color.Gray[900]}
                  />
                  <S.MenuItemText>{'삭제'}</S.MenuItemText>
                </S.MenuItem>
              )}
              {activateReport && (
                <S.MenuItem onClick={handleOpenReportDialog}>
                  <Icon.SpamLine
                    width={20}
                    height={20}
                    color={Color.Gray[900]}
                  />
                  <S.MenuItemText>{'신고하기'}</S.MenuItemText>
                </S.MenuItem>
              )}
              <S.MenuItem onClick={handlePinNotice}>
                <Icon.NoticeLine
                  width={20}
                  height={20}
                  color={Color.Gray[900]}
                />
                <S.MenuItemText>재공지</S.MenuItemText>
              </S.MenuItem>
            </S.BottomContextMenu>
          </S.NoticeBody>
        </S.Wrapper>
      )}
      <ConfirmDialog
        open={openConfirmDialog}
        title={'공지 삭제'}
        content={`
          ${configStore.FeatureNameType.Room} 공지는 해제되나\n원본 메시지는 삭제되지 않습니다.`}
        onClose={handleCloseConfirmDialog}
        onClickOk={handleClickDelete}
        onClickCancel={handleCloseConfirmDialog}
        isOkNegative={true}
      />
      <ConfirmDialog
        open={openReportedAlertDialog}
        title={'이미 신고가 접수된 콘텐츠입니다.'}
        onClickOk={handleClickRepoertedAlertOk}
      />
    </>
  );
});

export default NoticeRead;
