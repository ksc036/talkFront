import { useState } from 'react';

import { useCoreStore, RoomMember } from '@wapl/core';
import { DialogHeader, Tab, useTheme } from '@wapl/ui';

import { useStore } from '@/stores';

import NoneVotedUserList from './noneVotedUserList';
import * as S from './Styled';
import UserList from './UserList';

interface VotedUserModalProps {
  open: boolean;
  onClose: () => void;
}

const VotedUserModal = (props: VotedUserModalProps) => {
  const { open, onClose } = props;
  const { voteStore, configStore } = useStore();
  const { roomStore } = useCoreStore();
  const { Color } = useTheme();
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleClose = () => {
    onClose();
    setValue(0);
  };

  const currentVote = voteStore.currentVote;

  const noneVotedUserList: RoomMember[] = roomStore
    .getRoomMemberList(roomStore.currentRoomId as number)
    .filter((persona: RoomMember) => {
      if (currentVote?.votedPersonaIds.length === 0) return persona;
      return !currentVote?.votedPersonaIds.some((id) => {
        return id === persona.personaId;
      });
    });

  return (
    <>
      <S.StyledDialog hideBackdrop open={open} onClose={handleClose}>
        <S.DialogWrapper>
          <DialogHeader
            title="투표한 사람"
            handleClose={handleClose}
            height={72}
          />
          <S.StyledTabs
            onChange={handleChange}
            value={value}
            name="VotedUserModal"
            variant="fullWidth"
            tabswidth="50%"
          >
            <Tab label={<div>참여 {currentVote?.numberUsers}</div>} />
            <Tab label={<div>미참여 {noneVotedUserList.length}</div>} />
          </S.StyledTabs>
          <S.DialogHeaderWrapper indicatorColor={configStore.MainColor}>
            <DialogHeader
              title="투표한 사람"
              handleClose={handleClose}
              height={72}
            />
            <S.StyledTabs
              onChange={handleChange}
              value={value}
              name="VotedUserModal"
              variant="fullWidth"
              tabswidth="50%"
            >
              <Tab
                label={
                  <span
                    style={{
                      color:
                        value === 0 ? configStore.MainColor : Color.Gray[500],
                    }}
                  >
                    참여 {currentVote?.numberUsers}
                  </span>
                }
              />
              <Tab
                label={
                  <span
                    style={{
                      color:
                        value === 1 ? configStore.MainColor : Color.Gray[500],
                    }}
                  >
                    미참여 {noneVotedUserList.length}
                  </span>
                }
              />
            </S.StyledTabs>
          </S.DialogHeaderWrapper>
          <S.VotingTabPanel value={value} index={0}>
            {currentVote?.voteItems.map((voteItem, idx) => {
              if (voteItem.itemContent)
                return <UserList key={idx} voteItem={voteItem} />;
            })}
          </S.VotingTabPanel>
          <S.VotingTabPanel value={value} index={1}>
            <NoneVotedUserList noneVotedUserList={noneVotedUserList} />
          </S.VotingTabPanel>
        </S.DialogWrapper>
      </S.StyledDialog>
    </>
  );
};
export default VotedUserModal;
