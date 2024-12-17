import React from 'react';

import { Icon } from '@wapl/ui';
import { useObserver } from 'mobx-react';
import { observer } from 'mobx-react-lite';

import { useStore } from '@/stores';

import ReplyContents from './ReplyContents';
import ReplyThumbnail from './ReplyThumbnail';
import * as S from './Styled';

const ReplyInfo = observer(() => {
  const { messageStore, uiStore } = useStore();
  const targetMessage = useObserver(() => messageStore.replyMessage);

  const handleCancel = () => {
    messageStore.clearReplyMessage();
    uiStore.setReplyVisible(false);
  };

  return (
    <>
      {targetMessage && (
        <S.Wrapper>
          <ReplyThumbnail targetMessage={targetMessage} />
          <ReplyContents targetMessage={targetMessage} />
          <S.CloseButton onClick={handleCancel}>
            <Icon.CloseLine width={20} height={20} />
          </S.CloseButton>
        </S.Wrapper>
      )}
    </>
  );
});

export default ReplyInfo;
