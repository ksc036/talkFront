import { useTheme } from '@wapl/ui';
import { observer } from 'mobx-react';

import { EmoticonData, EmoticonType } from '@/@types/emoticon';
import { Wrapper } from '@/components/Common/Emoticon/EmoticonItem/Styled';
import { EmoticonStore } from '@/stores/EmoticonStore';
import { isMobile } from '@/utils';

interface EmoticonItemProps {
  emo: EmoticonData;
  emoticonStore: EmoticonStore;
  onClick: (emo: EmoticonData) => void;
  onClose?: () => void;
}

const EmoticonItem = observer((props: EmoticonItemProps) => {
  const { emo, emoticonStore, onClick, onClose } = props;
  const theme = useTheme();
  const isSticker = emo.type === EmoticonType.STICKER;
  const isSelected = emoticonStore.selectedSticker === emo.key;

  const handleClick = () => {
    onClick(emo);
    if (!!onClose) {
      onClose();
    }
  };

  return (
    <Wrapper theme={theme} isSelected={isSelected} onClick={handleClick}>
      <img
        src={emo.thumbnail}
        width={isSticker ? 70 : 26}
        height={isSticker ? 60 : 26}
        style={{ objectFit: 'contain' }}
      />
    </Wrapper>
  );
});

export default EmoticonItem;
