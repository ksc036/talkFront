import React from 'react';

import { useStore } from '@/stores';

import * as S from './styled';

interface BlindedMessageProps {
  isMine: boolean;
  deletedFrom: number;
}

const BlindedMessage = (props: BlindedMessageProps) => {
  const { isMine, deletedFrom } = props;
  const { configStore } = useStore();
  const blindMessage =
    deletedFrom === 2
      ? '방장이 블라인드 처리한 메시지입니다.'
      : '신고에 의해 블라인드 처리된 메시지입니다.';

  return isMine ? (
    <S.MyContentWrapper color={configStore.MyMessageStyle.BackgroundColor}>
      <S.MyMessage
        isDeleted={true}
        deletedColor={configStore.MyMessageStyle.DeletedMessageColor}
      >
        {blindMessage}
      </S.MyMessage>
    </S.MyContentWrapper>
  ) : (
    <S.OtherContentWrapper
      color={configStore.OtherMessageStyle.BackgroundColor}
    >
      <S.OtherMessage
        isDeleted={true}
        deletedColor={configStore.OtherMessageStyle.DeletedMessageColor}
      >
        {blindMessage}
      </S.OtherMessage>
    </S.OtherContentWrapper>
  );
};

export default BlindedMessage;
