import { useLocation, useNavigate } from 'react-router-dom';

import { useCoreStore } from '@wapl/core';
import { observer } from 'mobx-react';

import AllVote from './AllVote';
import CreateVote from './CreateVote';
import * as S from './Styled';
import Vote from './Vote';

const VoteDialog = observer(() => {
  const { pathname, hash } = useLocation();
  const { roomStore } = useCoreStore();

  const navigate = useNavigate();

  const handleBackButton = () => {
    navigate(-1);
  };

  const handleVote = () => {
    navigate('#vote');
  };

  const handleCreateVote = () => {
    navigate('#createvote');
  };

  const handleEditVote = () => {
    navigate('#editvote');
  };

  const handleClose = () => {
    navigate(`/talk/${roomStore.currentRoomId}`);
  };

  const VoteBody = observer(() => {
    switch (hash) {
      case '#vote':
        return (
          <Vote
            onClose={handleClose}
            onClickEdit={handleEditVote}
            backButton={handleBackButton}
          />
        );
      case '#createvote':
        return (
          <CreateVote BackButton={handleBackButton} onComplete={handleVote} />
        );
      case '#editvote':
        return (
          <CreateVote
            BackButton={handleBackButton}
            onComplete={handleVote}
            editMode
          />
        );
      default:
        return (
          <AllVote
            onClose={handleBackButton}
            onClickCreateVote={handleCreateVote}
            onClickVote={handleVote}
          />
        );
    }
  });

  return (
    <>
      <S.VoteDialog
        open={pathname.includes('allvote')}
        onClose={handleBackButton}
      >
        <S.DialogWrapper>
          <VoteBody />
        </S.DialogWrapper>
      </S.VoteDialog>
    </>
  );
});

export default VoteDialog;
