import { forwardRef } from 'react';

import { RoomMember, getDefaultImageURL } from '@wapl/core';
import { useCoreStore } from '@wapl/core';
import { Avatar, Icon, useTheme } from '@wapl/ui';

import { useStore } from '@/stores';
import { EditorStore } from '@/stores/EditorStore';

import * as S from './Styled';

type MentionListItemProps = {
  id: RoomMember['personaId'];
  nick: RoomMember['personaNick'];
  profileImage: RoomMember['profileImageFilepath'];
  editorStore: EditorStore;
  savedIndex: number;
};

const MentionListItem = forwardRef(
  (props: MentionListItemProps, ref: React.ForwardedRef<HTMLDivElement>) => {
    const { id, nick, profileImage, editorStore, savedIndex } = props;
    const { uiStore, configStore } = useStore();
    const { userStore } = useCoreStore();
    const { Color } = useTheme();

    const handleClick = () => {
      uiStore.setOpenMention(false);
      const index = savedIndex - uiStore.mentionKeyword.length;
      editorStore.deleteText(index - 1, uiStore.mentionKeyword.length + index);
      uiStore.setMentionKeyword('');
      editorStore.insertEmbed(index - 1, 'mention', {
        denotationChar: '@',
        index: 0,
        id: id,
        value: nick,
      });
      editorStore.insertText(index, ' ');
      setTimeout(() => {
        editorStore.setCursor(index + 1, 0);
      });
    };

    const defaultImage = getDefaultImageURL({
      type: 'PROFILE',
      personaId: id as number,
    });

    return (
      <S.Wrapper onClick={handleClick} ref={ref}>
        <Avatar
          imgSrc={profileImage !== '' ? profileImage : defaultImage}
          outLineColor="transparent"
          size={36}
        />
        <S.MentionName>
          {id === userStore.selectedPersona?.id && (
            <Icon.MeFill
              width={16}
              height={16}
              color={configStore.MefillColor ?? Color.Gray[900]}
            />
          )}
          {nick}
        </S.MentionName>
      </S.Wrapper>
    );
  },
);

export default MentionListItem;
