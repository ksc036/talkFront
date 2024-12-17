import { Dispatch, SetStateAction, useState, KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { useCoreStore } from '@wapl/core';
import { SearchField, useTheme } from '@wapl/ui';
import { observer } from 'mobx-react-lite';

import { useStore } from '@/stores';

import * as S from './styled';

interface SearchBarProps {
  searchMode: boolean;
  setSearchMode: Dispatch<SetStateAction<boolean>>;
}
const SearchBar = observer(({ searchMode, setSearchMode }: SearchBarProps) => {
  const { messageStore, uiStore, configStore } = useStore();
  const { roomStore } = useCoreStore();

  const [keyword, setKeyWord] = useState('');
  const [noSearchResultMode, setNoSearchResultMode] = useState(false);
  const navigate = useNavigate();
  const { Color } = useTheme();

  const RenderMode = observer(() => {
    if (messageStore.searchResultIds.length > 0) {
      return (
        <S.SearchNum color={configStore.config.MainColor}>
          <span>{messageStore.searchIndex + 1}</span>/
          {messageStore.searchResultIds.length}
        </S.SearchNum>
      );
    } else if (noSearchResultMode) {
      return (
        <S.NoSearchResult>
          <span>0</span>/0
        </S.NoSearchResult>
      );
    }
    return null;
  });

  const onSearchButtonClick = async () => {
    if (!keyword.trim()) {
      uiStore.openToast('검색어를 입력해주세요.');
      return;
    }
    messageStore.setSearchKeyword(keyword);
    try {
      if (!keyword) {
        messageStore.setSearchResultIds([]);
        return;
      }
      const res = await messageStore.getSearchMessagesIds({
        roomId: roomStore.currentRoomId as number,
        keyword,
      });
      if (res.length > 0) {
        messageStore.setSearchResultIds(res);
        messageStore.setSearchIndex(0);
        setNoSearchResultMode(false);
      } else {
        uiStore.openToast('검색 결과가 없습니다.');
        messageStore.setSearchResultIds([]);
        setNoSearchResultMode(true);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onEnterKeyPress = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key == 'Enter') {
      e.preventDefault();
      if (searchMode) {
        if (keyword !== messageStore.searchKeyword) {
          await onSearchButtonClick();
        } else {
          messageStore.increaseSearchIndex();
        }
      } else {
        await onSearchButtonClick();
      }
      if (messageStore.searchResultIds.length > 0) {
        await messageStore.scrollToTargetMessageId(
          messageStore.searchResultIds[messageStore.searchIndex],
        );
      }
    }
  };

  const hideMobileKeyboardOnReturn = (element: any) => {
    element.addEventListener('keyup', (keyboardEvent: any) => {
      const key = keyboardEvent.code || keyboardEvent.keyCode;
      if (key === 'Enter' || key === 13) {
        element.blur();
      }
    });
  };

  document.querySelectorAll('[type=search]').forEach((element) => {
    hideMobileKeyboardOnReturn(element);
  });

  return (
    <>
      <S.SearchBarWrapper
        backGroundColor={configStore.SearchBarStyle.BackgroundColor}
        borderColor={configStore.SearchBarStyle.BorderColor}
      >
        <SearchField
          autoFocus={true}
          width={'calc(100vw - 80px)'}
          variant={'filled'}
          value={keyword}
          onClear={() => {
            setKeyWord('');
            setNoSearchResultMode(false);
            messageStore.setSearchKeyword('');
            messageStore.setSearchResultIds([]);
          }}
          onChange={(e) => setKeyWord(e.target.value)}
          onKeyPress={onEnterKeyPress}
          placeholder="대화 내용 검색"
          FixedSuffix={true}
          Prefix={<RenderMode />}
        />
      </S.SearchBarWrapper>

      {messageStore.searchResultIds.length > 0 ? (
        <S.CancelWrapperActive
          onClick={() => {
            setSearchMode(false);
            setNoSearchResultMode(false);
            messageStore.setSearchKeyword('');
            messageStore.setSearchResultIds([]);
            navigate(-1);
          }}
        >
          취소
        </S.CancelWrapperActive>
      ) : (
        <S.CancelWrapper
          onClick={() => {
            setSearchMode(false);
            setNoSearchResultMode(false);
            messageStore.setSearchKeyword('');
            messageStore.setSearchResultIds([]);
            navigate(-1);
          }}
        >
          취소
        </S.CancelWrapper>
      )}
    </>
  );
});

export default SearchBar;
