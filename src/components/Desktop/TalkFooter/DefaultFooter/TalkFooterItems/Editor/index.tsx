import { useTheme } from '@wapl/ui';
import { observer } from 'mobx-react-lite';

import { ReactComponent as EditorIcon } from '@/assets/icons/Editor.svg';
import { useStore } from '@/stores';

import TalkFooterItem from '../../TalkFooterItem';

const Editor = observer(() => {
  const { Color } = useTheme();
  const { uiStore, configStore } = useStore();
  return (
    <>
      <TalkFooterItem
        title="에디터"
        icon={
          <EditorIcon
            width={24}
            height={24}
            fill={uiStore.openToolbar ? configStore.MainColor : Color.Gray[900]}
          />
        }
        onClick={() => uiStore.setToolbarVisible(!uiStore.openToolbar)}
      />
    </>
  );
});

export default Editor;
