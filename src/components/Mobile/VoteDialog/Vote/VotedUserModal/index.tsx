import { useState } from 'react';

import { useCoreStore, RoomMember } from '@wapl/core';
import { FullScreenDialog, AppBarBackButton, Tab } from '@wapl/ui';
import { observer } from 'mobx-react-lite';

import { useStore } from '@/stores';

import NoneVotedUserList from './noneVotedUserList';
import * as S from './Styled';
import UserList from './UserList';

interface VotedUserModalProps {
  open: boolean;
  onClose: () => void;
}

const VotedUserModal = observer((props: VotedUserModalProps) => {
  const { open, onClose } = props;
  const { voteStore } = useStore();
  const { roomStore } = useCoreStore();
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
      <FullScreenDialog
        disablePortal
        disableEnforceFocus
        hideBackdrop
        open={open}
        onClose={handleClose}
      >
        <S.DialogWrapper>
          <S.StyledHeader
            leftSide={<AppBarBackButton onClick={handleClose} />}
            title="투표한 인원"
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
          <S.VotingTabPanel value={value} index={0}>
            {currentVote?.voteItems.map((voteItem, idx) => {
              if (voteItem.itemContent)
                return <UserList key={idx} voteItem={voteItem}></UserList>;
            })}
          </S.VotingTabPanel>
          <S.VotingTabPanel value={value} index={1}>
            <NoneVotedUserList noneVotedUserList={noneVotedUserList} />
          </S.VotingTabPanel>
        </S.DialogWrapper>
      </FullScreenDialog>
    </>
  );
});

export default VotedUserModal;
