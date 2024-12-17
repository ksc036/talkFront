import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';

import { useCoreStore, RoomMember } from '@wapl/core';

import { useStore } from '@/stores';
import { isMobile } from '@/utils';

import * as S from './Styled';

interface SearchMentionProps {
  searched: boolean;
  searchText: string;
  setSearched: (bool: boolean) => void;
  setSearchText: (text: string) => void;
  setRoomMemberList: (p: RoomMember[]) => void;
  setSavedIndex: (range: number) => void;
}

const SearchMention = (props: SearchMentionProps) => {
  const {
    searched,
    searchText,
    setSearched,
    setSearchText,
    setRoomMemberList,
    setSavedIndex,
  } = props;
  const { roomStore } = useCoreStore();
  const { getEditorStore } = useStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const [disabled, setDisabled] = useState(false);
  const handleEnter = async (e: KeyboardEvent<HTMLInputElement>) => {
    const trimmedSearchText = searchText.trim();

    if (trimmedSearchText.length < 2) return;

    if (e.key === 'Enter') {
      const index = getEditorStore(roomStore.currentRoomId as number).quill
        .selection.savedRange.index;
      setSavedIndex(index);
      setDisabled(true);

      const roomMembers = roomStore.getRoomMemberList(
        roomStore.currentRoomId as number,
      );
      const searchedRoomMembers = roomMembers.filter((roomMember: RoomMember) =>
        roomMember.personaNick.includes(trimmedSearchText),
      );

      setRoomMemberList(searchedRoomMembers);
      setSearched(true);
    }
  };
  useEffect(() => {
    setTimeout(() => {
      if (searched && inputRef.current) inputRef.current.focus();
    }, 0);
  }, []);

  if (isMobile())
    return (
      <S.WrapperMobile>
        <S.StyledInputMobile
          type="text"
          value={searchText}
          ref={inputRef}
          placeholder="2글자 이상 검색"
          onKeyDown={handleEnter}
          onInput={(e: ChangeEvent<HTMLInputElement>) => {
            setSearchText(e.target.value);
          }}
          disabled={disabled}
        ></S.StyledInputMobile>
      </S.WrapperMobile>
    );

  return (
    <S.Wrapper>
      <S.StyledInput
        type="text"
        value={searchText}
        ref={inputRef}
        placeholder="2글자 이상 검색"
        onKeyDown={handleEnter}
        onInput={(e: ChangeEvent<HTMLInputElement>) => {
          setSearchText(e.target.value);
        }}
        disabled={disabled}
      ></S.StyledInput>
    </S.Wrapper>
  );
};

export default SearchMention;
