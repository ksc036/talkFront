import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useCoreStore } from '@wapl/core';
import { AppBarBackButton, AppBarCloseButton, Avatar } from '@wapl/ui';
import { DateTime } from 'luxon';
import { observer } from 'mobx-react-lite';

import CommonButton from '@/components/Common/Button';
import { ConfirmDialog } from '@/components/Common/Dialog';
import CommonDialogHeader from '@/components/Common/Dialog/DialogHeader';
import PlainMessage from '@/components/Common/Message/MessageItem/PlainMessage';
import { useStore } from '@/stores';

import * as S from './styled';

interface ReserveReadProps {
  onClose: () => void;
  handleReserveEdit: () => void;
  handleBackButton: () => void;
}

const ReserveRead = observer(
  ({ onClose, handleReserveEdit, handleBackButton }: ReserveReadProps) => {
    const { reserveStore, configStore } = useStore();
    const { roomStore } = useCoreStore();
    const navigate = useNavigate();
    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
    const reservedRoom = roomStore.getRoomById(
      reserveStore.currentReserve?.roomId as number,
    );

    const handleClickDelete = () => {
      setOpenDeleteDialog(true);
    };

    const handleDeleteReserve = async () => {
      const res = await reserveStore.deleteReserve({
        reservationId: reserveStore.currentReserveId as number,
      });
      if (res) {
        setOpenDeleteDialog(false);
        navigate(-1);
      }
    };

    const dateConverter = (dateTime: string) => {
      if (!!dateTime) {
        return DateTime.fromISO(dateTime).toFormat('yyyy.MM.dd');
      } else {
        return '';
      }
    };

    const timeConverter = (dateTime: string) => {
      if (!!dateTime) {
        return DateTime.fromISO(dateTime)
          .toFormat('a HH:mm')
          .replace('AM', '오전')
          .replace('PM', '오후');
      } else {
        return '';
      }
    };

    const reservedAtConverter = () => {
      const convertedReservedAt = DateTime.fromISO(
        reserveStore.currentReserve?.reservedAt ?? '',
      )
        .diff(
          DateTime.fromISO(reserveStore.currentReserve?.alarmedAt ?? ''),
          'minutes',
        )
        .as('minutes');
      if (convertedReservedAt) {
        return `${convertedReservedAt}분 전`;
      } else {
        return '없음';
      }
    };

    useEffect(() => {
      const fetchCurrentReserve = async () => {
        await reserveStore.getReserve({
          reservationId: reserveStore.currentReserveId,
        });
      };
      fetchCurrentReserve();
    }, [reserveStore.currentReserveId]);

    return (
      <>
        <S.StyledHeader
          leftSide={<AppBarBackButton onClick={handleBackButton} />}
          title="예약 메시지"
          rightSide={<AppBarCloseButton onClick={onClose} />}
        />
        <S.ReservedRoomWrapper>
          <Avatar
            size={36}
            imgSrc={reservedRoom?.profileImageSource ?? ''}
            outLineColor={configStore.HeaderColor}
          />
          <span>{reservedRoom?.name ?? ''}</span>
        </S.ReservedRoomWrapper>
        <S.ReserveContentWrapper>
          <PlainMessage
            msgId={reserveStore.currentReserveId}
            content={reserveStore.currentReserve?.msgBody.content ?? ''}
            getLink={true}
            getMention={false}
            allowKeywordSearch={false}
          />
        </S.ReserveContentWrapper>

        <S.ReserveDetailWrapper>
          예약 메시지 발송일
          <S.ReserveDetailLable>
            {dateConverter(reserveStore.currentReserve?.reservedAt ?? '')}
          </S.ReserveDetailLable>
        </S.ReserveDetailWrapper>
        <S.ReserveDetailWrapper>
          예약 메시지 발송 시간
          <S.ReserveDetailLable>
            {timeConverter(reserveStore.currentReserve?.reservedAt ?? '')}
          </S.ReserveDetailLable>
        </S.ReserveDetailWrapper>
        <S.ReserveDetailWrapper>
          발송 전 예약 알림
          <S.ReserveDetailLable>{reservedAtConverter()}</S.ReserveDetailLable>
        </S.ReserveDetailWrapper>

        <S.FooterButtonWrapper>
          {reserveStore.currentReserve?.status === 'WAITING' ? (
            <>
              <CommonButton
                size="extra-large"
                variant="secondary"
                onClick={handleReserveEdit}
              >
                수정
              </CommonButton>
              <CommonButton
                size="extra-large"
                variant="negative"
                onClick={handleClickDelete}
              >
                삭제
              </CommonButton>
            </>
          ) : (
            <CommonButton size="extra-large" variant="primary" disabled={true}>
              발송 완료
            </CommonButton>
          )}
        </S.FooterButtonWrapper>

        <ConfirmDialog
          open={openDeleteDialog}
          title="예약 메시지 삭제"
          description="등록된 예약 메시지를 삭제합니다."
          cancelText="취소"
          okText="삭제"
          isOkNegative={true}
          onClickCancel={() => setOpenDeleteDialog(false)}
          onClickBackDrop={() => setOpenDeleteDialog(false)}
          onClickOk={handleDeleteReserve}
        />
      </>
    );
  },
);

export default ReserveRead;
