import { useShell } from '@shell/sdk';
import { useCoreStore } from '@wapl/core';
import { Icon, useTheme } from '@wapl/ui';
import { observer } from 'mobx-react-lite';
import moment from 'moment-timezone';

import { MessageModel } from '@/models';
import { useStore } from '@/stores';
import { isMobile, timeStampFormatDuration } from '@/utils';
import { AppIds } from '@types';

import MetaTagMessage from '../MetaTagMessage';

import * as S from './styled';

interface CalendarMessageProps {
  message: MessageModel;
  isReply?: boolean;
}

const CalendarMessage = observer(
  ({ message, isReply }: CalendarMessageProps) => {
    const shell = useShell();
    const { messageStore } = useStore();
    const { roomStore } = useCoreStore();
    const { Color } = useTheme();

    const msgBody = isReply ? message.parentBody?.msgBody : message.msgBody;

    const addHours = (dateString?: string, addedHours?: number) => {
      if (dateString) {
        const date = new Date(dateString);

        if (addedHours) {
          date.setHours(date.getHours() + addedHours);
        }

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}`;
      } else {
        return undefined;
      }
    };

    const convertTime = (utcDateString?: string) => {
      const utcMoment = moment.tz(utcDateString, 'UTC');
      const clientTime = utcMoment
        .tz(messageStore.serverTimeZone ?? 'Asia/Seoul')
        .format('YYYY-MM-DD HH:mm');

      return clientTime;
    };

    const startTime = msgBody?.eventBody?.startTime ?? '';
    const endTime =
      (msgBody?.eventBody?.allDay
        ? addHours(msgBody?.eventBody?.endTime, -24)
        : msgBody?.eventBody?.endTime) ?? '';

    const eventTime = timeStampFormatDuration(
      convertTime(startTime),
      convertTime(endTime),
      !msgBody?.eventBody?.allDay,
    );

    const handleClickCalendarMessage = async () => {
      if (!isReply) {
        try {
          await shell.runApp({
            appId: `${AppIds.CALENDAR}`,
            args: {
              from: 'noti',
              roomId: roomStore.currentRoomId,
              eventId: msgBody?.eventId,
              start: msgBody?.eventBody?.startTime,
            },
          });
          if (isMobile()) shell.mobile.mobileUi.showGnb();
        } catch (error) {
          console.error(error);
        }
      }
    };

    const eventNotiText = () => {
      switch (msgBody?.eventType) {
        case 'SHARE':
          return '일정이 공유되었습니다.';
        case 'DELETE':
          return '일정이 취소되었습니다.';
        case 'CREATE':
          return '일정이 생성되었습니다.';
        case 'START_NOTI':
          return `일정이 시작되기 ${msgBody?.notiTime ?? ''} 입니다.`;
        case 'START':
          return '일정이 지금 시작되었습니다.';
        default:
          return '';
      }
    };

    const eventHasBottom = () => {
      if (msgBody?.eventType === 'DELETE') {
        return false;
      }
      return true;
    };

    if (!!msgBody?.eventType) {
      return (
        <MetaTagMessage
          msgId={message.msgId}
          isReply={isReply}
          notiText={eventNotiText()}
          title={msgBody?.eventBody?.eventName ?? ''}
          titleLimit={1}
          content={
            <S.CalendarMessageSubText>{eventTime}</S.CalendarMessageSubText>
          }
          hasBottom={eventHasBottom()}
          bottomText={'일정 확인하기'}
          bottomIcon={
            <Icon.CalendarLine width={16} height={16} color={Color.Gray[900]} />
          }
          onClick={handleClickCalendarMessage}
        />
      );
    } else return <></>;
  },
);

export default CalendarMessage;
