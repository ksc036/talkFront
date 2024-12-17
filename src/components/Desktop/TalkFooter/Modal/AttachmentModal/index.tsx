import { Dispatch, SetStateAction } from 'react';

import { Mui, Icon, useTheme } from '@wapl/ui';

import { useStore } from '@/stores';

import * as S from './Styled';

interface AttachmentModalProps {
  anchorEl: null | HTMLElement;
  setAnchorEl: Dispatch<SetStateAction<null | HTMLElement>>;
}
const AttachmentModal = (props: AttachmentModalProps) => {
  const { anchorEl, setAnchorEl } = props;
  const handleClose = () => {
    setAnchorEl(null);
  };
  const { refStore } = useStore();
  const attachRef = refStore.refMap.get('attachRef');
  const { Color } = useTheme();

  return (
    <Mui.Menu
      id="basic-menu"
      anchorEl={anchorEl}
      open={!!anchorEl}
      onClose={handleClose}
      PaperProps={{
        style: Object.assign(S.PaperStyle, {
          backgroundColor: Color.Background[2],
        }),
      }}
      sx={{ top: '-40px' }}
      disableRestoreFocus
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
        style={{ padding: '10px 20px' }}
      >
        <Mui.ListItemIcon style={{ minWidth: '24px' }}>
          <Icon.DrivePcLine width={16} height={16} />
        </Mui.ListItemIcon>
        <S.ListItemText>내 PC에서 첨부</S.ListItemText>
      </Mui.MenuItem>
    </Mui.Menu>
  );
};

export default AttachmentModal;
