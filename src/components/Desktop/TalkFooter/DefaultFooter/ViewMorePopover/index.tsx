import { useState } from 'react';

import { RoomModel, useCoreStore } from '@wapl/core';
import { useTheme, Icon } from '@wapl/ui';

import { ReactComponent as ReservationMessageIcon } from '@/assets/icons/ReservationMessageIcon.svg';
import { useStore } from '@/stores';
import { getRoomType } from '@/utils';

import * as S from './styled';

interface ViewMorePopoverProps {
  open: null | HTMLElement;
  handleClose: () => void;
}

const ViewMorePopover = ({ open, handleClose }: ViewMorePopoverProps) => {
  const theme = useTheme();
  const { uiStore, reserveStore, talkStore, configStore } = useStore();
  const { roomStore } = useCoreStore();

  const isMyRoom = getRoomType(
    roomStore.getRoomById(roomStore.currentRoomId) as RoomModel,
  ).isMyRoom;

  const handleClickNotice = () => {
    uiStore.setNoticeDialogMode('create');
    uiStore.openDialog('notice');
    handleClose();
  };

  const handleClickVote = () => {
    uiStore.setVoteDialogMode('createVote');
    uiStore.openDialog('vote');
    handleClose();
  };

  const handleClickReserve = () => {
    uiStore.openDialog('reserve');
    uiStore.setReserveDialogMode('create');
    reserveStore.setEntryPoint('Footer');
    handleClose();
  };
  return (
    <S.Menu
      anchorEl={open}
      open={!!open}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
    >
      {configStore.FooterMenuItems.Notice && (
        <S.MenuItem onClick={handleClickNotice}>
          <Icon.NoticeLine
            width={16}
            height={16}
            color={theme.Color.Gray[900]}
          />
          <S.MenuItemText>{'공지 생성'}</S.MenuItemText>
        </S.MenuItem>
      )}
      {!isMyRoom && configStore.FooterMenuItems.Vote && (
        <S.MenuItem onClick={handleClickVote}>
          <Icon.VoteLine width={16} height={16} color={theme.Color.Gray[900]} />
          <S.MenuItemText>{'투표 생성'}</S.MenuItemText>
        </S.MenuItem>
      )}
      {!talkStore.isMini && configStore.FooterMenuItems.Reserve && (
        <S.MenuItem onClick={handleClickReserve}>
          <ReservationMessageIcon
            width={16}
            height={16}
            color={theme.Color.Gray[900]}
          />
          <S.MenuItemText>{'예약 메시지 생성'}</S.MenuItemText>
        </S.MenuItem>
      )}
    </S.Menu>
  );
};

export default ViewMorePopover;
