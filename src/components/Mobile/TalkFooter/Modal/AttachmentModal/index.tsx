import { Dispatch, SetStateAction } from 'react';

import { Mui, Icon } from '@wapl/ui';
import { observer } from 'mobx-react-lite';

import { useStore } from '@/stores';

import * as S from './Styled';

interface AttachmentModalProps {
  anchorEl: null | HTMLElement;
  setAnchorEl: Dispatch<SetStateAction<null | HTMLElement>>;
}
const AttachmentModal = observer((props: AttachmentModalProps) => {
  const { anchorEl, setAnchorEl } = props;
  const handleClose = () => {
    setAnchorEl(null);
  };
  const { refStore } = useStore();
  const attachRef = refStore.refMap.get('attachRef');

  return (
    <Mui.Menu
      id="basic-menu"
      anchorEl={anchorEl}
      open={!!anchorEl}
      onClose={handleClose}
      PaperProps={{
        style: S.PaperStyle,
      }}
      sx={{ top: '-40px' }}
    >
      {/* <Mui.MenuItem>
        <Mui.ListItemIcon>
          <Icon.DriveLine width={12} height={12} />
        </Mui.ListItemIcon>
        <S.ListItemText>Drive에서 첨부</S.ListItemText>
      </Mui.MenuItem> */}
      <Mui.MenuItem
        onClick={() => {
          handleClose();
          attachRef?.current?.click();
        }}
      >
        <Mui.ListItemIcon>
          <Icon.DeviceLine width={12} height={12} />
        </Mui.ListItemIcon>
        <S.ListItemText>내 PC에서 첨부</S.ListItemText>
      </Mui.MenuItem>
    </Mui.Menu>
  );
});

export default AttachmentModal;
