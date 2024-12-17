import { observer } from 'mobx-react';

import { EmoticonData } from '@/@types/emoticon';
import EmoticonItem from '@/components/Common/Emoticon/EmoticonItem';
import { EmoticonStore } from '@/stores/EmoticonStore';

interface EmoticonListProps {
  emoticonStore: EmoticonStore;
  onClick: (emo: EmoticonData) => void;
  onClose?: () => void;
}

const EmoticonList = observer((props: EmoticonListProps) => {
  const { emoticonStore, onClick, onClose } = props;
  return (
    <>
      {emoticonStore.selectedTab.emoticons.map((emo) => (
        <EmoticonItem
          key={emo.key}
          emo={emo}
          emoticonStore={emoticonStore}
          onClick={onClick}
          onClose={onClose}
        />
      ))}
    </>
  );
});

export default EmoticonList;
