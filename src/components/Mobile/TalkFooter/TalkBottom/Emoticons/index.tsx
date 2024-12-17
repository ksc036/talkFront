import { memo } from 'react';

import { useCoreStore } from '@wapl/core';
import { useTheme } from '@wapl/ui';
import { useObserver } from 'mobx-react';
import { observer } from 'mobx-react-lite';

import { EmoticonData, EmoticonType } from '@/@types/emoticon';
import EmoticonList from '@/components/Common/Emoticon/EmoticonList';
import EmoticonTabs from '@/components/Common/Emoticon/EmoticonTabs';
import { useStore } from '@/stores';
import { isMobile } from '@/utils';

import * as S from './Styled';

const Emoticons = observer(() => {
  const { emoticonStore, getEditorStore, uiStore } = useStore();
  const theme = useTheme();
  const { roomStore } = useCoreStore();
  const currentRoomId = useObserver(() => roomStore.currentRoomId) as number;
  const editorStore = getEditorStore(currentRoomId);
  const emoticonIndex = emoticonStore.emoticons.findIndex(
    (emoticon) => emoticon.type === EmoticonType.EMOJI,
  );
  const isEmoticon = useObserver(
    () => emoticonStore.tabIndex === emoticonIndex,
  );
  const gridTemplateWidth = isEmoticon ? 36 : 70;
  const gridTemplateHeight = isEmoticon ? 36 : 60;

  const handleEmoticonClick = (emo: EmoticonData) => {
    const isSticker = emo.type === EmoticonType.STICKER;
    if (isSticker) {
      emoticonStore.setSelectedSticker(emo.key);
      uiStore.setStickerPreview(true);
    } else {
      const range = editorStore.getSelection();
      if (!range) return;
      const { index } = range;
      const value = {
        src: emo.image,
        type: emo.type,
        alt: emo.key,
        colons: `:${emo.key}:`,
      };
      editorStore.insertEmbed(index, String(emo.type), value, 'user');
      editorStore.setCursor(index + 1, 0);
    }
    if (!isMobile()) editorStore?.focus();
  };
  return (
    <S.Wrapper>
      <S.TabsWrapper theme={theme}>
        <EmoticonTabs emoticonStore={emoticonStore} />
      </S.TabsWrapper>
      <S.ListWrapper
        style={{
          gridTemplateColumns: `repeat(auto-fill,minmax(${gridTemplateWidth}px,auto))`,
          gridAutoRows: `${gridTemplateHeight}px`,
        }}
      >
        <EmoticonList
          emoticonStore={emoticonStore}
          onClick={handleEmoticonClick}
        />
      </S.ListWrapper>
    </S.Wrapper>
  );
});

export default memo(Emoticons);
