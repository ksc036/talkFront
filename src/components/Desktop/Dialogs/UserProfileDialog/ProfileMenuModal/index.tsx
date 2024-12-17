import { Dispatch, SetStateAction } from 'react';

import { Icon, Mui, useTheme } from '@wapl/ui';

import * as S from '../styled';

interface ProfileMenuModalProps {
  anchorEl: null | HTMLElement;
  setAnchorEl: Dispatch<SetStateAction<null | HTMLElement>>;
  setTextEditMode: Dispatch<SetStateAction<boolean>>;
}

const ProfileMenuModal = (props: ProfileMenuModalProps) => {
  const { anchorEl, setAnchorEl, setTextEditMode } = props;
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClickMenu = () => {
    setAnchorEl(null);
    setTextEditMode(true);
  };
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
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <Mui.MenuItem
        onClick={handleClickMenu}
        style={{ color: Color.Gray[900] }}
      >
        <Icon.WriteLine width={16} height={16} />
        <S.ListItemText>메모 작성</S.ListItemText>
      </Mui.MenuItem>
    </Mui.Menu>
  );
};

export default ProfileMenuModal;
