import { Icon } from '@wapl/ui';
import { observer } from 'mobx-react-lite';

import { ButtonWrapper } from '@/components/Common/Button/Styled';
import { LinkSearch } from '@/components/Desktop/LinkDrawer/LinkSearch';
import { useStore } from '@/stores';

import * as S from './styled';

const LinkDrawerHeader = observer(() => {
  const { uiStore } = useStore();

  const handleCloseButtonClick = () => {
    uiStore.setOpenLinkDrawer(false);
  };

  return (
    <S.LinkDrawerHeader>
      <S.LinkDrawerHeaderTitle>링크</S.LinkDrawerHeaderTitle>
      <LinkSearch />
      <ButtonWrapper onClick={handleCloseButtonClick}>
        <Icon.CloseLine />
      </ButtonWrapper>
    </S.LinkDrawerHeader>
  );
});

export default LinkDrawerHeader;
