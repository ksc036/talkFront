import { Mui, Icon, ContentMenuHeader } from '@wapl/ui';

import { useStore } from '@/stores';

import * as S from './Styled';

interface VoteContextMenuProps {
  open: boolean;
  onClose: () => void;
  handleDeleteVote: () => void;
  handleRoomNotice: () => void;
  handleEditMode: () => void;
  activateEdit: boolean;
  activateDelete: boolean;
}
const VoteContextMenu = (props: VoteContextMenuProps) => {
  const {
    open,
    onClose,
    handleDeleteVote,
    handleRoomNotice,
    handleEditMode,
    activateEdit,
    activateDelete,
  } = props;

  const { configStore } = useStore();

  return (
    <S.StyledContextMenu open={open} onClose={onClose}>
      <ContentMenuHeader>더 보기</ContentMenuHeader>
      {activateEdit && (
        <Mui.MenuItem onClick={handleEditMode}>
          <Mui.ListItemIcon>
            <Icon.EditLine width={20} height={20} />
          </Mui.ListItemIcon>
          <S.ListItemText>수정</S.ListItemText>
        </Mui.MenuItem>
      )}
      {activateDelete && (
        <Mui.MenuItem onClick={handleDeleteVote}>
          <Mui.ListItemIcon>
            <Icon.DeleteLine width={20} height={20} />
          </Mui.ListItemIcon>
          <S.ListItemText>삭제</S.ListItemText>
        </Mui.MenuItem>
      )}
      <Mui.MenuItem onClick={handleRoomNotice}>
        <Mui.ListItemIcon>
          <Icon.NoticeLine width={20} height={20} />
        </Mui.ListItemIcon>
        <S.ListItemText>{configStore.FeatureNameType.Room} 공지</S.ListItemText>
      </Mui.MenuItem>
    </S.StyledContextMenu>
  );
};

export default VoteContextMenu;
