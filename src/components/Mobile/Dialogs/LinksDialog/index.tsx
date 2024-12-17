import { useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { VirtuosoGrid } from 'react-virtuoso';

import { useCoreStore } from '@wapl/core';
// import { FullScreenDialog, useTheme } from '@wapl/ui';
import { observer } from 'mobx-react-lite';

// import DefaultHeader from '@/components/Mobile/Dialogs/LinksDialog/Header/DefaultHeader';
// import SearchHeader from '@/components/Mobile/Dialogs/LinksDialog/Header/SearchHeader';
// import LinkItem from '@/components/Mobile/Dialogs/LinksDialog/LinkItem';
import { useStore } from '@/stores';

// import * as S from './Styled';

const LinksDialog = observer(() => {
  const { linkStore } = useStore();
  const { roomStore } = useCoreStore();
  // const navigate = useNavigate();
  // const { pathname } = useLocation();
  // const downHasMore = linkStore.downHasMore;
  // const links = linkStore.links;
  // const theme = useTheme();

  useEffect(() => {
    linkStore.clear();
    linkStore.getLinks({});
  }, [roomStore.currentRoomId]);

  // const handleEndReached = () => {
  //   if (downHasMore)
  //     linkStore.getLinks({
  //       targetId: links[links.length - 1]?.linkId,
  //       msgId: links[links.length - 1]?.msgId,
  //     });
  // };

  return (
    // TODO: 링크 날짜별 분류 기능 모바일 전환 작업
    // <FullScreenDialog
    //   open={pathname.includes('links')}
    //   onClose={() => {
    //     navigate(-1);
    //   }}
    //   header={linkStore.isSearchMode ? <SearchHeader /> : <DefaultHeader />}
    //   sx={{
    //     '.MuiPaper-root': {
    //       background: theme.Color.Background[0],
    //     },
    //   }}
    // >
    //   <VirtuosoGrid
    //     data={links}
    //     endReached={handleEndReached}
    //     itemContent={(idx, data) => <LinkItem link={data} />}
    //     components={{
    //       List: S.ListContainer as any,
    //     }}
    //     listClassName="temp"
    //   />
    // </FullScreenDialog>
    <></>
  );
});

export default LinksDialog;
