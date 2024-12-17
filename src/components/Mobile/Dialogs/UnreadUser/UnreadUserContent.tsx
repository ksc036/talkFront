import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { RoomMember, useCoreStore } from '@wapl/core';
import { AppBar, AppBarCloseButton, useTheme } from '@wapl/ui';
import { observer } from 'mobx-react';

import { useStore } from '@/stores';

import * as S from './styled';
import UnreadUserItem from './UnreadUserItem';

const UnreadUserContent = observer(() => {
  const { roomStore } = useCoreStore();
  const { messageStore } = useStore();
  const { Color } = useTheme();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [unreadMemberList, setUnreadMemberList] = useState<RoomMember[] | null>(
    null,
  );

  useEffect(() => {
    if (!pathname.includes('unreadUser')) return;
    const personaList = roomStore.getRoomMemberList(
      roomStore.currentRoomId as number,
    );
    const unreadUserIdList = messageStore.lastReadMessageIdMap
      .get(roomStore.currentRoomId as number)
      ?.map((item) => {
        if (item.lastReadMsgId < messageStore.hoveredMessageId)
          return item.personaId;
      });

    setUnreadMemberList(
      personaList.filter((persona: RoomMember) => {
        if (unreadUserIdList) {
          return unreadUserIdList.some((id) => {
            return id === persona.personaId;
          });
        }
      }),
    );
  }, [pathname]);

  const handleClickBack = () => {
    navigate(-1);
  };

  return (
    <S.Wrapper>
      <S.Header>
        <AppBar
          title={'안 읽은 인원'}
          style={{
            boxSizing: 'border-box',
            backgroundColor: Color.Background[0],
          }}
          leftSide={<AppBarCloseButton onClick={handleClickBack} />}
        />
      </S.Header>
      <S.UnreadUserItemWrapper>
        {unreadMemberList &&
          unreadMemberList.map((unreadMember) => (
            <UnreadUserItem roomMember={unreadMember} />
          ))}
      </S.UnreadUserItemWrapper>
    </S.Wrapper>
  );
});

export default UnreadUserContent;
