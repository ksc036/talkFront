import Highlighter from 'react-highlight-words';

import { RunAppOptions } from '@shell/sdk';
import { Avatar } from '@wapl/ui';
import { observer } from 'mobx-react-lite';
import moment from 'moment';

import * as S from './styled';

export interface RoomItemType {
  roomId: number;
  msgId?: number;
  roomName: string;
  profileImageSource: string | string[];
  personaCount: number;
  date?: Date;
  messageText?: string;
  unReadCount?: number;
  hashTag?: string;
}
interface SearchItemProps {
  keyword: string;
  room: RoomItemType;
  isOpenRoom?: boolean;
  onRunApp?: ({
    appId,
    args,
  }: {
    appId: string;
    args: any;
    options?: RunAppOptions;
  }) => void;
}

const RoomItem = observer((props: SearchItemProps) => {
  const { keyword, room, isOpenRoom = false, onRunApp } = props;

  const handleClickItem = () => {
    if (onRunApp)
      onRunApp({
        appId: 'tmax.core-ai.talk',
        args: {
          roomId: room.roomId,
          ...(room.msgId && {
            msgId: room.msgId,
          }),
        },
      });
  };

  // 오늘 오전 hh:mm
  // 어제 어제
  // 올해 MM월 ㅇㅇ일
  // 연도 다름 YYYY.MM.DD
  const dateTime = (date: Date) => {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    if (
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate()
    ) {
      return moment(date).format('a hh:mm');
    } else if (
      date.getFullYear() === yesterday.getFullYear() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getDate() === yesterday.getDate()
    ) {
      return '어제';
    } else if (date.getFullYear() === yesterday.getFullYear()) {
      return moment(date).format('M월 D일');
    } else if (date.getFullYear() !== yesterday.getFullYear()) {
      return moment(date).format('YYYY.M.D');
    }
  };

  return (
    <S.ItemWrapper onClick={handleClickItem}>
      <S.ItemDiv>
        <Avatar size={40} imgSrc={room?.profileImageSource ?? ''} />
        <S.RoomInfoDiv>
          <S.RoomInfoTopDiv>
            <S.RoomNameCountDiv>
              <Highlighter
                autoEscape
                highlightClassName="highlight-search"
                searchWords={[keyword]}
                textToHighlight={room?.roomName ?? ''}
                highlightStyle={{
                  color: '#5782F6',
                  fontSize: '14px',
                  fontWeight: 700,
                  background: 'transparent',
                }}
                unhighlightStyle={{
                  color: '#202124',
                  fontSize: '14px',
                  fontWeight: 500,
                }}
              />
              <S.CountText>{room?.personaCount ?? ''}</S.CountText>
            </S.RoomNameCountDiv>
            {!isOpenRoom && room?.date && (
              <S.TimeText>{dateTime(room.date)}</S.TimeText>
            )}
          </S.RoomInfoTopDiv>
          {isOpenRoom ? (
            <S.RoomInfoBottomDiv>
              {room?.hashTag && <S.HashTagDiv>{room.hashTag}</S.HashTagDiv>}
            </S.RoomInfoBottomDiv>
          ) : (
            <S.RoomInfoBottomDiv>
              <S.MessageContent>{room?.messageText ?? ''}</S.MessageContent>
              {room?.unReadCount && room.unReadCount > 0 ? (
                <S.UnreadCountText>{room.unReadCount}</S.UnreadCountText>
              ) : null}
            </S.RoomInfoBottomDiv>
          )}
        </S.RoomInfoDiv>
      </S.ItemDiv>
    </S.ItemWrapper>
  );
});

export default RoomItem;
