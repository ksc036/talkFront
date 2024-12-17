import { useTheme } from '@wapl/ui';
import { useObserver } from 'mobx-react';

import CancelButton from '@/components/Desktop/TalkFooter/ReplyInfo/CancleButton';
import {
  StyledImg,
  Wrapper,
} from '@/components/Desktop/TalkFooter/StickerPreview/Styled';
import { EmoticonModel } from '@/models';
import { EmoticonStore } from '@/stores/EmoticonStore';
import { UIStore } from '@/stores/UIStore';

interface StickerPreviewProps {
  emoticonStore: EmoticonStore;
  uiStore: UIStore;
}

const StickerPreview = (props: StickerPreviewProps) => {
  const { emoticonStore, uiStore } = props;
  const theme = useTheme();
  const selected = useObserver(() => emoticonStore.selectedSticker);
  const sticker = EmoticonModel.getEmoticon(selected);
  const clickCancel = () => {
    emoticonStore.setSelectedSticker('');
    uiStore.setStickerPreview(false);
  };
  return (
    <Wrapper theme={theme}>
      <StyledImg src={sticker?.image} />
      <CancelButton
        onClick={clickCancel}
        style={{
          position: 'static',
        }}
        width={16}
        height={16}
      />
    </Wrapper>
  );
};

export default StickerPreview;
