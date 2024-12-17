import { useCallback } from 'react';

import { useCoreStore } from '@wapl/core';
import { observer } from 'mobx-react';

import MessageItem from '@/components/Common/Message/MessageItem';
import NewMessage from '@/components/Common/Message/MessageItem/NewMessage';
import SystemTime from '@/components/Common/Message/MessageItem/SystemTime';
import UserName from '@/components/Common/Message/UserName';
import UserProfile from '@/components/Common/Message/UserProfile';
import { MessageModel } from '@/models';
import { useStore } from '@/stores';

import ReactionChip from './ReactionChip';
import * as S from './styled';

interface MessageProps {
  message: MessageModel;
}

const Message = observer((props: MessageProps) => {
  const { message } = props;
  const { messageStore, uiStore } = useStore();
  const { userStore, personaStore, roomStore } = useCoreStore();

  const isMine =
    message.personaId === (userStore.selectedPersona?.id as number);

  // SAS 작업 필요: isBlocked를 PersonaModel이 아닌, 연락처를 통해 확인
  // const isSenderBlocked = personaStore.getPersona(message.personaId)?.isBlocked;
  // const isMessageMenuVisible = !message.isDeleted && !isSenderBlocked;
  const isMessageMenuVisible = !message.isDeleted;

  const roomMember = roomStore
    .getRoomById(roomStore.currentRoomId as number)
    ?.getMemberById(message.personaId);

  const persona = personaStore.getPersona(message.personaId);

  const handleMouseEnter = useCallback(() => {
    messageStore.setHoveredMessageId(message.msgId);
  }, []);
  const handleMouseLeave = useCallback((e: any) => {
    if (Math.abs(e.clientX - window.innerWidth) < 100) return;
    if (uiStore.desktopProfileAnchorEl) return;
    messageStore.setHoveredMessageId(-1);
  }, []);

  if (message.msgType.includes('autoMsg')) {
    return (
      <>
        {message.isFirst && <SystemTime time={message.createdAt} />}
        {messageStore.newMessageId === message.msgId && <NewMessage />}
        <MessageItem message={message} />
      </>
    );
  }

  return (
    <>
      {message.isFirst && <SystemTime time={message.createdAt} />}
      {messageStore.newMessageId === message.msgId && <NewMessage />}
      <S.Wrapper isMine={isMine}>
        <S.MessageWrapper isMine={isMine} isHead={message.isHead}>
          <S.MessageHoverWrapper
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {!isMine && (
              <div style={{ minWidth: '32px' }}>
                {message.isHead && (
                  <UserProfile personaId={message.personaId} />
                )}
              </div>
            )}
            <S.MessageBodyWrapper isMine={isMine}>
              {!isMine && message.isHead && (
                <UserName
                  userName={
                    roomMember
                      ? roomMember.personaNick
                      : persona
                      ? persona.nick
                      : ''
                  }
                />
              )}
              <S.Message isMine={isMine}>
                <MessageItem message={message} />
              </S.Message>
              {isMessageMenuVisible && (
                <ReactionChip messageId={message.msgId} isMyMsg={isMine} />
              )}
            </S.MessageBodyWrapper>
          </S.MessageHoverWrapper>
        </S.MessageWrapper>
      </S.Wrapper>
    </>
  );
});

export default Message;
