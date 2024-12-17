import React, { useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

import { useDocsStore } from '@tmaxoffice/docs';
import { useCoreStore } from '@wapl/core';
import { useTheme } from '@wapl/ui';
import { observer, useObserver } from 'mobx-react-lite';

import { TalkComponentProps } from '@/@types';
import TalkFooter from '@/components/Mobile/TalkFooter/Content';
import { MESSAGE_SIZE } from '@/constants';
import useFocusInOut from '@/hooks/useFocusInOut';
import { rootStore, useStore } from '@/stores';
import { TopPropsProvider } from '@/TopPropsProvider';
import isDarkMode from '@/utils/darkModeDetect';

import Loading from '../Common/Loading';

import UserProfileDialog from './Dialogs/UserProfileDialog';
import * as S from './styled';
import TalkBody from './TalkBody';
import { SearchArrow } from './TalkFooter/SearchArrow';
import { TalkHeader } from './TalkHeader';
import { RoomSettingDialog } from './TalkHeader/RoomMenuFooter/Setting/RoomSettingDialog';

export const MobileTalk = observer((props: TalkComponentProps) => {
  const {
    width,
    height,
    roomMenuItems,
    roomFooterMenuItems,
    windowButton,
    onFileChipClick,
    docsUploadCallback,
    appId,
    headerVisible = true,
  } = props;
  const coreStore = useCoreStore();
  const { roomStore, userStore, personaStore } = coreStore;
  const {
    messageStore,
    noticeStore,
    talkStore,
    reactionStore,
    configStore,
    uiStore,
    fileStore,
  } = useStore();
  if (appId) talkStore.setAppId(appId);
  const docsStore = useDocsStore();
  configStore.setTheme(useTheme());
  const currentRoomId = useObserver(() => roomStore.currentRoomId) as number;
  const location = useLocation();
  const { pathname } = location;
  const { id } = useParams();
  const navigate = useNavigate();
  const { handleFocus, handleBlur } = useFocusInOut();

  const updateLastReadMessage = async () => {
    const roomLastReadMsgId =
      messageStore.getRoomMeta(currentRoomId)?.lastMessageId;
    const roomUnreadCount =
      messageStore.roomMetadataMap.get(currentRoomId)?.count;
    if (
      messageStore.state === 'done' &&
      roomLastReadMsgId !== undefined &&
      !!roomUnreadCount
    ) {
      await messageStore.updateLastReadMessageId({
        roomId: currentRoomId,
        msgId: roomLastReadMsgId,
      });
    }
  };

  const tryGetMessages = async () => {
    try {
      const res = await roomStore.getRoomMemberList(
        roomStore.currentRoomId as number,
      );

      messageStore.setUserList(
        res.map((persona) => persona.personaId),
        userStore.selectedPersona?.id ?? -1,
      );

      await messageStore.getUserLastReadMessageIds();

      const roomEnterTime = roomStore.getRoomById(
        roomStore.currentRoomId as number,
      )?.myInfo?.joinDate as string;
      await messageStore.getMessages({
        upSize: MESSAGE_SIZE,
        downSize: MESSAGE_SIZE,
        roomEnterTime,
        isFirstLoad: true,
      });
      if (messageStore.state === 'done') uiStore.setOpenGetMessageFail(false);
    } catch (e) {
      uiStore.setOpenGetMessageFail(true);
    }
  };

  const watchRoom = async () => {
    talkStore.setIsLoading(true);
    await tryGetMessages();
    await updateLastReadMessage();
    talkStore.setIsLoading(false);
  };

  const personaList = roomStore
    .getRoomMemberList(roomStore.currentRoomId as number)
    .map((roomMember) => {
      return personaStore.getPersona(roomMember.personaId);
    });

  useEffect(() => {
    const matchRoomId = pathname.match(/^\/talk\/(\d+)$/);
    if (
      matchRoomId ||
      pathname.includes('bottomItems') ||
      pathname.includes('search') ||
      pathname.includes('drawer')
    ) {
      handleFocus();
    } else {
      handleBlur();
    }
  }, [pathname]);

  useEffect(() => {
    if (!fileStore.isInit) {
      docsStore.initialize(Number(window.APP_ID) ? Number(window.APP_ID) : 1);
      fileStore.setIsInit(true);
    }
    if (!rootStore.coreStore) {
      rootStore.addCoreStore(coreStore);
    }
  }, []);

  useEffect(() => {
    if ((roomStore.currentRoomId as number) > 0) {
      messageStore.clear();
      noticeStore.clear();
      reactionStore.clear();
      watchRoom();
    }
  }, [roomStore.currentRoomId]);

  const myPersona = userStore.selectedPersona;

  useEffect(() => {
    if (uiStore.selectedPersonaId !== -1)
      personaStore.fetchPersona({ personaId: uiStore.selectedPersonaId });
  }, []);

  useEffect(() => {
    if (roomStore.currentRoomId === 0) {
      navigate(`/talk`);
    }
  }, [roomStore.currentRoomId]);

  useEffect(() => {
    if (id) {
      const routeRoomId = parseInt(id);
      if (routeRoomId !== roomStore.currentRoomId && routeRoomId > 0)
        roomStore.setCurrentRoomId(routeRoomId);
    }
  }, [id]);

  useEffect(() => {
    if (personaList?.length === 0) {
      roomStore.setCurrentRoomId(0);
    }
  }, [personaList]);

  // 룸에 바로 접근 시 룸리스트로 복귀시키는 코드
  // if (roomStore.roomList.length === 0) {
  //   return <Navigate to="/talk" />;
  // }

  if (!roomStore.getRoomById(roomStore.currentRoomId as number) || !personaList)
    // 가운데 정렬 필요
    return <Loading />;

  if (!myPersona) {
    return null;
  }

  return (
    <TopPropsProvider>
      <S.TalkLayout color={isDarkMode() ? '#2C2C2E' : configStore.BodyColor}>
        <S.Header headerVisible={headerVisible}>
          <TalkHeader
            width={width}
            height={height}
            roomMenuItems={roomMenuItems}
            roomFooterMenuItems={roomFooterMenuItems}
            windowButton={windowButton}
            onFileChipClick={onFileChipClick}
            docsUploadCallback={docsUploadCallback}
          />
          <RoomSettingDialog />
        </S.Header>
        <S.Body>
          <TalkBody />
        </S.Body>
        <S.Footer>
          {messageStore.searchResultIds.length > 0 && <SearchArrow />}
          <TalkFooter />
        </S.Footer>

        {uiStore.selectedPersonaId !== -1 && (
          <UserProfileDialog
            personaId={uiStore.selectedPersonaId}
            isMine={uiStore.selectedPersonaId === myPersona.id}
          />
        )}
      </S.TalkLayout>
    </TopPropsProvider>
  );
});
