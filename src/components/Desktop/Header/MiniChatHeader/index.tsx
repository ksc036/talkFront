import { useState, useEffect } from 'react';
import { MouseEvent } from 'react';

import { DesktopRoomProfilePopover, RoomModel, useCoreStore } from '@wapl/core';
import { Avatar, Icon } from '@wapl/ui';
import { observer } from 'mobx-react-lite';

import { ConfirmDialog } from '@/components/Common/Dialog';
import { useStore } from '@/stores';
import { getRoomType } from '@/utils';

import { KeywordSearch } from '../KeywordSearch';

import * as S from './styled';

export const MiniChatHeader = observer(() => {
  const { messageStore, configStore, uiStore, talkStore } = useStore();
  const { roomStore, userStore } = useCoreStore();
  const { appId } = talkStore;

  const roomInfo = roomStore.getRoomById(
    roomStore.currentRoomId as number,
  ) as RoomModel;
  const { isMyRoom, isDm, isBotRoom } = getRoomType(roomInfo);

  const [roomProfileAnchorEl, setRoomProfileAnchorEl] =
    useState<null | HTMLElement>(null);

  useEffect(() => {
    uiStore.setShowSearchBar(false);
    messageStore.setSearchKeyword('');
  }, [roomStore.currentRoomId]);

  const handleProfileClick = (event: MouseEvent<HTMLElement>) => {
    if (isMyRoom) {
      uiStore.setDesktopProfileAnchorEl(event.currentTarget);
      uiStore.setDesktopProfilePosition('headerProfile');

      const myPersonaId = userStore.selectedPersona?.id;
      if (myPersonaId) {
        uiStore.setSelectedPersonaId(myPersonaId);
      }
    } else {
      setRoomProfileAnchorEl(event.currentTarget);
    }
  };

  const handleProfileClose = () => {
    setRoomProfileAnchorEl(null);
  };

  const handleSearchButtonClick = () => {
    uiStore.setShowSearchBar(true);
  };

  const handleDialogCloseButton = () => {
    uiStore.setOpenMiniChatDisabledDialog(false);
  };

  return (
    <>
      <S.MiniChatHeaderWrapper backgroundColor={configStore.HeaderColor}>
        <S.RoomInfoWrapper
          onClick={handleProfileClick}
          clickable={configStore.ProfileDialogVisible}
        >
          {uiStore.showSearchBar ? (
            <KeywordSearch />
          ) : (
            <>
              <S.RoomProfileWrapper>
                <Avatar
                  size={36}
                  imgSrc={roomInfo.profileImageSource ?? ''}
                  outLineColor={configStore.HeaderColor}
                />
              </S.RoomProfileWrapper>

              {isMyRoom && (
                <S.MeFillIcon
                  width={16}
                  height={16}
                  color={configStore.MainColor}
                />
              )}
              <S.RoomName>{roomInfo.name}</S.RoomName>
              {!(isDm || isMyRoom || isBotRoom) && (
                <S.RoomMemberCount color={configStore.HeaderMemberCountColor}>
                  {roomInfo.personaCount}
                </S.RoomMemberCount>
              )}
            </>
          )}
        </S.RoomInfoWrapper>

        {configStore.HeaderMenuItems.KeywordSearch &&
          !uiStore.showSearchBar && (
            <S.KeywordSearchButton
              onClick={handleSearchButtonClick}
              hasText={configStore.ShowHeaderItemName}
            >
              <Icon.SearchLine width={20} height={20} />
            </S.KeywordSearchButton>
          )}
      </S.MiniChatHeaderWrapper>

      <DesktopRoomProfilePopover
        roomId={roomStore.currentRoomId}
        appId={appId}
        onClose={handleProfileClose}
        anchorEl={roomProfileAnchorEl}
        sx={{ marginTop: '8px' }}
      />

      <ConfirmDialog
        open={uiStore.openMiniChatDisabledDialog}
        content={`${configStore.FeatureNameType.MiniChat}에서 지원하지 않는 기능입니다.`}
        hideBackdrop
        onClickOk={handleDialogCloseButton}
      />
    </>
  );
});
