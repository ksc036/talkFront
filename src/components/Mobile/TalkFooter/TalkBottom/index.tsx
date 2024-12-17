import { observer } from 'mobx-react-lite';

import BottomItems from '@/components/Mobile/TalkFooter/TalkBottom/BottomItems';
import Emoticons from '@/components/Mobile/TalkFooter/TalkBottom/Emoticons';
import { useStore } from '@/stores';

const TalkBottom = observer(() => {
  const { uiStore } = useStore();
  if (uiStore.openEmoticonModal) return <Emoticons />;

  return <BottomItems />;
});

export default TalkBottom;
