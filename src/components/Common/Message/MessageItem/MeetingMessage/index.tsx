import React from 'react';

import { useShell } from '@shell/sdk';
import { useCoreStore } from '@wapl/core';
import { Icon, useTheme } from '@wapl/ui';

import { MessageModel } from '@/models';
import { useStore } from '@/stores';
import { timeStampFormatDuration } from '@/utils';
import { isMobile } from '@/utils';
import { AppIds } from '@types';

import MetaTagMessage from '../MetaTagMessage';

import * as S from './styled';

interface MeetingMessageProps {
  message: MessageModel;
  msgId: number;
  isReply?: boolean;
}

function MeetingMessage(props: MeetingMessageProps) {
  const { message, msgId, isReply = false } = props;

  const shell = useShell();
  const { configStore } = useStore();
  const { roomStore } = useCoreStore();
  const { Color } = useTheme();

  const msgBody = isReply ? message.parentBody?.msgBody : message.msgBody;

  const content = (
    <S.MeetingDateTime>{`${timeStampFormatDuration(
      msgBody?.meetingBody?.startTime ?? '',
      msgBody?.meetingBody?.endTime ?? '',
    )}`}</S.MeetingDateTime>
  );

  const handleClickButton = async () => {
    if (isReply) return;
    if (isMobile()) {
      try {
        await shell.runApp({
          appId: `${AppIds.MEETING}`,
          args: {
            roomId: roomStore.currentRoomId,
            metaMessage: false,
            meetingId: msgBody?.meetingId ?? -1,
          },
        });
        shell.mobile.mobileUi.showGnb();
      } catch {
        console.log('error: handleClickMeeting');
      }
    } else
      try {
        shell.runApp({
          appId: `${AppIds.MEETING}`,
          args: {
            roomId: roomStore.currentRoomId,
            metaMessage: false,
            meetingId: msgBody?.meetingId ?? -1,
          },
          options: { isWindow: true },
        });
      } catch {
        console.log('error: handleClickMeeting');
      }
  };

  if (msgBody?.meetingType === 'START') {
    return (
      <MetaTagMessage
        notiText={'회의를 시작합니다.'}
        onClick={handleClickButton}
        isReply={isReply}
        title={msgBody?.meetingBody?.meetingRoomName ?? ''}
        titleLimit={1}
        msgId={msgId}
        hasBottom={true}
        bottomText={`${configStore.AppNames.Meeting} 참여하기`}
        bottomIcon={
          <Icon.MeetingLine width={16} height={16} color={Color.Gray[900]} />
        }
      />
    );
  } else if (msgBody?.meetingType === 'CREATE') {
    return (
      <MetaTagMessage
        notiText={'회의가 예약되었습니다.'}
        isReply={isReply}
        title={msgBody?.meetingBody?.meetingRoomName ?? ''}
        titleLimit={1}
        msgId={msgId}
        content={content}
        hasBottom={false}
      />
    );
  } else if (msgBody?.meetingType === 'UPDATE') {
    <MetaTagMessage
      notiText={'회의 일정이 변경되었습니다.'}
      isReply={isReply}
      title={msgBody?.meetingBody?.meetingRoomName ?? ''}
      titleLimit={1}
      msgId={msgId}
      content={content}
      hasBottom={false}
    />;
  } else if (msgBody?.meetingType === 'END') {
    return (
      <MetaTagMessage
        notiText={'회의가 종료되었습니다.'}
        isReply={isReply}
        title={msgBody?.meetingBody?.meetingRoomName ?? ''}
        titleLimit={1}
        msgId={msgId}
        hasBottom={false}
      />
    );
  }
  return <></>;
}

export default MeetingMessage;
