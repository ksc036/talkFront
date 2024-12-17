import { useState, MouseEvent, useEffect } from 'react';

import { useCoreStore } from '@wapl/core';
import { Icon, useTheme } from '@wapl/ui';
import { useObserver } from 'mobx-react';
import { observer } from 'mobx-react-lite';

import { EmoticonData, EmoticonType } from '@/@types/emoticon';
import TalkFooterItem from '@/components/Desktop/TalkFooter/DefaultFooter/TalkFooterItem';
import EmoticonModal from '@/components/Desktop/TalkFooter/Modal/EmoticonModal';
import { useStore } from '@/stores';
import { isMobile } from '@/utils';

const Emoticon = observer(() => {
  const { Color } = useTheme();
  const { emoticonStore, getEditorStore, uiStore, getAttachmentStore } =
    useStore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { roomStore } = useCoreStore();
  const currentRoomId = useObserver(() => roomStore.currentRoomId) as number;
  const editorStore = getEditorStore && getEditorStore(currentRoomId);
  const attachmentStore = getAttachmentStore(currentRoomId);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    if (!attachmentStore.readyToUpload) return;
    setAnchorEl(event.currentTarget);
    uiStore.setEmoticonModalVisible(true);
  };

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

  const handleEmoticonClose = () => {
    setAnchorEl(null);
    uiStore?.setEmoticonModalVisible(false);
  };

  useEffect(() => {
    if (!uiStore.openEmoticonModal) setAnchorEl(null);
  }, [uiStore.openEmoticonModal]);
  return (
    <>
      <TalkFooterItem
        title="이모티콘"
        icon={
          <Icon.Emoji1Line width={24} height={24} color={Color.Gray[900]} />
        }
        onClick={handleClick}
      />
      <EmoticonModal
        anchorEl={anchorEl}
        onClick={handleEmoticonClick}
        onClose={handleEmoticonClose}
      />
    </>
  );
});

export default Emoticon;
