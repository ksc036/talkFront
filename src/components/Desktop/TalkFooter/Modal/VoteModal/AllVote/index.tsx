import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import { useCoreStore } from '@wapl/core';
import { Tab, Icon, Avatar, Squircle, Tooltip } from '@wapl/ui';
import { useTheme } from '@wapl/ui';
import { observer } from 'mobx-react';

import CommonDialogHeader from '@/components/Common/Dialog/DialogHeader';
import EmptyList from '@/components/Common/EmptyList';
import { INFINITE_SCROLL_SIZE } from '@/constants/common';
import { useStore } from '@/stores';

import * as S from './Styled';
import VoteInfoItem from './VotingInfoItem';

interface AllVoteProps {
  onClose: () => void;
  onClickCreateVote: () => void;
  onClickVote: () => void;
}

const AllVote = observer(
  ({ onClose, onClickCreateVote, onClickVote }: AllVoteProps) => {
    const { roomStore } = useCoreStore();
    const { Color } = useTheme();
    const [value, setValue] = React.useState(0);
    const { voteStore, uiStore, configStore } = useStore();
    const [isOverflowed, setIsOverflowed] = useState(false);

    const checkOverflow = (e: React.MouseEvent<HTMLSpanElement>) => {
      const target = e.currentTarget;
      setIsOverflowed(target.scrollWidth > target.clientWidth);
    };

    const roomName =
      roomStore.getRoomById(roomStore.currentRoomId as number)?.name ?? '';

    const fetchOpenVotes = async () => {
      await voteStore.getVotes({
        roomId: roomStore.currentRoomId as number,
        size: INFINITE_SCROLL_SIZE,
      });

      await voteStore.getTotalVotesCount({
        roomId: roomStore.currentRoomId as number,
        isOpen: 'open',
      });
    };

    const fetchClosedVotes = async () => {
      await voteStore.getClosedVotes({
        roomId: roomStore.currentRoomId as number,
        size: INFINITE_SCROLL_SIZE,
      });

      await voteStore.getTotalVotesCount({
        roomId: roomStore.currentRoomId as number,
        isOpen: 'closed',
      });
    };

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
      setValue(newValue);
    };
    const handleVoteDetail = (voteId: number) => {
      voteStore.setCurrentVoteId(voteId);
      onClickVote();
    };

    const displayAvatarImages =
      roomStore.getRoomById(roomStore.currentRoomId as number)
        ?.profileImageSource ?? '';

    useEffect(() => {
      if (uiStore.openVote) {
        fetchOpenVotes();
        fetchClosedVotes();
      }
      return () => {
        voteStore.clear();
      };
    }, []);

    return (
      <>
        <CommonDialogHeader iconType="vote" title="투표" onClose={onClose} />

        <S.RoomInfoWrapper>
          <Avatar imgSrc={displayAvatarImages} />
          <Tooltip
            title={isOverflowed ? roomName : ''}
            placement="bottom-start"
          >
            <S.RoomTitle onMouseEnter={checkOverflow}>
              {roomStore.getRoomById(roomStore.currentRoomId as number)?.name}
            </S.RoomTitle>
          </Tooltip>
        </S.RoomInfoWrapper>
        <S.StyledTabs
          onChange={handleChange}
          value={value}
          name="VoteModal"
          variant="fullWidth"
          tabswidth="50%"
          TabIndicatorProps={{
            style: {
              backgroundColor: configStore.MainColor,
            },
          }}
        >
          <Tab
            label={
              <span
                style={{
                  color: value === 0 ? configStore.MainColor : Color.Gray[500],
                }}
              >
                진행 중인 투표
              </span>
            }
          />
          <Tab
            label={
              <span
                style={{
                  color: value === 1 ? configStore.MainColor : Color.Gray[500],
                }}
              >
                마감된 투표
              </span>
            }
          />
        </S.StyledTabs>
        <S.VotingTabPanel value={value} index={0}>
          <S.VoteCountWrapper>
            <span>전체</span>
            <span>{voteStore.totalOpenVotes}</span>
          </S.VoteCountWrapper>

          {voteStore.openVotes.length > 0 ? (
            <S.VotingItemListWrapper id="scrollableDiv">
              <InfiniteScroll
                dataLength={voteStore.openVotes.length}
                next={fetchOpenVotes}
                hasMore={voteStore.__hasMoreOpenVotes}
                loader={<></>}
                scrollableTarget="scrollableDiv"
              >
                {voteStore.openVotes.map((vote, index) => (
                  <VoteInfoItem
                    isClosedVote={false}
                    onClick={() => handleVoteDetail(vote.voteId)}
                    key={index}
                    voteItem={vote}
                  />
                ))}
              </InfiniteScroll>
            </S.VotingItemListWrapper>
          ) : (
            <S.EmptyVoteWrapper>
              <EmptyList title="진행 중인 투표가 없습니다." />
            </S.EmptyVoteWrapper>
          )}

          <S.StyleFab onClick={onClickCreateVote}>
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
          </S.StyleFab>
        </S.VotingTabPanel>
        <S.VotingTabPanel value={value} index={1}>
          <S.VoteCountWrapper>
            <span>전체</span>
            <span>{voteStore.totalClosedVotes}</span>
          </S.VoteCountWrapper>
          {voteStore.closedVotes.length > 0 ? (
            <S.VotingItemListWrapper id="scrollableDiv">
              <InfiniteScroll
                dataLength={voteStore.closedVotes.length}
                next={fetchClosedVotes}
                hasMore={voteStore.__hasMoreClosedVotes}
                loader={<></>}
                scrollableTarget="scrollableDiv"
              >
                {voteStore.closedVotes.map((vote, index) => (
                  <VoteInfoItem
                    key={index}
                    voteItem={vote}
                    isClosedVote={true}
                    onClick={() => handleVoteDetail(vote.voteId)}
                  />
                ))}{' '}
              </InfiniteScroll>
            </S.VotingItemListWrapper>
          ) : (
            <S.EmptyVoteWrapper>
              <EmptyList title="마감된 투표가 없습니다." />
            </S.EmptyVoteWrapper>
          )}
        </S.VotingTabPanel>
      </>
    );
  },
);

export default AllVote;
