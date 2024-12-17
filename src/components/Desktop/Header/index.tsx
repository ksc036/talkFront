import { useState, useEffect, useRef } from 'react';

import {
  RoomModel,
  useCoreStore,
  DesktopRoomProfilePopover,
  DesktopMemberSelectorDialog,
  PersonaModel,
} from '@wapl/core';
import { Avatar, Icon } from '@wapl/ui';
import { throttle } from 'lodash';
import { observer, useObserver } from 'mobx-react-lite';

import { useStore } from '@/stores';
import { getRoomRestraints, getRoomType } from '@/utils';
import isDarkMode from '@/utils/darkModeDetect';
import RoomMenu from '@desktop/Header/RoomMenu';

import CalendarIcon from './HeaderIcons/CalendarIcon';
import DateSelect from './HeaderIcons/DateSelect';
import DrawerIcon from './HeaderIcons/DrawerIcon';
import DriveIcon from './HeaderIcons/DriveIcon';
import MeetingIcon from './HeaderIcons/MeetingIcon';
import MiniChatIcon from './HeaderIcons/MiniChatIcon';
import { KeywordSearch } from './KeywordSearch';
import { MiniChatHeader } from './MiniChatHeader';
import * as S from './styled';

interface HeaderProps {
  width?: number;
  roomMenuItems?: React.ReactNode[];
  roomFooterMenuItems?: React.ReactNode[];
  windowButton?: React.ReactNode;
  headerVisible?: boolean;
}

const Header = observer((props: HeaderProps) => {
  const { width, roomMenuItems, roomFooterMenuItems, headerVisible } = props;
  const { messageStore, uiStore, configStore, talkStore } = useStore();
  const { roomStore, userStore } = useCoreStore();

  const { appId } = talkStore;

  const roomInfo = roomStore.getRoomById(
    roomStore.currentRoomId as number,
  ) as RoomModel;
  const { isMyRoom, isDm, isOpenRoom, isBotRoom } = getRoomType(roomInfo);

  const [searchBarWidth, setSearchBarWidth] = useState<number>(0);
  const [collapseSearchBar, setCollapseSearchBar] = useState<boolean>(true);
  const [showRoomInfo, setShowRoomInfo] = useState<boolean>(true);

  const headerRef = useRef<HTMLDivElement>(null);

  const [roomProfileAnchorEl, setRoomProfileAnchorEl] =
    useState<null | HTMLElement>(null);

  const curMemberIdList = roomStore.currentRoomId
    ? roomStore
        .getRoomMemberList(roomStore.currentRoomId)
        .map((member) => member.personaId)
    : [];

  const { isDisabled } = useObserver(() => {
    return getRoomRestraints(
      userStore.selectedPersona as PersonaModel,
      roomStore.getRoomById(roomStore.currentRoomId as number) as RoomModel,
    );
  });

  const updateSize = () => {
    if (headerRef.current) {
      const headerWidth = headerRef.current.offsetWidth;

      if (uiStore.openLinkDrawer) {
        setCollapseSearchBar(true);
        uiStore.setShowSearchBar(false);
        return;
      }

      uiStore.setShowSearchBar(false);
      setShowRoomInfo(true);

      if (headerWidth >= 1000) {
        setSearchBarWidth(720);
      } else if (headerWidth < 1000) {
        setSearchBarWidth(headerWidth - 96);
      } else if (configStore.SearchBarStyle.Width) {
        setSearchBarWidth(configStore.SearchBarStyle.Width);
      }
    }
  };

  const isMeetingAvailable = configStore.MeetingAvailableRoomTypeNames.includes(
    roomInfo.typeName,
  );

  useEffect(() => {
    updateSize();
  }, [width]);

  useEffect(() => {
    uiStore.setShowSearchBar(false);
    messageStore.setSearchKeyword('');
  }, [roomStore.currentRoomId]);

  useEffect(() => {
    window.addEventListener('resize', throttle(updateSize, 500));
    updateSize();

    return () =>
      window.removeEventListener('resize', throttle(updateSize, 500));
  }, []);

  const handleProfileClick = (event: any) => {
    if (!configStore.ProfileDialogVisible) return;
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
    if (collapseSearchBar) {
      uiStore.setShowSearchBar(true);

      if (headerRef.current && headerRef.current.offsetWidth < 1000) {
        setShowRoomInfo(false);
      }
    }
  };

  const handleInviteDialogClose = () => {
    uiStore.closeDialog('invite');
  };

  const handleInviteMembers = async (selectedData?: {
    selectedPersonaList?: number[];
    selectedRoomList?: number[];
  }) => {
    try {
      const res = await roomStore.inviteMember({
        appId: appId,
        roomId: roomStore.currentRoomId as number,
        selectedPersonaIdList: selectedData?.selectedPersonaList,
        selectedRoomIdList: selectedData?.selectedRoomList,
      });

      if (res.result === 'success') {
        uiStore.closeDialog('invite');
      } else {
        console.log('초대 오류');
      }
    } catch (error) {
      throw error;
    }
  };

  const handleCreateRoom = async (selectedList?: {
    selectedPersonaList?: number[];
    selectedRoomList?: number[];
  }) => {
    try {
      const res = await roomStore.createRoom({
        appId: appId,
        roomTypeId: 5,
        selectedPersonaIdList: selectedList?.selectedPersonaList
          ? [...curMemberIdList, ...selectedList?.selectedPersonaList]
          : [...curMemberIdList],
        selectedRoomIdList: selectedList?.selectedRoomList,
      });
      if (res.result === 'created') {
        uiStore.closeDialog('invite');
        roomStore.setCurrentRoomId(res.room.id);
      }
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    if (!uiStore.showSearchBar) {
      setShowRoomInfo(true);
    }
  }, [uiStore.showSearchBar]);

  useEffect(() => {
    const handleResize = () => {
      uiStore.setRoomMenuAnchorEl(null);
    };

    window.addEventListener('resize', throttle(handleResize, 500));

    return () => {
      window.removeEventListener('resize', throttle(handleResize, 500));
    };
  }, []);

  return talkStore.isMini ? (
    <MiniChatHeader />
  ) : (
    <S.HeaderWrapper headerVisible={headerVisible}>
      <S.Header
        ref={headerRef}
        color={isDarkMode() ? '#2C2C2E' : configStore.HeaderColor}
      >
        <S.RoomInfoWrapper
          onClick={handleProfileClick}
          clickable={configStore.ProfileDialogVisible}
        >
          <S.RoomProfileWrapper>
            <Avatar
              size={36}
              imgSrc={roomInfo.profileImageSource ?? ''}
              outLineColor={configStore.HeaderColor}
            />
          </S.RoomProfileWrapper>

          {showRoomInfo && (
            <>
              {isMyRoom && (
                <S.MeFillIcon
                  width={16}
                  height={16}
                  color={configStore.MainColor}
                />
              )}
              {configStore.ShowRoomTypeIcon.Open && isOpenRoom && (
                <S.RoomTypeIcon color={configStore.MainColor}>
                  오픈룸
                </S.RoomTypeIcon>
              )}
              {configStore.ShowRoomTypeIcon.Open && isBotRoom && (
                <S.RoomTypeIcon color={configStore.MainColor}>
                  봇룸
                </S.RoomTypeIcon>
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

        {uiStore.showSearchBar ? (
          <KeywordSearch searchBarWidth={searchBarWidth} />
        ) : (
          <S.HeaderIconsWrapper>
            {!isDisabled ? (
              <>
                {configStore.HeaderMenuItems.DateSearch && <DateSelect />}
                {configStore.HeaderMenuItems.Drawer && <DrawerIcon />}
                {configStore.HeaderMenuItems.Drive && <DriveIcon />}
                {configStore.HeaderMenuItems.Calendar && <CalendarIcon />}
                {configStore.HeaderMenuItems.Meeting && isMeetingAvailable && (
                  <MeetingIcon />
                )}
                {configStore.HeaderMenuItems.MiniChat && <MiniChatIcon />}
                {Object.values(configStore.HeaderMenuItems).filter(
                  (headerMenuItem) => headerMenuItem,
                ).length > 0 &&
                  (configStore.HeaderMenuItems.KeywordSearch ||
                    configStore.HeaderMenuItems.RoomMenu) && (
                    <S.Splitter hasText={configStore.ShowHeaderItemName} />
                  )}
                {configStore.HeaderMenuItems.KeywordSearch && (
                  <S.KeywordSearchButton
                    onClick={handleSearchButtonClick}
                    hasText={configStore.ShowHeaderItemName}
                  >
                    <Icon.SearchLine width={20} height={20} />
                    {configStore.ShowHeaderItemName && '검색'}
                  </S.KeywordSearchButton>
                )}
                {configStore.HeaderMenuItems.RoomMenu && (
                  <RoomMenu
                    roomMenuItems={roomMenuItems}
                    roomFooterMenuItems={roomFooterMenuItems}
                  />
                )}
              </>
            ) : (
              configStore.HeaderMenuItems.MiniChat && <MiniChatIcon />
            )}
          </S.HeaderIconsWrapper>
        )}
      </S.Header>

      <DesktopMemberSelectorDialog
        appId={appId}
        title={`${configStore.FeatureNameType.Room} 멤버 초대`}
        isOpen={uiStore.openInvite}
        submitButtonOption={{
          text: '초대',
          onClick: isDm ? handleCreateRoom : handleInviteMembers,
          showCount: true,
        }}
        cancelButtonOption={{
          text: '취소',
          onClick: handleInviteDialogClose,
        }}
        onClose={handleInviteDialogClose}
        disabledIds={{
          room: (roomStore.myRoom?.id
            ? [roomStore.myRoom?.id, roomStore.currentRoomId]
            : [roomStore.currentRoomId]) as number[],
          persona: curMemberIdList,
        }}
        detailSearchItemKeys={configStore.MemberSelectorSearchKeys}
      />

      <DesktopRoomProfilePopover
        roomId={roomStore.currentRoomId}
        appId={appId}
        onClose={handleProfileClose}
        anchorEl={roomProfileAnchorEl}
        sx={{ marginTop: '8px' }}
      />
    </S.HeaderWrapper>
  );
});

export default Header;
