import { useCallback } from 'react';

import { useCoreStore } from '@wapl/core';
import { Icon } from '@wapl/ui';
import { observer } from 'mobx-react-lite';

import { LinkModel, MessageModel } from '@/models';
import { useStore } from '@/stores';
import { copyToClipboard } from '@/utils';

import * as S from './Styled';

const LinkMoreMenu = observer(() => {
  const { uiStore, linkStore, messageStore } = useStore();
  const { userStore } = useCoreStore();

  const handleCloseMenu = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    linkStore.setAnchorMenu(null);
    linkStore.setSelectedLink(null);
  };

  const handleClickDeliver = (e: React.MouseEvent<HTMLElement>) => {
    const dto = {
      ...(linkStore.selectedLink as LinkModel),
      msgBody: {
        content: linkStore.selectedLink?.ogUrl,
        ogUrl: linkStore.selectedLink?.ogUrl,
      },
      msgType: 129,
      rawContent: linkStore.selectedLink?.ogUrl || '',
      isDeleted: 0,
    };
    const message = new MessageModel(dto);
    messageStore.setHoveredMessage(message);
    uiStore.openDialog('deliver');
    handleCloseMenu(e);
  };

  const handleClickCopy = async (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    try {
      await copyToClipboard(linkStore.selectedLink?.ogUrl || '');
      uiStore.openToast('링크가 복사되었습니다.');
    } catch (error) {
      console.log(error);
    } finally {
      handleCloseMenu(e);
    }
  };

  const handleClickDelete = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      e.stopPropagation();
      linkStore.setSelectedLink(linkStore.selectedLink as LinkModel);
      uiStore.openDialog('confirmLinkDelete');
    },
    [uiStore],
  );

  const enableDeleteLink =
    userStore.selectedPersona?.id === linkStore.selectedLink?.personaId;

  return (
    <S.MenuWrapper>
      <S.Menu
        anchorEl={linkStore.anchorMenu}
        open={Boolean(linkStore.anchorMenu)}
        onClose={handleCloseMenu}
      >
        <S.MenuItem onClick={handleClickDeliver}>
          <Icon.DeliverLine width={16} height={16} />
          <S.MenuItemText>{'전달'}</S.MenuItemText>
        </S.MenuItem>
        <S.MenuItem onClick={handleClickCopy}>
          <Icon.CopyLine width={16} height={16} />
          <S.MenuItemText>{'복사'}</S.MenuItemText>
        </S.MenuItem>

        {enableDeleteLink && (
          <S.MenuItem onClick={handleClickDelete}>
            <Icon.DeleteLine width={16} height={16} />
            <S.MenuItemText>{'삭제'}</S.MenuItemText>
          </S.MenuItem>
        )}
      </S.Menu>
    </S.MenuWrapper>
  );
});

export default LinkMoreMenu;
