import { useEffect } from 'react';

import { useCoreStore } from '@wapl/core';
import { observer } from 'mobx-react';

import { useStore } from '@/stores';

import AllVote from './AllVote';
import CreateVote from './CreateVote';
import * as S from './Styled';
import Vote from './Vote';

interface VoteModalProps {
  open: boolean;
  onClose: () => void;
}

const VoteModal = observer(({ open, onClose }: VoteModalProps) => {
  const { uiStore, talkStore } = useStore();
  const { roomStore } = useCoreStore();
  useEffect(() => {
    if (open) {
      onClose();
    }
  }, [roomStore.currentRoomId]);

  const handleAllVote = () => {
    uiStore.setVoteDialogMode('allVote');
  };

  const handleNotice = () => {
    uiStore.closeDialog('vote');
    uiStore.openDialog('notice');
  };

  const handleVote = () => {
    uiStore.setVoteDialogMode('vote');
  };

  const handleCreateVote = () => {
    uiStore.setVoteDialogMode('createVote');
  };

  const handleEditVote = () => {
    uiStore.setVoteDialogMode('editVote');
  };

  const VoteBody = observer(() => {
    if (uiStore.voteDialogMode === 'allVote') {
      return (
        <AllVote
          onClose={onClose}
          onClickCreateVote={handleCreateVote}
          onClickVote={handleVote}
        />
      );
    } else if (uiStore.voteDialogMode === 'vote') {
      return (
        <Vote
          BackButton={handleAllVote}
          onClose={onClose}
          onClickEdit={handleEditVote}
        />
      );
    } else if (uiStore.voteDialogMode === 'noticedVote') {
      return (
        <Vote
          onClose={onClose}
          onClickEdit={handleEditVote}
          BackButton={handleNotice}
        />
      );
    } else if (uiStore.voteDialogMode === 'createVote') {
      return (
        <CreateVote
          BackButton={handleAllVote}
          onClose={onClose}
          onComplete={handleVote}
        />
      );
    } else if (uiStore.voteDialogMode === 'editVote') {
      return (
        <CreateVote
          BackButton={handleAllVote}
          onClose={handleVote}
          onComplete={handleVote}
          editMode
        />
      );
    }
    return null;
  });

  return (
    <>
      <S.VoteModal
        disablePortal
        disableEnforceFocus
        width={460}
        open={open}
        isMini={talkStore.isMini}
        style={{
          top: 'calc(50% - 340px)',
          left: 'calc(50% - 230px)',
          height: 'fit-content',
          width: 'fit-content',
        }}
        onClose={onClose}
      >
        <S.DialogWrapper>
          <VoteBody />
        </S.DialogWrapper>
      </S.VoteModal>
    </>
  );
});

export default VoteModal;
