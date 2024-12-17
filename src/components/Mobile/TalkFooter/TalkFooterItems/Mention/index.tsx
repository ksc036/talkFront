import { useNavigate } from 'react-router-dom';

import { Icon, useTheme } from '@wapl/ui';
import { observer } from 'mobx-react-lite';

import { useStore } from '@/stores';
import { EditorStore } from '@/stores/EditorStore';
import TalkFooterItem from '@mobile/TalkFooter/TalkFooterItem';

const Mention = observer((props: { editorStore: EditorStore }) => {
  const { editorStore } = props;
  const { emoticonStore, uiStore } = useStore();
  const { Color } = useTheme();
  const navigate = useNavigate();
  const handleClick = () => {
    emoticonStore.setSelectedSticker('');
    uiStore.setStickerPreview(false);
    if (location.pathname.includes('bottomItems')) navigate(-1);
    const range = editorStore.getSelection();
    if (!range) return;
    const { index } = range;
    const toInsert = index === 0 ? '@' : ' @';
    const jump = index === 0 ? 1 : 2;
    setTimeout(() => {
      editorStore.insertText(index, toInsert, 'user');
      editorStore.setCursor(index + jump, 0);
      editorStore.focus();
    }, 100);
  };

  return (
    <>
      <TalkFooterItem
        icon={
          <Icon.MentionLine width={24} height={24} color={Color.Gray[400]} />
        }
        onClick={handleClick}
      />
    </>
  );
});

export default Mention;
