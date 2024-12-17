import React, { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useCoreStore } from '@wapl/core';
import { Icon, Squircle, useTheme } from '@wapl/ui';
import { observer } from 'mobx-react';
import { useLongPress } from 'use-long-press';

import MessageItem from '@/components/Common/Message/MessageItem';
import BlindedMessage from '@/components/Common/Message/MessageItem/BlindedMessage';
import DeletedMessage from '@/components/Common/Message/MessageItem/DeletedMessage';
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
  const { messageStore, configStore } = useStore();
  const { userStore, roomStore, personaStore } = useCoreStore();
  const navigate = useNavigate();
  const { hash } = useLocation();
  const { Color } = useTheme();

  const roomMember = roomStore
    .getRoomById(roomStore.currentRoomId as number)
    ?.getMemberById(message.personaId);

  const persona = personaStore.getPersona(message.personaId);

  const isMine =
    message.personaId === (userStore.selectedPersona?.id as number);

  const handleDeleteCheckChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.checked) {
      messageStore.checkDeleteMessage(message.msgId);

      if (message?.msgBody?.files) {
        messageStore.checkDeleteMessageDocuments({
          msgId: message.msgId,
          documentIds: message?.msgBody?.files?.map((file) => Number(file.id)),
        });
      }
    } else {
      messageStore.uncheckDeleteMessage(message.msgId);

      if (message?.msgBody?.files) {
        messageStore.uncheckDeleteMessageDocuments(message.msgId);
      }
    }
  };

  const onOpen = useCallback(() => {
    if (!message.isDeleted && !message.msgType.includes('autoMsg')) {
      messageStore.setHoveredMessageId(message.msgId);
      messageStore.setHoveredMessage(message);
      navigate(`/talk/${roomStore.currentRoomId}#message-context-menu`);
    }
  }, []);

  const bind = useLongPress(onOpen, {
    threshold: 500,
    captureEvent: true,
    cancelOnMovement: true,
  });

  // const isOpenRoom = false; // true
  // const currentRoom = roomStore.getRoomById(roomStore.currentRoomId as number);
  // const personaCount = currentRoom?.personaCount;
  // const getUnread = () => {
  //   if (!isOpenRoom || !personaCount) return message.unReadCount;
  //   const unReadPercent = (message.unReadCount / personaCount) * 100;
  //   return unReadPercent.toFixed(0) + '%';
  // };

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
      <S.MessageWrapper isMine={isMine} isHead={message.isHead}>
        {!isMine && (
          <div style={{ minWidth: '32px' }}>
            {message.isHead &&
              (message.msgBody?.mailStateType !== 'RECEIVE' ? (
                <UserProfile personaId={message.personaId} />
              ) : (
                <Squircle
                  size={32}
                  color={configStore.MyMessageStyle.BackgroundColor}
                  icon={
                    <Icon.MailFill
                      width={20}
                      height={20}
                      color={Color.White[50]}
                    />
                  }
                />
              ))}
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
          <S.Message {...bind()} isMine={isMine}>
            {message.isDeleted === 0 && <MessageItem message={message} />}
            {message.isDeleted === 1 && <DeletedMessage isMine={isMine} />}
            {(message.isDeleted === 2 || message.isDeleted === 3) && (
              <BlindedMessage isMine={isMine} deletedFrom={message.isDeleted} />
            )}
            {hash === '#delete-mode' && !message.isDeleted && isMine && (
              <S.DeleteCheckBox
                checked={messageStore.deleteMessageIdList.includes(
                  message.msgId,
                )}
                onChange={handleDeleteCheckChange}
              />
            )}
          </S.Message>
          {!message.isDeleted && (
            <ReactionChip messageId={message.msgId} isMyMsg={isMine} />
          )}
        </S.MessageBodyWrapper>
      </S.MessageWrapper>
    </>
  );
});

export default Message;
