import React, { useCallback, useEffect, useState } from 'react';

// import { DatePicker } from '@wapl/calendar';
import { useCoreStore } from '@wapl/core';
import { Icon, useWaplUiStore } from '@wapl/ui';

import { useStore } from '@/stores';
import { formatDate } from '@/utils';

import HeaderIcon from '..';

import * as S from './styled';

type DateMessageIds = {
  [key: string]: number;
};

const DateSelect = () => {
  const { roomStore } = useCoreStore();
  const { messageStore } = useStore();
  const {
    toast: { notify },
  } = useWaplUiStore();

  const [curDate, setCurDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [dateMsgIds, setDateMsgIds] = useState<DateMessageIds>({});
  const [disabledDate, setDisabledDate] = useState<string[]>([]);

  const handleToggle = useCallback(() => {
    setOpen(true);
  }, []);
  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleYearMonthChange = async (date: Date) => {
    setCurDate(date);
    const roomId = roomStore.currentRoomId as number;
    const year = date.getFullYear().toString();
    const month =
      (date.getMonth() + 1).toString().length === 1
        ? '0' + (date.getMonth() + 1).toString()
        : (date.getMonth() + 1).toString();
    const lastDate = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0,
    ).getDate();
    const dateList: string[] = [];
    for (let i = 1; i <= lastDate; i++) {
      let dd = '';
      if (i < 10) dd = '0' + i.toString();
      else dd = i.toString();
      const fullDate = year + '-' + month + '-' + dd;
      dateList.push(fullDate);
    }
    const roomEnterTime = roomStore.getRoomById(
      roomStore.currentRoomId as number,
    )?.myInfo?.joinDate as string;
    const res = await messageStore.getDateMessageIds({
      roomId,
      year,
      month,
      roomEnterTime,
    });
    const msgIds = res?.dateSelect.reduce(
      (acc: DateMessageIds, v: DateMessageIds) =>
        Object.assign(acc, { [Object.keys(v)[0]]: Object.values(v)[0] }),
      {},
    );
    const existDateList = Object.keys(msgIds);
    const disabledDate = dateList.filter((d) => !existDateList.includes(d));
    setDisabledDate(disabledDate);
    setDateMsgIds(msgIds);
  };

  const handleDateChange = async (date: Date) => {
    setCurDate(date);
    const formattedDate = formatDate(date);
    // 해당 날짜에 메시지 아이디가 있는지 체크
    if (Object.keys(dateMsgIds).includes(formattedDate)) {
      const msgId = dateMsgIds[formattedDate];
      messageStore.setGotoReplyOriginTargetId(msgId);
      messageStore.scrollToTargetMessageId(msgId, 'start');
    } else {
      notify('해당 날짜에 메세지가 없습니다.', { duration: 1000 });
    }
  };

  useEffect(() => {
    if (open) {
      (async () => {
        await handleYearMonthChange(curDate);
      })();
    }
  }, [open]);

  return (
    <S.Wrapper>
      <HeaderIcon
        name="미팅"
        icon={<Icon.CalendarLine width={20} height={20} />}
        onClick={handleToggle}
      />
      {/* <DatePicker
        open={open}
        date={curDate}
        onChange={handleYearMonthChange}
        onDateChange={handleDateChange}
        onOutsideClick={handleClose}
        disabledDateList={disabledDate}
        style={{ transform: 'translate(-100%, 0)', zIndex: 3 }}
      /> */}
    </S.Wrapper>
  );
};

export default DateSelect;
