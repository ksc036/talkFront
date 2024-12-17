import { ReactNode, useEffect, useRef, useState } from 'react';

import { RunAppOptions } from '@shell/sdk';
import { useCoreStore } from '@wapl/core';
import { observer } from 'mobx-react-lite';

import * as T from '@/@types';
import { useStore } from '@/stores';
import { parseContentRoomMessage, timeStampFormat } from '@/utils';

import RoomItem, { RoomItemType } from '../RoomItem';

import * as S from './styled';

interface GeneralRoomListProps {
  keyword: string;
  loader: ReactNode;
  onRunApp?: ({
    appId,
    args,
  }: {
    appId: string;
    args: any;
    options?: RunAppOptions;
  }) => void;
}

const GeneralRoomSearchList = observer((props: GeneralRoomListProps) => {
  const { keyword, loader, onRunApp } = props;

  const { roomStore } = useCoreStore();
  const { messageStore } = useStore();

  // 내가 속한 룸 기준이고, 실시간으로 메시지 오는 것을 고려해서 페이지네이션 넣지 않음.
  // const [page, setPage] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [roomList, setRoomList] = useState<RoomItemType[]>([]);
  const [hasMore, setHasMore] = useState(false);

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    const finalizeRequest = () => {
      setRoomList([]);
      setLoaded(true);
    };

    debounceTimeout.current = setTimeout(async () => {
      if (keyword.length === 0) {
        finalizeRequest();
        return;
      }

      setLoaded(false);
      await roomStore.fetchRoomList({
        appId: 'tmax.core-ai.talk',
      });
      // keyword로 room 검색해서 id, roomEnterTime 받아오기.
      const roomSearchRes = await messageStore.searchRoomName({ keyword });
      if (!roomSearchRes) {
        finalizeRequest();
        return;
      }
      const { generalRoomInfoList } = roomSearchRes;
      if (!generalRoomInfoList || generalRoomInfoList.length === 0) {
        finalizeRequest();
        return;
      }
      const lastMessages = await messageStore.fetchLastMessage({
        roomInfos: generalRoomInfoList,
      });
      const lastMessagesMap = new Map<number, T.DTO.RoomLastMessage>();
      lastMessages.map((lastMessage: T.DTO.RoomLastMessage) =>
        lastMessagesMap.set(lastMessage.roomId, lastMessage),
      );

      const roomSearchList: RoomItemType[] = [];
      generalRoomInfoList.forEach(async (roomInfo) => {
        const room = roomStore.getRoomById(roomInfo.roomId);
        if (room) {
          const lastMessage = lastMessagesMap.get(roomInfo.roomId);
          const content = lastMessage
            ? await parseContentRoomMessage(
                lastMessage.msgBody,
                lastMessage.msgType,
                lastMessage.isDeleted,
              )
            : '';

          const lastMessageDate = lastMessage
            ? timeStampFormat(lastMessage.createdAt, 'YYYY-MM-DD HH:mm:ss')
            : '';
          roomSearchList.push({
            roomId: room.id,
            roomName: room.name,
            profileImageSource: room.profileImageSource ?? '',
            personaCount: room.personaCount,
            date: new Date(lastMessageDate),
            messageText: content,
            unReadCount: room.lastNotification?.count,
          });
        }
      });
      setRoomList(roomSearchList);
      setLoaded(true);
    }, 700);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [keyword]);

  if (!loaded)
    return (
      <S.SearchListDiv>
        <S.ListHeader>
          <S.HeaderText>대화방</S.HeaderText>
        </S.ListHeader>
        <S.LoadingWrapper>{loader}</S.LoadingWrapper>
      </S.SearchListDiv>
    );

  return (
    <S.SearchListDiv>
      <S.ListHeader>
        <S.HeaderText>대화방</S.HeaderText>
      </S.ListHeader>
      {roomList.length === 0 ? (
        <S.NoSearchText>{'검색 결과가 없습니다.'}</S.NoSearchText>
      ) : (
        <S.ListWrapper>
          {roomList.map((room) => (
            <RoomItem
              key={room.roomId}
              keyword={keyword}
              room={room}
              onRunApp={onRunApp}
            />
          ))}
        </S.ListWrapper>
      )}
    </S.SearchListDiv>
  );
});

export default GeneralRoomSearchList;
