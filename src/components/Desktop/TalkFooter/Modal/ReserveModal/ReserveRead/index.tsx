import { useEffect, useState } from 'react';

import { useCoreStore } from '@wapl/core';
import { Avatar } from '@wapl/ui';
import { DateTime } from 'luxon';
import { observer } from 'mobx-react-lite';

import CommonButton from '@/components/Common/Button';
import { ConfirmDialog } from '@/components/Common/Dialog';
import CommonDialogHeader from '@/components/Common/Dialog/DialogHeader';
import PlainMessage from '@/components/Common/Message/MessageItem/PlainMessage';
import { useStore } from '@/stores';

import { BackButtonFuntionsType } from '..';

import * as S from './styled';

interface ReserveReadProps {
  backButtonFunctions: BackButtonFuntionsType;
}

const ReserveRead = observer(({ backButtonFunctions }: ReserveReadProps) => {
  const { handleReserveList, handleReserveEdit, handleReserveCreate } =
    backButtonFunctions;
  const { uiStore, reserveStore, configStore } = useStore();
  const { roomStore } = useCoreStore();
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const reservedRoom = roomStore.getRoomById(
    reserveStore.currentReserve?.roomId as number,
  );

  const handleBackButton = () => {
    if (reserveStore.entryPoint === 'LNB') {
      handleReserveList();
    } else {
      if (uiStore.reserveDialogType === 'readFromEdit') {
        handleReserveEdit();
      } else if (uiStore.reserveDialogType === 'readFromCreate') {
        handleReserveCreate();
      }
    }
  };

  const handleClickEdit = () => {
    uiStore.setReserveDialogMode('edit');
  };

  const handleClickDelete = () => {
    setOpenDeleteDialog(true);
  };

  const handleDeleteReserve = async () => {
    const res = await reserveStore.deleteReserve({
      reservationId: reserveStore.currentReserveId as number,
    });
    if (res) {
      setOpenDeleteDialog(false);
      handleBackButton();
    }
  };

  const dateTimeConverter = (dateTime: string) => {
    if (!!dateTime) {
      return DateTime.fromISO(dateTime)
        .toFormat('yyyy.MM.dd a HH:mm')
        .replace('AM', '오전')
        .replace('PM', '오후');
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
      <CommonDialogHeader
        title="예약 메시지"
        iconType="back"
        onClose={() => uiStore.closeDialog('reserve')}
        onIconClick={handleBackButton}
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
        <S.ReserveDetailLable>예약 메시지 발송 일자</S.ReserveDetailLable>
        {dateTimeConverter(reserveStore.currentReserve?.reservedAt ?? '')}
      </S.ReserveDetailWrapper>
      <S.ReserveDetailWrapper>
        <S.ReserveDetailLable>발송 전 예약 알림</S.ReserveDetailLable>
        {dateTimeConverter(reserveStore.currentReserve?.alarmedAt ?? '')}
      </S.ReserveDetailWrapper>

      <S.FooterButtonWrapper>
        {reserveStore.currentReserve?.status === 'WAITING' ? (
          <>
            <CommonButton
              size="large"
              variant="secondary"
              onClick={handleClickEdit}
            >
              수정
            </CommonButton>
            <CommonButton
              size="large"
              variant="secondary"
              onClick={handleClickDelete}
            >
              삭제
            </CommonButton>
          </>
        ) : (
          <CommonButton size="large" variant="secondary" disabled={true}>
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
});

export default ReserveRead;
