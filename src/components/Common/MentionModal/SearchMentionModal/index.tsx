import { memo } from 'react';

import { Mui, useTheme } from '@wapl/ui';

import { isMobile } from '@/utils';

import * as S from './Styled';

interface SearchMentionModalProps {
  handleClose: () => void;
}

const SearchMentionModal = (props: SearchMentionModalProps) => {
  const { handleClose } = props;

  const { Color } = useTheme();

  const desktopSx = { top: -10 };
  const mobileSx = { top: -16 };

  return (
    <Mui.Menu
      id="basic-menu"
      anchorEl={document.getElementById('talk-quill')}
      open={true}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      PaperProps={{
        style: {
          borderRadius: '10px',
          backgroundColor: Color.Background[2],
          width: '360px',
        },
      }}
      MenuListProps={{ disablePadding: true }}
      sx={isMobile() ? mobileSx : desktopSx}
      disableAutoFocus
    >
      <S.Wrapper>두 글자 이상 입력으로 멘션 리스트 호출</S.Wrapper>
    </Mui.Menu>
  );
};

export default memo(SearchMentionModal);
