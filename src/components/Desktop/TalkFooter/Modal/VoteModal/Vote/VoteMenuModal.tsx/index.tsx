import { Dispatch, SetStateAction } from 'react';

import { Mui, Icon, useTheme } from '@wapl/ui';

import { useStore } from '@/stores';

import * as S from './Styled';

interface VoteMenuModalProps {
  anchorEl: null | HTMLElement;
  setAnchorEl: Dispatch<SetStateAction<null | HTMLElement>>;
  handleDeleteVote: () => void;
  handleRoomNotice: () => void;
  handleEditMode: () => void;
  activateEdit: boolean;
  activateDelete: boolean;
}
const VoteMenuModal = (props: VoteMenuModalProps) => {
  const {
    anchorEl,
    setAnchorEl,
    handleDeleteVote,
    handleRoomNotice,
    handleEditMode,
    activateEdit,
    activateDelete,
  } = props;
  const handleClose = () => {
    setAnchorEl(null);
  };
  const { Color } = useTheme();
  const { configStore } = useStore();

  const menueItems = [
    {
      key: 'edit',
      title: '수정',
      onClick: handleEditMode,
      icon: <Icon.EditLine width={16} height={16} />,
      hide: !activateEdit,
    },
    {
      key: 'delete',
      title: '삭제',
      onClick: handleDeleteVote,
      icon: <Icon.DeleteLine width={16} height={16} />,
      hide: !activateDelete,
    },
    {
      key: 'notice',
      title: `${configStore.FeatureNameType.Room} 공지`,
      onClick: handleRoomNotice,
      icon: <Icon.NoticeLine width={16} height={16} />,
    },
  ];

  return (
    <Mui.Menu
      id="basic-menu"
      anchorEl={anchorEl}
      open={!!anchorEl}
      onClose={handleClose}
      PaperProps={{
        style: Object.assign(S.PaperStyle, {
          backgroundColor: Color.Background[2],
          marginTop: '8px',
        }),
      }}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
    >
      {menueItems.map((item) => {
        if (!item.hide) {
          return (
            <S.ListItemWrapper key={item.key} onClick={item.onClick}>
              {item.icon}
              <S.ListItemText>{item.title}</S.ListItemText>
            </S.ListItemWrapper>
          );
        }
      })}
    </Mui.Menu>
  );
};

export default VoteMenuModal;
