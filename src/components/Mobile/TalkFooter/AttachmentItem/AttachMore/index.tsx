import { Icon } from '@wapl/ui';
import { observer } from 'mobx-react-lite';

import TalkFooterItem from '@/components/Desktop/TalkFooter/DefaultFooter/TalkFooterItem';
import { useStore } from '@/stores';

const AttachMore = observer(() => {
  const { refStore } = useStore();
  const handelClick = () => {
    const attachRef = refStore.refMap.get('attachRef');
    attachRef?.current?.click();
  };
  return (
    <TalkFooterItem
      icon={<Icon.Add3Fill width={24} height={24} />}
      onClick={handelClick}
    />
  );
});

export default AttachMore;
