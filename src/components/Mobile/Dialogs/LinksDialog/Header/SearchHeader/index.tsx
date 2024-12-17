import { Icon, useTheme } from '@wapl/ui';

import { ButtonWrapper } from '@/components/Common/Button/Styled';
import { LinkSearch } from '@/components/Desktop/LinkDrawer/LinkSearch';
import { useStore } from '@/stores';

import * as S from '../Styled';

const SearchHeader = () => {
  const { linkStore, uiStore } = useStore();
  const theme = useTheme();
  const handleClose = async () => {
    if (linkStore.isSearched) {
      linkStore.reset();
      await linkStore.getLinks({});
    }
    linkStore.setIsSearchMode(false);
  };
  const handleSearch = async () => {
    await linkStore.search();
    if (!linkStore.links.length) uiStore.openToast('검색 결과가 없습니다.');
  };

  return (
    <S.Wrapper>
      <ButtonWrapper onClick={handleClose}>
        <Icon.ArrowBackLine />
      </ButtonWrapper>
      <LinkSearch style={{ width: '246px' }} />
      <ButtonWrapper
        style={{ color: '#FB4516', font: theme.Font.Text.l.Regular }}
        onClick={handleSearch}
      >
        검색
      </ButtonWrapper>
    </S.Wrapper>
  );
};

export default SearchHeader;
