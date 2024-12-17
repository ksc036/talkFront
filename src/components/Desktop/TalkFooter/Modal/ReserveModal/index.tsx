import { observer } from 'mobx-react-lite';

import { useStore } from '@/stores';

import ReserveCreate from './ReserveCreate';
import ReserveList from './ReserveList';
import ReserveRead from './ReserveRead';
import * as S from './styled';

export interface BackButtonFuntionsType {
  handleReserveList: () => void;
  handleReserveEdit: () => void;
  handleReserveRead: () => void;
  handleReserveCreate: () => void;
}

const ReserveModal = observer(() => {
  const { uiStore } = useStore();
  const handleClose = () => {
    uiStore.closeDialog('reserve');
  };

  const backButtonFunctions = {
    handleReserveList: () => {
      uiStore.setReserveDialogMode('list');
    },

    handleReserveEdit: () => {
      uiStore.setReserveDialogMode('edit');
    },

    handleReserveRead: () => {
      if (uiStore.reserveDialogType === 'create')
        uiStore.setReserveDialogMode('readFromCreate');
      else if (uiStore.reserveDialogType === 'edit') {
        uiStore.setReserveDialogMode('readFromEdit');
      }
    },

    handleReserveCreate: () => {
      uiStore.setReserveDialogMode('create');
    },
  };

  const ReserveModes = observer(() => {
    if (uiStore.reserveDialogType === 'list') {
      return <ReserveList />;
    } else if (uiStore.reserveDialogType === 'create') {
      return <ReserveCreate backButtonFunctions={backButtonFunctions} />;
    } else if (uiStore.reserveDialogType === 'edit') {
      return (
        <ReserveCreate
          isEdit={true}
          backButtonFunctions={backButtonFunctions}
        />
      );
    } else if (
      uiStore.reserveDialogType === 'readFromEdit' ||
      uiStore.reserveDialogType === 'readFromCreate' ||
      uiStore.reserveDialogType === 'readFromList'
    ) {
      return <ReserveRead backButtonFunctions={backButtonFunctions} />;
    }
    return null;
  });

  return (
    <S.ReserveModal
      disablePortal
      disableEnforceFocus
      width={460}
      open={uiStore.openReserve}
      onClose={handleClose}
    >
      <S.DialogWrapper>
        <ReserveModes />
      </S.DialogWrapper>
    </S.ReserveModal>
  );
});

export default ReserveModal;
