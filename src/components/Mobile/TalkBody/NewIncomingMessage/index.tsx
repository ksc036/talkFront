import { useEffect, useState } from 'react';

import { useCoreStore } from '@wapl/core';
import { Icon, useTheme } from '@wapl/ui';
import { observer } from 'mobx-react';

import Mention from '@/components/Common/Message/MessageItem/PlainMessage/Mention';
import UserProfile from '@/components/Common/Message/UserProfile';
import { MessageModel } from '@/models';
import {
  generateRoleMessage,
  generateVOCMessage,
  isJsonString,
  unescapeHtml,
} from '@/utils';
import { getHTMLStringText } from '@/utils/editor';
import * as T from '@types';

import * as S from './styled';

interface NewIncomingMessageProps {
  message: MessageModel;
}

const NewIncomingMessage = observer((props: NewIncomingMessageProps) => {
  const { message } = props;
  const { personaStore } = useCoreStore();
  const { Color } = useTheme();
  const [botTitle, setBotTitle] = useState('');
  //   const isBlocked = personaStore.getPersona(
  //     message.personaId as number,
  //   )?.isBlocked;

  useEffect(() => {
    if (message.msgType.includes('bot')) {
      switch (message.msgBody.botType) {
        case 'voc':
          setBotTitle(
            generateVOCMessage(
              message.msgBody.vocType,
              message.msgBody.vocBody?.vocId,
            ).title,
          );
          break;
        case 'role':
          const getRoleBotTitle = async () => {
            const tempTitle = (
              await generateRoleMessage(
                message.msgBody.roleType as T.RoleType,
                message.msgBody.roleBody as T.RoleBody,
              )
            ).title;
            setBotTitle(tempTitle);
          };
          getRoleBotTitle();
          break;
      }
    }
  }, [message]);

  // msgType === text 이면서 멘션, 이모티콘이 한 줄에 섞여있을 경우 필요
  const messageContent = (content: string): React.ReactNode[] => {
    const firstLine = [content?.split('\n')[0] ?? ''];
    return firstLine?.map((message, index) => {
      const parsedMessage = message
        .split(/[<>]/g)
        .filter((item) => item !== null && item !== undefined)
        .map((item) => unescapeHtml(item));

      return (
        <S.Message key={index}>
          {parsedMessage?.map((message, index) => {
            const jsonObj = isJsonString(message);
            if (jsonObj?.type === 'mention') {
              return (
                <Mention
                  key={index}
                  userName={jsonObj?.mentionName}
                  personaId={jsonObj?.mentionId}
                />
              );
            } else if (jsonObj?.type === 'emoticon') {
              return '이모티콘';
            }
            return message;
          })}
        </S.Message>
      );
    });
  };

  const handleMeetingMessage = (): React.ReactNode => {
    switch (message.msgBody.meetingType) {
      case 'START':
        return <S.Message>회의를 시작합니다.</S.Message>;
      default:
        return <S.Message>회의가 종료되었습니다.</S.Message>;
    }
  };

  const handleMailMessage = (): React.ReactNode => {
    switch (message.msgBody.mailStateType) {
      case 'RECEIVE':
        return <S.Message>메일이 수신되었습니다.</S.Message>;
      case 'SEND':
        return <S.Message>메일이 전송되었습니다.</S.Message>;
      default:
        return null;
    }
  };

  const handleCalendarMessage = (): React.ReactNode => {
    switch (message.msgBody.eventType) {
      case 'SHARE':
        return <S.Message>일정이 공유되었습니다.</S.Message>;
      case 'DELETE':
        return <S.Message>일정이 취소되었습니다.</S.Message>;
      case 'CREATE':
        return <S.Message>일정이 생성되었습니다.</S.Message>;
      case 'START_NOTI':
        return (
          <S.Message>
            일정이 시작되기 {message.msgBody?.notiTime} 입니다.
          </S.Message>
        );
      case 'START':
        return <S.Message>일정이 지금 시작되었습니다.</S.Message>;
      default:
        return null;
    }
  };

  const getMessageContent = (): React.ReactNode => {
    // if (isBlocked) {
    //   return '차단된 유저의 메시지 입니다.';
    // } else {
    if (message.isDeleted === 1) {
      return <S.Message>삭제된 메시지입니다.</S.Message>;
    } else if (message.isDeleted >= 2) {
      return <S.Message>신고에 의해 블라인드 처리된 메시지입니다.</S.Message>;
    } else {
      switch (true) {
        case message.msgType.includes('editor'):
          return getHTMLStringText(message.msgBody.content as string);
        case message.msgType.includes('text') ||
          message.msgType.includes('url'):
          return messageContent(message.msgBody.content as string);
        case message.msgType.includes('notice') &&
          message.msgType.includes('vote'):
          return (
            <S.Message>{message.msgBody.noticeBody?.voteBody?.title}</S.Message>
          );
        case message.msgType.includes('notice'):
          return messageContent(message.msgBody.noticeBody?.content as string);
        case message.msgType.includes('vote'):
          return <S.Message>{message.msgBody.voteBody?.title}</S.Message>;
        case message.msgType.includes('file'):
          return <S.Message>파일</S.Message>;
        case message.msgType.includes('image'):
          return <S.Message>이미지</S.Message>;
        case message.msgType.includes('video'):
          return <S.Message>동영상</S.Message>;
        case message.msgType.includes('sticker'):
          return <S.Message>이모티콘</S.Message>;
        case message.msgType.includes('meeting'):
          return handleMeetingMessage();
        case message.msgType.includes('mail'):
          return handleMailMessage();
        case message.msgType.includes('bot'):
          return <S.Message>{botTitle}</S.Message>;
        case message.msgType.includes('calendar'):
          return handleCalendarMessage();
      }
      // }
    }
  };

  return (
    <S.ScrollToNewMsgButtonWrapper>
      <UserProfile personaId={message.personaId as number} />
      <S.UserNameMessageWrapper>
        <S.UserName>
          {personaStore.getPersona(message.personaId as number)?.nick}
        </S.UserName>
        <S.Message>{getMessageContent()}</S.Message>
      </S.UserNameMessageWrapper>
      <Icon.ArrowBottomLine width={24} height={24} color={Color.Gray[600]} />
    </S.ScrollToNewMsgButtonWrapper>
  );
});
export default NewIncomingMessage;
