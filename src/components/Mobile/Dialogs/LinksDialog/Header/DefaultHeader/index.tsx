import { useNavigate } from 'react-router-dom';

import { Icon } from '@wapl/ui';

import { ButtonWrapper } from '@/components/Common/Button/Styled';
import { useStore } from '@/stores';

import * as S from '../Styled';

const DefaultHeader = () => {
  const { linkStore } = useStore();
  const navigate = useNavigate();
  const handleClose = () => {
    navigate(-1);
  };
  const handleSearch = () => {
    linkStore.setIsSearchMode(true);
  };
  return (
    <S.Wrapper>
      <ButtonWrapper onClick={handleClose}>
        <Icon.CloseLine />
      </ButtonWrapper>
      <S.Title>링크</S.Title>
      <ButtonWrapper onClick={handleSearch}>
        <Icon.SearchLine />
      </ButtonWrapper>
    </S.Wrapper>
  );
};

export default DefaultHeader;
