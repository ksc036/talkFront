import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import { AppBarCloseButton, Icon, Squircle, useTheme } from '@wapl/ui';
import { observer } from 'mobx-react-lite';

import { INFINITE_SCROLL_SIZE } from '@/constants/common';
import { ReserveModel } from '@/models/ReserveModel';
import { useStore } from '@/stores';

import ReserveListItems from './ReserveListItems';
import * as S from './styled';

interface ReserveListProps {
  onClose: () => void;
  handleReserveCreate: () => void;
  handleReserveRead: () => void;
}

const ReserveList = observer(
  ({ onClose, handleReserveCreate, handleReserveRead }: ReserveListProps) => {
    const { reserveStore, configStore } = useStore();
    const { Color } = useTheme();
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(false);
    const [totalReserves, setTotalReserves] = useState(-1);
    const [reserves, setReserves] = useState<ReserveModel[] | null>(null);
    const [selectedTabIndex, setSelectedTabIndex] = useState(0);

    const fetchWaitingReserves = async (
      status: 'WAITING' | 'COMPLETED',
      offset: number,
    ) => {
      const res = await reserveStore.getReserves({
        reserveStatus: status,
        size: INFINITE_SCROLL_SIZE,
        offset: offset,
      });
      if (res) {
        setReserves((prevReserves) => [
          ...(prevReserves ?? []),
          ...(res.messageReservationInfoList as ReserveModel[]),
        ]);
        setHasMore(res.hasMore);
        setOffset((offset) => offset + INFINITE_SCROLL_SIZE);
        setTotalReserves(res.count);
      }
    };

    const handleSelectedTabIndex = async (
      event: React.SyntheticEvent,
      newValue: number,
    ) => {
      setOffset(0);
      setReserves(null);
      setHasMore(false);
      if (newValue === 0) {
        await fetchWaitingReserves('WAITING', 0);
      } else {
        await fetchWaitingReserves('COMPLETED', 0);
      }
      setSelectedTabIndex(newValue);
    };

    const handleClickAddNewButton = () => {
      handleReserveCreate();
    };

    useEffect(() => {
      fetchWaitingReserves('WAITING', 0);
    }, []);

    return (
      <>
        <S.StyledHeader
          leftSide={<AppBarCloseButton onClick={onClose} />}
          title="예약 메시지"
        />
        <S.StyledTabs
          onChange={handleSelectedTabIndex}
          value={selectedTabIndex}
          variant="fullWidth"
          tabswidth="50%"
          TabIndicatorProps={{
            style: {
              backgroundColor: configStore.MainColor,
            },
          }}
        >
          <S.StyledTab
            color={
              selectedTabIndex === 0 ? configStore.MainColor : Color.Gray[500]
            }
            label={<span aria-hidden="false">발송 대기 중</span>}
          />
          <S.StyledTab
            color={
              selectedTabIndex === 1 ? configStore.MainColor : Color.Gray[500]
            }
            label={<span aria-hidden="false">발송 완료</span>}
          />
        </S.StyledTabs>
        <S.ReserveTabPanel value={selectedTabIndex} index={0}>
          <S.ReserveCountWrapper>
            전체 <span>{totalReserves}</span>
          </S.ReserveCountWrapper>
          <S.ReserveItemListWrapper id="scrollableDivWaiting">
            <InfiniteScroll
              dataLength={reserves?.length ?? 0}
              next={() => fetchWaitingReserves('WAITING', offset)}
              hasMore={hasMore}
              loader={<></>}
              scrollableTarget="scrollableDivWaiting"
            >
              {reserves?.map((reserve) => (
                <ReserveListItems
                  key={reserve.reservationId}
                  reserve={reserve}
                  handleReserveRead={handleReserveRead}
                />
              ))}
            </InfiniteScroll>
          </S.ReserveItemListWrapper>
          <S.FloatingButton onClick={handleClickAddNewButton}>
            <Squircle
              size={48}
              icon={
                <Icon.Add2Line
                  width={24}
                  height={24}
                  color={Color.White[100]}
                />
              }
              color={configStore.MainColor}
            />
          </S.FloatingButton>
        </S.ReserveTabPanel>
        <S.ReserveTabPanel value={selectedTabIndex} index={1}>
          <S.ReserveCountWrapper>
            전체 <span>{totalReserves}</span>
          </S.ReserveCountWrapper>
          <S.ReserveItemListWrapper id="scrollableDivCompleted">
            <InfiniteScroll
              dataLength={reserves?.length ?? 0}
              next={() => fetchWaitingReserves('COMPLETED', offset)}
              hasMore={hasMore}
              loader={<></>}
              scrollableTarget="scrollableDivCompleted"
            >
              {reserves?.map((reserve) => (
                <ReserveListItems
                  key={reserve.reservationId}
                  reserve={reserve}
                  handleReserveRead={handleReserveRead}
                />
              ))}
            </InfiniteScroll>
          </S.ReserveItemListWrapper>
        </S.ReserveTabPanel>
      </>
    );
  },
);

export default ReserveList;
