import { useEffect, KeyboardEvent } from 'react';

import { useCoreStore } from '@wapl/core';
import { SearchField } from '@wapl/ui';
import { observer } from 'mobx-react-lite';

import { useStore } from '@/stores';

import * as S from './Styled';

interface LinkSearchProps {
  style?: React.CSSProperties;
}

export const LinkSearch = observer((props: LinkSearchProps) => {
  const { linkStore, uiStore, configStore } = useStore();
  const { roomStore } = useCoreStore();

  const onSearchButtonClick = async () => {
    await linkStore.search();
    if (!linkStore.links.length) uiStore.openToast('검색 결과가 없습니다.');
  };

  const onEnterKeyPress = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key == 'Enter') {
      e.preventDefault();
      await linkStore.search();
      if (!linkStore.links.length) uiStore.openToast('검색 결과가 없습니다.');
    }
  };

  const handleClear = async () => {
    linkStore.setKeyword('');
    if (linkStore.isSearched) {
      linkStore.reset();
      await linkStore.getLinks({});
    }
    linkStore.setIsSearchMode(false);
  };

  useEffect(() => {
    linkStore.setKeyword('');
  }, [roomStore.currentRoomId]);

  return (
    <S.SearchBarWrapper
      className="SearchBar"
      backGroundColor={configStore.SearchBarStyle.BackgroundColor}
      borderColor={configStore.SearchBarStyle.BorderColor}
    >
      <SearchField
        width={'360px'}
        variant={'filled'}
        value={linkStore.keyword}
        onClear={handleClear}
        onChange={(e) => linkStore.setKeyword(e.target.value)}
        onKeyPress={onEnterKeyPress}
        onSearch={onSearchButtonClick}
        placeholder="링크명 검색"
        FixedSuffix={true}
      />
    </S.SearchBarWrapper>
  );
});
