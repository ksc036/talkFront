import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// import { DatePicker } from '@wapl/calendar';
import { useCoreStore } from '@wapl/core';
import { observer } from 'mobx-react-lite';

import { useStore } from '@/stores';
// import { formatDate } from '@/utils';

import * as S from './styled';

type DateMessageIds = {
  [key: string]: number;
};

const CalendarContextMenu = observer(() => {
  const { messageStore } = useStore();
  const { roomStore } = useCoreStore();

  const navigate = useNavigate();
  const { hash } = useLocation();

  const [curDate, setCurDate] = useState(new Date());
  const [dateMsgIds, setDateMsgIds] = useState<DateMessageIds>({});
  const [disabledDate, setDisabledDate] = useState<string[]>([]);

  const handleCloseMenu = useCallback(() => {
    navigate(-1);
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

  // const handleDateChange = async (date: Date) => {
  //   setCurDate(date);
  //   const formattedDate = formatDate(date);
  //   // 해당 날짜에 메시지 아이디가 있는지 체크
  //   if (Object.keys(dateMsgIds).includes(formattedDate)) {
  //     const msgId = dateMsgIds[formattedDate];
  //     messageStore.setGotoReplyOriginTargetId(msgId);
  //     await messageStore.scrollToTargetMessageId(msgId, 'start');
  //     handleCloseMenu();
  //   } else {
  //     uiStore.openToast('해당 날짜에 메시지가 없습니다.');
  //   }
  // };

  useEffect(() => {
    if (hash === '#calendar-menu') {
      (async () => {
        await handleYearMonthChange(curDate);
      })();
    }
  }, [hash]);

  const [width, setWidth] = useState<number>(window.innerWidth);

  const handleResize = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const scaleUpRatio = (width * 0.9) / 224;
  const scaleDownRatio = 1.5 / scaleUpRatio;

  return (
    <>
      <S.BottomContextMenu
        anchor={'bottom'}
        open={hash === '#calendar-menu'}
        onClose={handleCloseMenu}
        height={width}
        scaleDownRatio={scaleDownRatio}
      >
        <div />
        {/* <DatePicker
          open={true}
          date={curDate}
          mode={'inline'}
          onChange={handleYearMonthChange}
          onDateChange={handleDateChange}
          disabledDateList={disabledDate}
          style={{
            transform: `scale(${scaleUpRatio})`,
          }}
        /> */}
      </S.BottomContextMenu>
    </>
  );
});

export default CalendarContextMenu;
