import { ReactNode, useEffect, useState } from 'react';

import { RunAppOptions } from '@shell/sdk';
import { useCoreStore } from '@wapl/core';
import { observer } from 'mobx-react-lite';

import { useMomentInit } from '@/hooks/useMomentInit';

import GeneralRoomSearchList from './SearchList/GeneralRoomSearchList';
import MessageSearchList from './SearchList/MessageSearchList';
import OpenRoomSearchList from './SearchList/OpenRoomSearchList';
import * as S from './styled';

interface TalkSearchProps {
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

const TalkSearch = observer((props: TalkSearchProps) => {
  const { keyword, loader, onRunApp } = props;
  const { roomStore } = useCoreStore();

  const [loaded, setLoaded] = useState(false);

  const fetchMyRoomList = async () => {
    // 내가 속한 룸 id, roomEnterTime 받아오기.
    await roomStore.fetchRoomList({
      appId: 'tmax.core-ai.talk',
    });
  };

  useMomentInit();

  useEffect(() => {
    (async () => {
      if (roomStore.roomList.length === 0) {
        setLoaded(false);
        await fetchMyRoomList();
      }
      setLoaded(true);
    })();
  }, []);

  if (!loaded) return <>{loader}</>;

  return (
    <S.Wrapper>
      <GeneralRoomSearchList
        keyword={keyword}
        loader={loader}
        onRunApp={onRunApp}
      />
      <OpenRoomSearchList
        keyword={keyword}
        loader={loader}
        onRunApp={onRunApp}
      />
      <MessageSearchList
        keyword={keyword}
        loader={loader}
        onRunApp={onRunApp}
      />
    </S.Wrapper>
  );
});

export default TalkSearch;
