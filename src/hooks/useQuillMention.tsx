import { useCallback, useMemo } from 'react';

import { PersonaModel } from '@wapl/core';

import { defaultProfile } from '@/assets/profile';
import { useStore } from '@/stores';

// 유저 모델 fix 전 임시 any
export const useQuillMention = (members: readonly PersonaModel[]) => {
  const { uiStore } = useStore();
  // TODO?: 탈퇴 멤버 filter
  const mentionHTML = useCallback(
    ({
      id,
      nick,
      profileImage,
    }: {
      id: PersonaModel['id'];
      nick: PersonaModel['nick'];
      profileImage: PersonaModel['profileImage'];
    }) => `
    <div data-mention-id="${id}" class="ql-mention-list-box">
      <img class="ql-mention-list-img" src="${
        profileImage?.small ?? defaultProfile
      }"></img>
      <div class="ql-mention-list-name">${nick}</div>
    </div>`,
    [],
  );

  // 멘션 리스트 아이템이 클릭되었을때 불리는 함수
  const handleSelect = useCallback(
    (item: PersonaModel, insertItem: (item: any) => void) => {
      const user = members.find((member: PersonaModel) => {
        return member.id == item.id;
      });
      if (user) insertItem({ ...item, value: user.nick });
    },
    [members],
  );

  const modules = useMemo(
    () => ({
      mention: {
        allowedChars: /.*/,
        mentionDenotationChars: ['@'],
        // Email 처리
        isolateCharacter: true,
        defaultMenuOrientation: 'top',
        fixMentionsToQuill: true,
        source(term: any, render: any, mentionChar: any) {
          if (term === '') uiStore.setOpenMention(true);
        },
        renderItem: mentionHTML,
        onOpen: () => {
          console.log('on open');
        },
        onClose: () => {
          console.log('on close');
        },
        onSelect: handleSelect,
      },
    }),
    [handleSelect, members, mentionHTML],
  );

  return modules;
};
