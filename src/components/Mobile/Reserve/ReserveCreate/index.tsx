import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { RoomModel, useCoreStore } from '@wapl/core';
import {
  AppBarButton,
  AppBarCloseButton,
  Avatar,
  Icon,
  useTheme,
} from '@wapl/ui';
import { DateTime } from 'luxon';
import { observer } from 'mobx-react-lite';

import { msgType } from '@/@types';
import { useStore } from '@/stores';

import EventDateItem from '../../VoteDialog/CreateVote/EventDateItem';

// import ReserveContextMenu from './ReserveContextMenu';
import * as S from './styled';

interface ReserveCreateProps {
  isEdit?: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const ReserveCreate = observer(
  ({ isEdit, onClose, onComplete }: ReserveCreateProps) => {
    const { talkStore, reserveStore, configStore } = useStore();
    const { roomStore, userStore } = useCoreStore();
    const { appId } = talkStore;
    const [hasChange, setHasChange] = useState(false);
    const [messageContent, setMessageContent] = useState('');
    const [reservedAt, setReservedAt] = useState(
      DateTime.now().plus({ minutes: 10 }).setZone(),
    );
    const [alarmedAt, setAlarmedAt] = useState(0);
    const isTimeInvalid = reservedAt.diffNow().as('minutes') < 10;
    const [currentRoom, setCurrentRoom] = useState<RoomModel | null>(null);
    // const [openDrawer, setOpenDrawer] = useState(false);
    const theme = useTheme();
    const navigate = useNavigate();

    const handleMessageChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        const { selectionStart }: HTMLInputElement = e.target;
        if (e.target.value.length <= 5000) {
          setMessageContent(e.target.value);
        } else {
          queueMicrotask(() => {
            if (selectionStart) {
              e.target.setSelectionRange(
                selectionStart - 1,
                selectionStart - 1,
              );
            }
          });
        }

        if (e.target.value.length > 0) {
          setHasChange(true);
        } else setHasChange(false);
      },
      [hasChange, messageContent],
    );

    const handleReservedAt = useCallback(
      (date: DateTime) => {
        setReservedAt(date);
        setHasChange(true);
      },
      [reservedAt],
    );

    const handleAlarmedAt = useCallback(
      (minutes: number) => {
        setAlarmedAt(minutes);
        setHasChange(true);
      },
      [alarmedAt],
    );

    const isValid = () => {
      const isMessageValid = messageContent.trim().length > 0;
      const isReservedAtValid = reservedAt.diffNow().as('minutes') > 10;
      return isMessageValid && isReservedAtValid && hasChange;
    };

    const handleCreateReserveMessage = async () => {
      const res = await reserveStore.createReserve({
        roomId: roomStore.currentRoomId ?? 0,
        reservedAt: reservedAt.toISO(),
        msgType: msgType.text,
        msgBody: {
          content: messageContent,
        },
        rawContent: messageContent,
        appId: appId,
        personaId: userStore.selectedPersona?.id ?? 0,
        alarmedAt:
          alarmedAt === 0
            ? null
            : reservedAt.minus({ minutes: alarmedAt }).toISO(),
      });
      if (res) {
        onComplete();
      }
    };

    const handleUpdateReserveMessage = async () => {
      const res = await reserveStore.updateReserve({
        roomId: currentRoom?.id ?? 0,
        reservedAt: reservedAt.toISO(),
        msgType: msgType.text,
        msgBody: {
          content: messageContent,
        },
        rawContent: messageContent,
        appId: appId,
        reservationId: reserveStore.currentReserve?.reservationId ?? -1,
        alarmedAt:
          alarmedAt === 0
            ? null
            : reservedAt.minus({ minutes: alarmedAt }).toISO(),
      });
      if (res) {
        onComplete();
      }
    };

    const handleClickCompleteButton = async () => {
      if (isEdit) {
        await handleUpdateReserveMessage();
      } else {
        await handleCreateReserveMessage();
      }
    };

    // const handleClickReserveDate = () => {
    //   setOpenDrawer(true);
    // };

    useEffect(() => {
      const fetchRoomData = async () => {
        const room =
          roomStore.getRoomById(roomStore.currentRoomId) ||
          (await roomStore.fetchRoomDetail({
            roomId: roomStore.currentRoomId as number,
            appId: appId,
          }));
        setCurrentRoom(room);
      };

      fetchRoomData();
    }, [roomStore.currentRoomId]);

    useEffect(() => {
      if (isEdit && reserveStore.currentReserve) {
        setMessageContent(reserveStore.currentReserve.msgBody.content);
        setCurrentRoom(
          roomStore.getRoomById(reserveStore.currentReserve.roomId),
        );
        setReservedAt(DateTime.fromISO(reserveStore.currentReserve.reservedAt));
        if (!!reserveStore.currentReserve.alarmedAt) {
          setAlarmedAt(
            DateTime.fromISO(reserveStore.currentReserve.reservedAt)
              .diff(
                DateTime.fromISO(reserveStore.currentReserve.alarmedAt),
                'minutes',
              )
              .as('minutes'),
          );
        } else {
          setAlarmedAt(0);
        }
        setHasChange(false);
      } else {
        setCurrentRoom(roomStore.getRoomById(roomStore.currentRoomId));
      }
    }, [isEdit]);
    return (
      <>
        <S.StyledHeader
          leftSide={<AppBarCloseButton onClick={onClose} />}
          title="예약 메시지 생성"
          rightSide={
            <AppBarButton
              onClick={handleClickCompleteButton}
              style={{
                color: isValid()
                  ? configStore.config.MainColor
                  : theme.Color.Gray[500],
              }}
              disabled={!isValid()}
            >
              완료
            </AppBarButton>
          }
        />
        <S.CurrentRoomWrapper>
          <Avatar
            size={36}
            imgSrc={currentRoom?.profileImageSource ?? ''}
            outLineColor={configStore.HeaderColor}
          />
          <span>{currentRoom?.name ?? ''}</span>
        </S.CurrentRoomWrapper>
        <S.TextFieldWrapper>
          <S.StyledTextField
            type="text"
            multiline
            variant="standard"
            placeholder="내용을 입력해 주세요"
            onChange={handleMessageChange}
            value={messageContent}
            visibleClear={false}
            InputProps={{
              disableUnderline: true,
              inputProps: {
                maxLength: 5000,
              },
            }}
            sx={{ height: '100%' }}
          />
        </S.TextFieldWrapper>
        <S.DetailWrapper>
          예약 메시지 발송일
          <EventDateItem
            date={reservedAt}
            onChange={handleReservedAt}
            isTimeInvalid={isTimeInvalid}
            pickerCheck={true}
            position="top"
          />
        </S.DetailWrapper>
        <S.DetailWrapper>
          발송 전 예약 알림
          <S.StyledSelect
            IconComponent={(props) => (
              <Icon.ArrowBottomLine {...props} width={16} height={16} />
            )}
            defaultOpen={false}
            value={alarmedAt}
            onChange={(event) => handleAlarmedAt(Number(event.target.value))}
          >
            <S.StyledMenuItem value={0}>없음</S.StyledMenuItem>
            <S.StyledMenuItem value={5}>5분 전</S.StyledMenuItem>
            <S.StyledMenuItem value={10}>10분 전</S.StyledMenuItem>
            <S.StyledMenuItem value={20}>20분 전</S.StyledMenuItem>
            <S.StyledMenuItem value={30}>30분 전</S.StyledMenuItem>
          </S.StyledSelect>
        </S.DetailWrapper>
        {/* <ReserveContextMenu
        isOpen={openDrawer}
        onClose={() => setOpenDrawer(false)}
        mode="alarm"
        state={alarmedAt}
        action={handleAlarmedAt}
      /> */}
      </>
    );
  },
);

export default ReserveCreate;
