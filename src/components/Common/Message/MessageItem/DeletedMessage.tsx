import React, { useEffect, useState } from 'react';

import { useStore } from '@/stores';
import isDarkMode from '@/utils/darkModeDetect';

import * as S from './styled';

interface DeletedMessageProps {
  isMine: boolean;
  isReply?: boolean;
  // SAS 작업 필요: isBlocked를 PersonaModel이 아닌, 연락처를 통해 확인
  // isBlocked?: boolean;
}

const DeletedMessage = (props: DeletedMessageProps) => {
  // SAS 작업 필요: isBlocked를 PersonaModel이 아닌, 연락처를 통해 확인
  // const { isMine, isBlocked } = props;
  const { isMine, isReply } = props;
  const { configStore } = useStore();

  const [content, setContent] = useState('');

  useEffect(() => {
    // SAS 작업 필요: isBlocked를 PersonaModel이 아닌, 연락처를 통해 확인
    // if (isBlocked) {
    //   setContent('차단한 유저의 메시지입니다.');
    // } else {
    setContent('삭제된 메시지입니다');
    // }
  });

  return (
    <S.DeletedMessageWrapper isReply={isReply}>
      {isMine ? (
        <S.MyContentWrapper color={configStore.MyMessageStyle.BackgroundColor}>
          <S.MyMessage
            isDeleted={true}
            deletedColor={configStore.MyMessageStyle.DeletedMessageColor}
          >
            {content}
          </S.MyMessage>
        </S.MyContentWrapper>
      ) : (
        <S.OtherContentWrapper
          color={
            isDarkMode()
              ? '#3C4043'
              : configStore.OtherMessageStyle.BackgroundColor
          }
        >
          <S.OtherMessage
            isDeleted={true}
            deletedColor={configStore.OtherMessageStyle.DeletedMessageColor}
          >
            {content}
          </S.OtherMessage>
        </S.OtherContentWrapper>
      )}
    </S.DeletedMessageWrapper>
  );
};

export default DeletedMessage;
