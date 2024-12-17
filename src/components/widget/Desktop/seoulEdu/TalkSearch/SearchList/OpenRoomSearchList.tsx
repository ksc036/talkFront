import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { RunAppOptions } from '@shell/sdk';
import { useVirtualizer } from '@tanstack/react-virtual';
import { RoomModel, useCoreStore } from '@wapl/core';
import { observer } from 'mobx-react-lite';

import RoomItem, { RoomItemType } from '../RoomItem';

import * as S from './styled';

interface OpenRoomListProps {
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

const OpenRoomSearchList = observer((props: OpenRoomListProps) => {
  const { keyword, loader, onRunApp } = props;

  const { roomStore } = useCoreStore();

  const [page, setPage] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [roomList, setRoomList] = useState<RoomItemType[]>([]);
  const [hasMore, setHasMore] = useState(false);

  const parentRef = useRef<HTMLDivElement>(null);
  const bottomSentinelRef = useRef<HTMLDivElement>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const rowVirtualizer = useVirtualizer({
    count: roomList.length,
    getItemKey: useCallback(
      (index: number) => `${roomList[index].roomId}`,
      [roomList],
    ),
    getScrollElement: () => parentRef.current,
    estimateSize: () => 68,
  });

  const prependLowerItems = async () => {
    if (hasMore) {
      setIsLoading(true);
      const { isEnd, contents } = await roomStore.fetchRoomSearchList({
        appId: 'tmax.core-ai.talk',
        keyword: keyword,
        roomTypeIdList: [2],
        page: page + 1,
        size: 10,
        sort: [
          { col: 'roomRegiDate', order: 'desc' },
          { col: 'roomName', order: 'asc' },
        ],
      });
      setPage(page + 1);

      if (contents.length === 0) {
        setLoaded(true);
        setRoomList([]);
        return;
      }
      const roomSearchList: RoomItemType[] = [];

      contents.forEach((room) => {
        const roomModel = new RoomModel({
          ...room.roomInfo.room,
          representativeMemberList: room.roomInfo.representativeMemberInfoList,
        });
        const hashTagString = room.hashtagNameList
          ? room.hashtagNameList.map((hash) => `#${hash}`).join(' ')
          : '';
        roomSearchList.push({
          roomId: roomModel.id,
          roomName: roomModel.name,
          profileImageSource: roomModel.profileImageSource ?? '',
          personaCount: roomModel.personaCount,
          hashTag: hashTagString,
        });
      });
      setRoomList(roomList.concat(roomSearchList));
      setHasMore(!isEnd);
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
  }, [isLoading, hasMore, keyword, prependLowerItems]);

  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    const finalizeRequest = () => {
      setLoaded(true);
      setRoomList([]);
    };

    debounceTimeout.current = setTimeout(async () => {
      if (keyword.length === 0) {
        finalizeRequest();
        return;
      }

      setLoaded(false);
      setPage(0);
      const { isEnd, contents } = await roomStore.fetchRoomSearchList({
        appId: 'tmax.core-ai.talk',
        keyword: keyword,
        roomTypeIdList: [2],
        page: 0,
        size: 10,
        sort: [{ col: 'roomRegiDate', order: 'desc' }],
      });
      if (contents.length === 0) {
        finalizeRequest();
        return;
      }
      const roomSearchList: RoomItemType[] = [];
      contents.forEach((room) => {
        const roomModel = new RoomModel({
          ...room.roomInfo.room,
          representativeMemberList: room.roomInfo.representativeMemberInfoList,
        });
        const hashTagString = room.hashtagNameList
          ? room.hashtagNameList.map((hash) => `#${hash}`).join(' ')
          : '';
        roomSearchList.push({
          roomId: roomModel.id,
          roomName: roomModel.name,
          profileImageSource: roomModel.profileImageSource ?? '',
          personaCount: roomModel.personaCount,
          hashTag: hashTagString,
        });
      });
      setRoomList(roomSearchList);
      setHasMore(!isEnd);
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
          <S.HeaderText>오픈 대화방</S.HeaderText>
        </S.ListHeader>
        <S.LoadingWrapper>{loader}</S.LoadingWrapper>
      </S.SearchListDiv>
    );

  return (
    <S.SearchListDiv>
      <S.ListHeader>
        <S.HeaderText>오픈 대화방</S.HeaderText>
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
                  key={`${roomList[virtualRow.index].roomId}`}
                  data-index={virtualRow.index}
                  ref={async (el) => {
                    if (el) rowVirtualizer.measureElement(el);
                  }}
                >
                  <RoomItem
                    keyword={keyword}
                    room={roomList[virtualRow.index]}
                    isOpenRoom={true}
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

export default OpenRoomSearchList;
