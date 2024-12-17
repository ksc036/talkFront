import React from 'react';

import { useCoreStore } from '@wapl/core';
import { Icon, useTheme, Tooltip } from '@wapl/ui';
import { useObserver } from 'mobx-react-lite';

import { useStore } from '@/stores';
import * as T from '@types';

import * as S from './styled';

interface ReplyButtonProps {
  messageId: T.MessageId;
}

const ReplyButton = (props: ReplyButtonProps) => {
  const { messageId } = props;
  const { messageStore, uiStore, getEditorStore, configStore } = useStore();
  const { roomStore } = useCoreStore();
  const currentRoomId = useObserver(() => roomStore.currentRoomId) as number;
  const editorStore = getEditorStore(currentRoomId);
  const theme = useTheme();

  const handleReply = () => {
    uiStore.setReplyVisible(true);
    messageStore.setReplyMessage(messageId);
    editorStore.focus();
  };

  return (
    <Tooltip
      title="답장"
      sx={{
        '.MuiTooltip-tooltip': {
          color: theme.Color.Background[0],
          backgroundColor: theme.Color.Gray[900],
        },
      }}
    >
      <S.ReplyButton onClick={handleReply}>
        <Icon.ReplyLine
          width={20}
          height={20}
          color={configStore.MessageMenuStyle.IconColor}
        />
      </S.ReplyButton>
    </Tooltip>
  );
};

export default ReplyButton;
