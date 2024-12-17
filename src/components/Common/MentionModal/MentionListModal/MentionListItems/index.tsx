import { useEffect, useRef } from 'react';

import { RoomMember } from '@wapl/core';
import { useTheme } from '@wapl/ui';
import { observer } from 'mobx-react';

import MentionListItem from '@/components/Common/MentionModal/MentionListModal/MentionListItem';
import { useStore } from '@/stores';
import { EditorStore } from '@/stores/EditorStore';
import { isMobile } from '@/utils';

import * as S from './Styled';

interface MentionListItemsProps {
  mentionMemberList: RoomMember[];
  editorStore: EditorStore;
  savedIndex: number;
  keyword: string;
}

const MentionListItems = observer((props: MentionListItemsProps) => {
  const { mentionMemberList, editorStore, savedIndex, keyword } = props;
  const theme = useTheme();
  const { uiStore } = useStore();

  const mobileModalRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const previousFocusedItemRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const focusedItemRef = itemRefs.current[uiStore.mentionSelected];
    if (focusedItemRef) {
      if (previousFocusedItemRef.current) {
        previousFocusedItemRef.current.style.backgroundColor = '';
      }
      focusedItemRef.style.backgroundColor = theme.Color.Gray[100];
      focusedItemRef.scrollIntoView({ block: 'nearest' });
      previousFocusedItemRef.current = focusedItemRef;
    }
    uiStore.setMentionTarget(
      mentionMemberList[uiStore.mentionSelected]?.personaId,
      mentionMemberList[uiStore.mentionSelected]?.personaNick,
    );
  }, [uiStore.mentionSelected, mentionMemberList]);

  useEffect(() => {
    if (isMobile()) {
      const mobileQuillElement = document.getElementById('talk-quill');
      const handleCloseMention = (event: MouseEvent) => {
        if (
          mobileModalRef.current &&
          !(
            mobileModalRef.current.contains(event.target as Node) ||
            mobileQuillElement?.contains(event.target as Node)
          )
        ) {
          uiStore.setOpenMention(false);
        }
      };

      document.addEventListener('mousedown', handleCloseMention);

      return () => {
        document.removeEventListener('mousedown', handleCloseMention);
      };
    }
  }, []);

  if (isMobile())
    return (
      <S.WrapperMobile ref={mobileModalRef}>
        {mentionMemberList.map((roomMember: RoomMember) => (
          <MentionListItem
            key={roomMember.personaId + roomMember.personaNick}
            id={roomMember.personaId}
            nick={roomMember.personaNick}
            profileImage={roomMember.profileImageFilepath ?? ''}
            editorStore={editorStore}
            savedIndex={savedIndex}
          />
        ))}
      </S.WrapperMobile>
    );

  return (
    <S.Wrapper>
      {mentionMemberList.map((roomMember: RoomMember, idx) => (
        <MentionListItem
          key={roomMember.personaId + roomMember.personaNick}
          id={roomMember.personaId}
          nick={roomMember.personaNick}
          profileImage={roomMember.profileImageFilepath ?? ''}
          editorStore={editorStore}
          savedIndex={savedIndex}
          ref={(el: HTMLDivElement) => (itemRefs.current[idx] = el)}
        />
      ))}
    </S.Wrapper>
  );
});

export default MentionListItems;
