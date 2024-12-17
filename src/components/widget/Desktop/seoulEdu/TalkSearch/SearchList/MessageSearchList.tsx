import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { RunAppOptions } from '@shell/sdk';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useCoreStore } from '@wapl/core';
import { observer } from 'mobx-react-lite';

import { MessageModel } from '@/models';
import { useStore } from '@/stores';
import {
  parseContentRoomMessage,
  timeStampFormat,
  unescapeHtml,
} from '@/utils';

import RoomItem, { RoomItemType } from '../RoomItem';

import * as S from './styled';

interface TalkRoomListProps {
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

const MessageSearchList = observer((props: TalkRoomListProps) => {
  const { keyword, loader, onRunApp } = props;

  const { roomStore } = useCoreStore();
  const { messageStore } = useStore();

  const [loaded, setLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messageList, setMessageList] = useState<MessageModel[]>([]);
  const [roomList, setRoomList] = useState<RoomItemType[]>([]);
  // const [startDate, setStartDate] = useState(new Date());
  // const [endDate, setEndDate] = useState(new Date());
  const [hasMore, setHasMore] = useState(false);

  const parentRef = useRef<HTMLDivElement>(null);
  const bottomSentinelRef = useRef<HTMLDivElement>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const rowVirtualizer = useVirtualizer({
    count: messageList.length,
    getItemKey: useCallback(
      (index: number) =>
        `${messageList[index].msgId}_${messageList[index].roomId}`,
      [messageList],
    ),
    getScrollElement: () => parentRef.current,
    estimateSize: () => 68,
  });

  const prependLowerItems = async () => {
    if (hasMore) {
      setIsLoading(true);
      await roomStore.fetchRoomList({
        appId: 'tmax.core-ai.talk',
      });
      const roomInfo = roomStore.roomList.map((room) => {
        return {
          roomId: room.id,
          roomEnterTime: room.myInfo?.joinDate as string,
        };
      });
      const lastRoomId = messageList[messageList.length - 1].roomId;
      const lastMsgId = messageList[messageList.length - 1].msgId;
      const res = await messageStore.searchTotalMessages({
        roomInfos: roomInfo,
        keyword: keyword,
        size: 10,
        ...(lastRoomId && { lastRoomId }),
        ...(lastMsgId && { lastMsgId }),
      });
      if (!res) {
        setIsLoading(false);
        setHasMore(false);
        return;
      }
      const { hasMore: hasMoreRes, messageList: messageRes } = res;

      const tempRoomList: RoomItemType[] = [];
      await messageRes.forEach(async (message) => {
        const room = roomStore.getRoomById(message.roomId);
        if (!room) return null;
        const lastMessageDate = timeStampFormat(
          message.createdAt,
          'YYYY-MM-DD HH:mm:ss',
        );
        const content = await parseContentRoomMessage(
          message.msgBody,
          message.msgTypeNumber(),
          message.isDeleted as 0 | 1 | -1,
        );
        tempRoomList.push({
          roomId: room.id,
          msgId: message.msgId,
          roomName: room.name,
          profileImageSource: room.profileImageSource ?? '',
          personaCount: room.personaCount,
          date: new Date(lastMessageDate),
          messageText: unescapeHtml(content),
        });
      });
      setRoomList(roomList.concat(tempRoomList));
      setMessageList(messageList.concat(messageRes));
      setHasMore(hasMoreRes);
      setIsLoading(false);
    }
  };

  const getHeight = () => {
    if (roomList.length < 3) return 68 * roomList.length;
    else return 204;
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (isLoading) return;
          if (entry.isIntersecting) {
            prependLowerItems();
          }
        });
      },
      { root: parentRef.current, threshold: 0.5 },
    );

    if (bottomSentinelRef.current) {
      observer.observe(bottomSentinelRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [messageList, isLoading, hasMore, keyword, prependLowerItems]);

  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    const finalizeRequest = () => {
      setLoaded(true);
      setRoomList([]);
      setMessageList([]);
      setHasMore(false);
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
      const roomInfo = roomStore.roomList.map((room) => {
        return {
          roomId: room.id,
          roomEnterTime: room.myInfo?.joinDate as string,
        };
      });
      const res = await messageStore.searchTotalMessages({
        roomInfos: roomInfo,
        keyword: keyword,
        size: 10,
      });
      if (!res) {
        finalizeRequest();
        return;
      }
      const { hasMore: hasMoreRes, messageList: messageRes } = res;
      const tempRoomList: RoomItemType[] = [];
      await messageRes.forEach(async (message) => {
        const room = roomStore.getRoomById(message.roomId);
        if (!room) return null;
        const lastMessageDate = timeStampFormat(
          message.createdAt,
          'YYYY-MM-DD HH:mm:ss',
        );
        const content = await parseContentRoomMessage(
          message.msgBody,
          message.msgTypeNumber(),
          message.isDeleted as 0 | 1 | -1,
        );
        tempRoomList.push({
          roomId: room.id,
          msgId: message.msgId,
          roomName: room.name,
          profileImageSource: room.profileImageSource ?? '',
          personaCount: room.personaCount,
          date: new Date(lastMessageDate),
          messageText: unescapeHtml(content),
        });
      });
      setRoomList(tempRoomList);
      setMessageList(messageRes);
      setHasMore(hasMoreRes);
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
          <S.HeaderText>대화 내용</S.HeaderText>
        </S.ListHeader>
        <S.LoadingWrapper>{loader}</S.LoadingWrapper>
      </S.SearchListDiv>
    );

  return (
    <S.SearchListDiv>
      <S.ListHeader>
        <S.HeaderText>대화 내용</S.HeaderText>
      </S.ListHeader>
      {roomList.length === 0 ? (
        <S.NoSearchText>{'검색 결과가 없습니다.'}</S.NoSearchText>
      ) : (
        <div
          ref={parentRef}
          style={{
            height: getHeight(),
            width: '100%',
            overflow: 'auto',
            contain: 'strict',
          }}
        >
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${
                  rowVirtualizer.getVirtualItems()[0]?.start ?? 0
                }px)`,
              }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualRow) => (
                <div
                  key={`${messageList[virtualRow.index].msgId}_${
                    messageList[virtualRow.index].roomId
                  }`}
                  data-index={virtualRow.index}
                  ref={async (el) => {
                    if (el) rowVirtualizer.measureElement(el);
                  }}
                >
                  <RoomItem
                    keyword={keyword}
                    room={roomList[virtualRow.index]}
                    onRunApp={onRunApp}
                  />
                </div>
              ))}
            </div>
            <div
              ref={bottomSentinelRef}
              style={{
                height: '1px',
                width: '100%',
                position: 'absolute',
                bottom: '0',
              }}
            />
          </div>
        </div>
      )}
    </S.SearchListDiv>
  );
});

export default MessageSearchList;
