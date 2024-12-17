import { useEffect } from 'react';
import { Virtuoso } from 'react-virtuoso';

import { useCoreStore } from '@wapl/core';
import { observer } from 'mobx-react-lite';

import { ConfirmDialog } from '@/components/Common/Dialog/ConfirmDialog';
import LinkDrawerHeader from '@/components/Desktop/LinkDrawer/LinkDrawerHeader';
import { LinkObjectModel } from '@/models';
import { useStore } from '@/stores';

import LinkDrawerFooter from './LinkDrawerFooter';
import LinkItems from './LinkItems';
import LinkMoreMenu from './LinkItems/LinkMoreMenu';
import * as S from './Styled';

const LinkDrawer = observer(() => {
  const { linkStore, uiStore } = useStore();
  const { roomStore } = useCoreStore();
  const downHasMore = linkStore.downHasMore;
  const allLinks = linkStore.links;

  useEffect(() => {
    linkStore.clear();
    linkStore.getLinks({});
    linkStore.clearCheckedLinks();
  }, [roomStore.currentRoomId]);

  const handleEndReached = () => {
    if (downHasMore)
      linkStore.getLinks({
        targetId: allLinks.slice(-1)[0]?.links.slice(-1)[0].linkId,
        msgId: allLinks.slice(-1)[0]?.links.slice(-1)[0].msgId,
      });
  };

  const handleClickCancel = () => {
    uiStore.closeDialog('confirmLinkDelete');
    linkStore.setAnchorMenu(null);
    linkStore.setSelectedLink(null);
  };

  const handleDeleteLinks = async () => {
    const res = await linkStore.deleteLinks({
      roomId: roomStore.currentRoomId as number,
      linkIds:
        linkStore.checkedLinks.length > 0
          ? linkStore.checkedLinks.map((checkedLink) => checkedLink.linkId)
          : ([linkStore.selectedLink?.linkId] as number[]),
    });

    if (res.data) {
      uiStore.closeDialog('confirmLinkDelete');
      uiStore.openToast(
        (linkStore.checkedLinks.length > 1
          ? `${linkStore.checkedLinks.length}개의 `
          : '') + '링크가 삭제되었습니다.',
      );
      linkStore.setAnchorMenu(null);
      linkStore.setSelectedLink(null);
      linkStore.clearCheckedLinks();
    }
  };

  return (
    <S.Layout>
      <LinkDrawerHeader />
      <LinkMoreMenu />

      <S.LinkBody>
        {allLinks.length > 0 ? (
          <Virtuoso
            className="linkDrawerVirtuoso"
            data={allLinks}
            endReached={handleEndReached}
            itemContent={(idx, data: LinkObjectModel) =>
              data.links.length > 0 && <LinkItems linkObject={data} />
            }
            components={{ List: S.ListContainer as any }}
          />
        ) : (
          <S.NoLinkWrapper>링크가 없습니다.</S.NoLinkWrapper>
        )}
      </S.LinkBody>

      <LinkDrawerFooter />

      <ConfirmDialog
        open={uiStore.confirmLinkDelete}
        title="링크 삭제"
        description={
          (linkStore.checkedLinks.length > 1
            ? `${linkStore.checkedLinks.length}개의 `
            : '') + '링크를 삭제하시겠습니까?\n삭제 후 복구할 수 없습니다.'
        }
        okText={'삭제'}
        onClickOk={handleDeleteLinks}
        isOkNegative={true}
        onClickCancel={handleClickCancel}
      />
    </S.Layout>
  );
});

export default LinkDrawer;
