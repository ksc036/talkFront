import { Icon } from '@wapl/ui';

import TalkFooterItem from '@/components/Desktop/TalkFooter/DefaultFooter/TalkFooterItem';
import { useStore } from '@/stores';

const AttachMore = () => {
  const { refStore } = useStore();
  const handelClick = () => {
    const attachRef = refStore.refMap.get('attachRef');
    attachRef?.current?.click();
  };
  return (
    <TalkFooterItem
      icon={<Icon.Add1Line width={24} height={24} />}
      onClick={handelClick}
    />
  );
};

export default AttachMore;
