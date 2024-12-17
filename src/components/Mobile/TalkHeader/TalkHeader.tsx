import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  RoomModel,
  // PersonaModel,
  useCoreStore,
} from '@wapl/core';
import { AppBarButton, Icon, useTheme } from '@wapl/ui';
import { observer } from 'mobx-react-lite';

import { useStore } from '@/stores';
import { getRoomType } from '@/utils';
import isDarkMode from '@/utils/darkModeDetect';

import MenuDrawer from './MenuDrawer';
import SearchBar from './SearchBar';
import SearchButton from './SearchButton';
import * as S from './styled';

interface TalkProps {
  width?: number | string;
  height?: number | string;
  roomMenuItems?: React.ReactNode[];
  roomFooterMenuItems?: React.ReactNode[];
  windowButton?: React.ReactNode;
  onFileChipClick?: (fileId?: number | string) => void;
  appId?: number;
  docsUploadCallback?: (fileId: number) => void;
}

const TalkHeader = observer((props: TalkProps) => {
  const {
    width,
    height,
    roomMenuItems,
    roomFooterMenuItems,
    windowButton,
    onFileChipClick,
    docsUploadCallback,
  } = props;
  const {
    roomStore,
    // personaStore
  } = useCoreStore();
  const { messageStore, configStore } = useStore();
  const { Color } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchMode, setSearchMode] = useState(false);

  const onClickEndDeleteMode = () => {
    messageStore.clearDeleteMessageIdList();
    messageStore.clearDeleteMessageDocumentIdsList();
    navigate(-1);
  };
  const onClickClear = () => {
    messageStore.clearDeleteMessageIdList();
    messageStore.clearDeleteMessageDocumentIdsList();
  };

  const roomInfo = roomStore.getRoomById(roomStore.currentRoomId) as RoomModel;
  const { isMyRoom, isPrivate } = getRoomType(roomInfo);

  // const personaList = roomStore
  //   .getRoomMemberList(roomStore.currentRoomId as number)
  //   .map((roomMember) => {
  //     return personaStore.getPersona(roomMember.personaId);
  //   }) as PersonaModel[];

  // const getPersonaListKey = () => {
  //   return personaList.map((item: PersonaModel) => {
  //     if (item.id === userStore.selectedPersona?.id) {
  //       return {
  //         key: String(item.id),
  //         role: '002',
  //       };
  //     } else {
  //       return {
  //         // 페르소나 아이디는 원래 number지만, 예외적으로 이 함수 요청 시에는 String 값으로 변환해서 요청해야 제대로 작동함.
  //         key: String(item.id),
  //         role: '003',
  //       };
  //     }
  //   });
  // };

  const handleOpenCalendar = () => {
    navigate(`/talk/${roomStore.currentRoomId}#calendar-menu`);
  };

  const handleBackButtonClick = () => {
    navigate('/talk');
  };

  if (location.hash === '#delete-mode') {
    return (
      <S.TalkHeader color={isDarkMode() ? '#2C2C2E' : configStore.BodyColor}>
        <S.TalkContentsWrapper>
          <S.TalkLeftContentsWrapper>
            <S.IconBtn onClick={onClickEndDeleteMode}>
              <Icon.ArrowBackLine />
            </S.IconBtn>
            <S.RoomTitle>{'삭제'}</S.RoomTitle>
          </S.TalkLeftContentsWrapper>
          <S.TalkRightContentsWrapper>
            <AppBarButton
              onClick={onClickClear}
              style={{ color: Color.Blue[500] }}
            >
              {'선택해제'}
            </AppBarButton>
          </S.TalkRightContentsWrapper>
        </S.TalkContentsWrapper>
      </S.TalkHeader>
    );
  }

  return (
    <S.TalkHeader color={isDarkMode() ? '#2C2C2E' : configStore.HeaderColor}>
      <S.TalkContentsWrapper>
        {location.pathname.includes('search') ? (
          <SearchBar searchMode={searchMode} setSearchMode={setSearchMode} />
        ) : (
          <>
            <S.TalkLeftContentsWrapper>
              {configStore.HeaderMenuItems.RoomMenu === true && (
                <S.IconBtn onClick={handleBackButtonClick}>
                  <Icon.ArrowBackLine width={24} height={24} />
                </S.IconBtn>
              )}

              <S.RoomTitleWrapper>
                {isMyRoom && (
                  <Icon.MeFill
                    width={20}
                    height={20}
                    color={configStore.MainColor}
                  />
                )}
                <S.RoomTitle>{roomInfo?.name}</S.RoomTitle>
                {roomInfo?.personaCount > 2 && (
                  <S.RoomMemberCount color={configStore.MainColor}>
                    {roomInfo?.personaCount}
                  </S.RoomMemberCount>
                )}
              </S.RoomTitleWrapper>
            </S.TalkLeftContentsWrapper>
            <S.TalkRightContentsWrapper>
              <SearchButton />
              {configStore.HeaderMenuItems.DateSearch && (
                <S.IconBtn onClick={handleOpenCalendar}>
                  <Icon.CalendarLine width={24} height={24} />
                </S.IconBtn>
              )}
              {configStore.HeaderMenuItems.RoomMenu === true && (
                <>
                  <S.IconBtn
                    onClick={() =>
                      navigate(`/talk/${roomStore.currentRoomId}/drawer`)
                    }
                  >
                    <Icon.MenuLine width={24} height={24} />
                  </S.IconBtn>
                  {location.pathname.includes('drawer') && (
                    <MenuDrawer
                      width={width}
                      height={height}
                      roomMenuItems={roomMenuItems}
                      roomFooterMenuItems={roomFooterMenuItems}
                      windowButton={windowButton}
                      onFileChipClick={onFileChipClick}
                      docsUploadCallback={docsUploadCallback}
                    />
                  )}
                </>
              )}
            </S.TalkRightContentsWrapper>
          </>
        )}
      </S.TalkContentsWrapper>
    </S.TalkHeader>
  );
});

export default TalkHeader;
