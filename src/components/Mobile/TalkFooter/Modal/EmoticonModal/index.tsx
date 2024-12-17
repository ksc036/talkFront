import { memo } from 'react';

import { Mui } from '@wapl/ui';
import { useObserver } from 'mobx-react';
import { observer } from 'mobx-react-lite';

import { EmoticonType } from '@/@types/emoticon';
import EmoticonList from '@/components/Common/Emoticon/EmoticonList';
import EmoticonTabs from '@/components/Common/Emoticon/EmoticonTabs';
import { useStore } from '@/stores';

import * as S from './Styled';

interface EmoticonModalProps {
  anchorEl: null | HTMLElement;
  onClick: (...args: any[]) => void;
  onClose: (...args: any[]) => void;
}

const EmoticonModal = observer((props: EmoticonModalProps) => {
  const { anchorEl, onClick, onClose } = props;

  const { emoticonStore } = useStore();

  const emoticonIndex = emoticonStore.emoticons.findIndex(
    (emoticon) => emoticon.type === EmoticonType.EMOJI,
  );
  const isEmoticon = useObserver(
    () => emoticonStore.tabIndex === emoticonIndex,
  );
  const gridTemplateWidth = isEmoticon ? 36 : 70;
  const gridTemplateHeight = isEmoticon ? 36 : 60;
  return (
    <Mui.Menu
      id="basic-menu"
      anchorEl={anchorEl}
      open={!!anchorEl}
      onClose={onClose}
      PaperProps={{
        style: S.PaperStyle,
      }}
      sx={S.MenuStyle}
      MenuListProps={{ disablePadding: true }}
      disableEnforceFocus
    >
      <S.Wrapper>
        <S.TabsWrapper>
          <EmoticonTabs emoticonStore={emoticonStore} />
        </S.TabsWrapper>
        <S.ListWrapper
          style={{
            gridTemplateColumns: `repeat(auto-fill,minmax(${gridTemplateWidth}px,auto))`,
            gridAutoRows: `${gridTemplateHeight}px`,
          }}
        >
          <EmoticonList emoticonStore={emoticonStore} onClick={onClick} />
        </S.ListWrapper>
      </S.Wrapper>
    </Mui.Menu>
  );
});

export default memo(EmoticonModal);
