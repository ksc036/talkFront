import React, { useEffect } from 'react';

import { useCoreStore } from '@wapl/core';
import { Icon, Squircle, useTheme } from '@wapl/ui';
import { observer } from 'mobx-react';

import { useStore } from '@/stores';

import NoticeEditor from './NoticeEditor';
import NoticeList from './NoticeList';
import NoticeRead from './NoticeRead';
import * as S from './styled';

interface NoticeDialogProps {
  open: boolean;
  onClose: () => void;
}

const NoticeDialog = observer((props: NoticeDialogProps) => {
  const { open, onClose } = props;
  const { uiStore, configStore, talkStore } = useStore();
  const { roomStore } = useCoreStore();
  const { Color } = useTheme();

  const handleCloseDialog = () => {
    onClose();
  };

  const handleAdd = () => {
    uiStore.setNoticeDialogMode('create');
  };

  const NoticeBody = () => {
    if (uiStore.noticeDialogMode === 'list') {
      return <NoticeList onClose={handleCloseDialog} />;
    } else if (uiStore.noticeDialogMode === 'read') {
      return <NoticeRead onClose={handleCloseDialog} />;
    } else if (
      uiStore.noticeDialogMode === 'create' ||
      uiStore.noticeDialogMode === 'update'
    ) {
      return <NoticeEditor onClose={handleCloseDialog} />;
    }
    return null;
  };

  useEffect(() => {
    if (open) {
      handleCloseDialog();
      uiStore.setNoticeDialogMode('list');
    }
  }, [roomStore.currentRoomId]);

  return (
    <S.NoticeDialog
      disableEnforceFocus
      disablePortal
      // PaperComponent={DraggablePaperComponent}
      open={open}
      width={360}
      isMini={talkStore.isMini}
      style={{
        top: 'calc(50% - 340px)',
        left: 'calc(50% - 230px)',
        height: 'fit-content',
        width: 'fit-content',
      }}
      onClose={handleCloseDialog}
    >
      <NoticeBody />
      {uiStore.noticeDialogMode === 'list' && (
        <S.AddButton onClick={handleAdd} aria-label="notice-add">
          <Squircle
            size={48}
            icon={
              <Icon.Add2Line width={24} height={24} color={Color.White[100]} />
            }
            color={configStore.MainColor}
          />
        </S.AddButton>
      )}
    </S.NoticeDialog>
  );
});

export default NoticeDialog;
