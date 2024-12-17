import { Icon } from '@wapl/ui';

import TalkFooterItem from '@/components/Desktop/TalkFooter/LargeFooter/TalkFooterItem';
import { useStore } from '@/stores';
import { EditorStore } from '@/stores/EditorStore';

const Mention = (props: { editorStore: EditorStore }) => {
  const { editorStore } = props;
  const { configStore } = useStore();

  const handleClick = () => {
    const range = editorStore.getSelection();
    if (!range) return;
    const { index } = range;
    const toInsert = index === 0 ? '@' : ' @';
    const jump = index === 0 ? 1 : 2;
    editorStore.insertText(index, toInsert, 'user');
    editorStore.setCursor(index + jump, 0);
    editorStore.focus();
  };
  return (
    <>
      <TalkFooterItem
        title="멘션"
        icon={
          <Icon.MentionLine
            width={24}
            height={24}
            color={configStore.IconColor}
          />
        }
        onClick={handleClick}
      />
    </>
  );
};

export default Mention;
