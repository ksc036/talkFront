import { useEffect, useCallback, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import { RoomMember, useCoreStore } from '@wapl/core';
import { observer } from 'mobx-react';

import UserListItems from '@/components/Common/UserListItems';

import * as S from './Styled';

interface NoneVotedUserListProps {
  noneVotedUserList: RoomMember[];
}

const NoneVotedUserList = observer((props: NoneVotedUserListProps) => {
  const { noneVotedUserList } = props;
  const [data, setData] = useState<RoomMember[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const initialFetchCount = 10;
  const { userStore } = useCoreStore();

  const fetchMoreData = useCallback(() => {
    const newData = noneVotedUserList.slice(
      data.length,
      data.length + initialFetchCount,
    );
    setData((prevData) => [...prevData, ...newData]);
    if (newData.length === 0) {
      setHasMore(false);
    }
  }, [data.length, noneVotedUserList]);

  useEffect(() => {
    fetchMoreData();
  }, []);

  if (noneVotedUserList.length === 0) {
    return <S.NoUser>미참여자가 없습니다.</S.NoUser>;
  }

  return (
    <S.InfiniteScrollWrapper id="scrollableDiv">
      <InfiniteScroll
        dataLength={data.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<></>}
        scrollableTarget="scrollableDiv"
      >
        <S.ItemWrapper>
          {noneVotedUserList.map((persona) => {
            return (
              <UserListItems
                personaId={persona.personaId}
                imgSrc={persona.profileImageFilepath ?? ''}
                isMine={
                  (userStore.selectedPersona?.id as number) ===
                  persona.personaId
                }
                nickName={persona.personaNick}
              />
            );
          })}
        </S.ItemWrapper>
      </InfiniteScroll>
    </S.InfiniteScrollWrapper>
  );
});

export default NoneVotedUserList;
