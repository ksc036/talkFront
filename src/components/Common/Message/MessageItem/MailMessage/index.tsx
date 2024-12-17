import React from 'react';

import { useCoreStore } from '@wapl/core';
import { Avatar, Icon, Squircle, useTheme } from '@wapl/ui';
import { observer } from 'mobx-react-lite';

import { MessageModel } from '@/models';
import { useStore } from '@/stores';

import MetaTagMessage from '../MetaTagMessage';
import PlainMessage from '../PlainMessage';

import * as S from './styled';

interface MailMessageProps {
  msgId: number;
  msgBody: MessageModel['msgBody'];
  isReply?: boolean;
  isMailReply?: boolean;
  isMine?: boolean;
}

const MailMessage = observer((props: MailMessageProps) => {
  const { msgId, msgBody, isReply, isMailReply, isMine } = props;
  const { Color } = useTheme();
  const { configStore, uiStore } = useStore();
  const { roomStore } = useCoreStore();

  const mailText =
    msgBody.mailStateType === 'SEND'
      ? '메일이 전송되었습니다.'
      : '메일이 수신되었습니다.';

  const handleClickMailMessage = async () => {
    if (isReply) return;
    uiStore.setMailDialogMode('read');
    uiStore.setMailViewId(msgBody.mailId ?? -1);
    uiStore.openDialog('mail');
  };

  const imgSrc =
    roomStore.getRoomById(msgBody.roomId as number)?.profileImageSource ?? null;

  const senderName =
    roomStore.getRoomById(msgBody.roomId as number)?.name ??
    msgBody.senderName ??
    msgBody.exSenderName ??
    '';

  const content = (
    <S.MailProfileWrapper>
      <S.MailProfileImageWrapper>
        <S.MailProfileImage>
          {imgSrc || msgBody.exProfileUrl ? (
            <Avatar size={36} imgSrc={msgBody.exProfileUrl ?? imgSrc ?? ''} />
          ) : (
            <Squircle
              size={36}
              color={Color.Black[10]}
              icon={
                <Icon.UserFill width={24} height={24} color={Color.White[50]} />
              }
            />
          )}
        </S.MailProfileImage>
      </S.MailProfileImageWrapper>
      <div>
        {(msgBody.senderName || msgBody.exSenderName) && (
          <PlainMessage
            content={senderName}
            msgId={msgId}
            getShort={true}
            getLink={false}
            allowKeywordSearch={false}
          />
        )}
        {msgBody.exEmail && (
          <S.EmailText senderName={msgBody.exSenderName}>
            <PlainMessage
              content={msgBody.exEmail}
              msgId={msgId}
              getShort={true}
              getLink={false}
              allowKeywordSearch={false}
            />
          </S.EmailText>
        )}
      </div>
    </S.MailProfileWrapper>
  );

  if (isMailReply) {
    return (
      <S.MailReplyWrapper
        msgTipUrl={
          isMine
            ? configStore.MyMessageStyle.BackgroundColor
            : configStore.OtherMessageStyle.BackgroundColor
        }
        isMine={isMine}
        style={{
          backgroundColor: isMine
            ? configStore.MyMessageStyle.BackgroundColor
            : configStore.OtherMessageStyle.BackgroundColor,
        }}
      >
        <Icon.MailLine width={18} height={18} />
        {msgBody.title}
      </S.MailReplyWrapper>
    );
  }

  return (
    <MetaTagMessage
      notiText={mailText}
      onClick={handleClickMailMessage}
      isReply={isReply}
      title={msgBody.title ?? ''}
      titleLimit={1}
      msgId={msgId}
      content={msgBody.mailStateType === 'RECEIVE' ? content : null}
      hasBottom={true}
      bottomText={'메일 확인하기'}
      bottomIcon={<Icon.MailLine width={16} height={16} />}
    />
  );
});

export default MailMessage;
