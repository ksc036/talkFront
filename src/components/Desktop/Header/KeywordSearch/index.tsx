import { useState, useEffect, KeyboardEvent } from 'react';

import { useCoreStore } from '@wapl/core';
import { Icon, SearchField, useTheme } from '@wapl/ui';
import { observer } from 'mobx-react-lite';

import { useStore } from '@/stores';

import * as S from './styled';

interface KeywordSearchProps {
  searchBarWidth?: number;
}

export const KeywordSearch = observer(
  ({ searchBarWidth }: KeywordSearchProps) => {
    const { messageStore, configStore, uiStore } = useStore();
    const { roomStore } = useCoreStore();
    const { Color } = useTheme();

    const [keyword, setKeyword] = useState('');
    const [searchMode, setSearchMode] = useState(false);
    const [noSearchResultMode, setNoSearchResultMode] = useState(false);

    const searchMessage = async () => {
      messageStore.setState('loading');
      await messageStore.scrollToTargetMessageId(
        messageStore.searchResultIds[messageStore.searchIndex],
        undefined,
        roomStore.getRoomById(roomStore.currentRoomId as number)?.myInfo
          ?.joinDate,
      );
      if (!messageStore.isScrolling || !messageStore.isInit) {
        messageStore.setState('done');
      }
    };

    const onSearchButtonClick = async (keyword: string) => {
      if (!keyword.trim()) {
        uiStore.openToast('검색어를 입력해주세요.');
        return;
      }
      if (searchMode) {
        if (keyword === messageStore.searchKeyword) {
          messageStore.increaseSearchIndex();
        }
        if (messageStore.searchResultIds.length > 0) {
          await searchMessage();
        }
      } else {
        try {
          if (!keyword.replace(/\s/g, '')) {
            setSearchMode(false);
            messageStore.setSearchKeyword('');
            messageStore.setSearchResultIds([]);
            return;
          }
          messageStore.setSearchKeyword(keyword);
          const res = await messageStore.getSearchMessagesIds({
            roomId: roomStore.currentRoomId as number,
            keyword,
          });
          if (res.length > 0) {
            setSearchMode(true);
            setNoSearchResultMode(false);
            messageStore.setSearchResultIds(res);
            messageStore.setSearchIndex(0);
            if (messageStore.searchResultIds.length > 0) {
              await searchMessage();
            }
          } else {
            uiStore.openToast('검색 결과가 없습니다.');
            setSearchMode(false);
            messageStore.setSearchResultIds([]);
            setNoSearchResultMode(true);
          }
        } catch (e) {
          console.log(e);
        }
      }
    };

    const onEnterKeyPress = async (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key == 'Enter') {
        e.preventDefault();
        if (searchMode) {
          if (keyword !== messageStore.searchKeyword) {
            await onSearchButtonClick(keyword);
          } else {
            messageStore.increaseSearchIndex();
          }
        } else {
          await onSearchButtonClick(keyword);
        }
        if (messageStore.searchResultIds.length > 0) {
          await searchMessage();
        }
      }
    };

    const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setKeyword(e.target.value);
      setSearchMode(false);
    };

    const onSearchClear = () => {
      setKeyword('');
      setSearchMode(false);
      setNoSearchResultMode(false);
      messageStore.setSearchKeyword('');
      messageStore.setSearchResultIds([]);
    };

    const handleClickUp = async () => {
      messageStore.increaseSearchIndex();
      await searchMessage();
    };

    const handleClickDown = async () => {
      messageStore.decreaseSearchIndex();
      await searchMessage();
    };

    const handleCancelClick = () => {
      uiStore.setShowSearchBar(false);
      onSearchClear();
    };

    const SearchLoadingBar = observer(() => {
      if (keyword.length > 0 && messageStore.state !== 'done') {
        return (
          <S.SearchLoadingWrapper>
            <Icon.LoadingMotion />
          </S.SearchLoadingWrapper>
        );
      }
      return null;
    });

    const SearchNum = observer(() => {
      if (messageStore.searchResultIds.length > 0) {
        return (
          <S.SearchNumWrapper>
            <S.SearchNumText
              className="prefix"
              color={configStore.config.MainColor}
            >
              {messageStore.searchIndex + 1}
            </S.SearchNumText>
            <S.SearchNumDivider />
            <S.SearchNumText className="suffix">
              {messageStore.searchResultIds.length}
            </S.SearchNumText>
          </S.SearchNumWrapper>
        );
      } else if (noSearchResultMode) {
        return (
          <S.SearchNumWrapper>
            <S.SearchNumText className="noResult">0</S.SearchNumText>
            <S.SearchNumDivider />
            <S.SearchNumText className="noResult">0</S.SearchNumText>
          </S.SearchNumWrapper>
        );
      }
      return null;
    });

    useEffect(() => {
      setKeyword('');
      setSearchMode(false);
      setNoSearchResultMode(false);
      messageStore.setSearchResultIds([]);
      messageStore.setSearchKeyword('');
    }, [roomStore.currentRoomId]);

    const isButtonDisabled =
      messageStore.searchResultIds.length === 0 ||
      messageStore.state === 'loading';

    return (
      <S.SearchBarWrapper
        className="SearchBar"
        backGroundColor={configStore.SearchBarStyle.BackgroundColor}
        borderColor={configStore.SearchBarStyle.BorderColor}
        onClick={(event) => event.stopPropagation()}
        searchBarWidth={searchBarWidth}
      >
        <SearchField
          width={searchBarWidth ?? '100%'}
          variant={'filled'}
          value={keyword}
          onClear={onSearchClear}
          onChange={onSearchChange}
          onKeyPress={onEnterKeyPress}
          onSearch={onSearchButtonClick}
          placeholder="대화 내용 검색"
          FixedSuffix={true}
          sx={{
            svg: {
              width: '20px',
              height: '20px',
              g: { transform: 'scale(0.8335)', transformOrigin: 'center' },
            },
          }}
          Prefix={
            <>
              <SearchLoadingBar />
              <SearchNum />
            </>
          }
          Suffix={
            <>
              <S.ArrowBtnWrapper>
                <S.IconBtn
                  onClick={handleClickDown}
                  disabled={isButtonDisabled}
                >
                  <Icon.ArrowBottomLine
                    width={16}
                    height={16}
                    color={isButtonDisabled ? Color.Gray[400] : Color.Gray[700]}
                  />
                </S.IconBtn>
                <S.IconBtn onClick={handleClickUp} disabled={isButtonDisabled}>
                  <Icon.ArrowTopLine
                    width={16}
                    height={16}
                    color={isButtonDisabled ? Color.Gray[400] : Color.Gray[700]}
                  />
                </S.IconBtn>
              </S.ArrowBtnWrapper>
              <S.Splitter />
              <S.CancelButton
                color={configStore.MainColor}
                onClick={handleCancelClick}
              >
                취소
              </S.CancelButton>
            </>
          }
        />
      </S.SearchBarWrapper>
    );
  },
);
