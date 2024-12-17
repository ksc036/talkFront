import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useCoreStore } from '@wapl/core';
import { observer } from 'mobx-react-lite';

import ReserveCreate from './ReserveCreate';
import ReserveList from './ReserveList';
import ReserveRead from './ReserveRead';
import * as S from './styled';

const ReserveDialog = observer(() => {
  const { pathname, hash } = useLocation();
  const { roomStore } = useCoreStore();

  const navigate = useNavigate();

  const handleBackButton = () => {
    navigate(-1);
  };

  const handleReserveCreate = () => {
    navigate('#create');
  };

  const handleReserveEdit = () => {
    navigate('#edit');
  };

  const handleReserveRead = () => {
    navigate('#read');
  };

  const handleClose = () => {
    navigate(`/talk/${roomStore.currentRoomId}`);
  };

  const ReserveBody = observer(() => {
    switch (hash) {
      case '#create':
        return (
          <ReserveCreate onClose={handleClose} onComplete={handleReserveRead} />
        );
      case '#edit':
        return (
          <ReserveCreate
            isEdit={true}
            onClose={handleClose}
            onComplete={handleReserveRead}
          />
        );

      case '#read':
        return (
          <ReserveRead
            onClose={handleClose}
            handleReserveEdit={handleReserveEdit}
            handleBackButton={handleBackButton}
          />
        );
      default:
        return (
          <ReserveList
            onClose={handleClose}
            handleReserveCreate={handleReserveCreate}
            handleReserveRead={handleReserveRead}
          />
        );
    }
  });

  return (
    <S.ReserveDialog
      open={pathname.includes('reserve')}
      onClose={handleBackButton}
    >
      <S.DialogWrapper>
        <ReserveBody />
      </S.DialogWrapper>
    </S.ReserveDialog>
  );
});

export default ReserveDialog;
