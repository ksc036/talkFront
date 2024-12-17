import { useTheme } from '@wapl/ui';
import { observer } from 'mobx-react';

import {
  Wrapper,
  IconWrapper,
} from '@/components/Common/Emoticon/EmoticonTab/Styled';
import { EmoticonModel } from '@/models';
import { useStore } from '@/stores';
import { EmoticonStore } from '@/stores/EmoticonStore';

interface EmoticonTabProps {
  index: number;
  emoticonStore: EmoticonStore;
  emoticon: EmoticonModel;
}

const EmoticonTab = observer((props: EmoticonTabProps) => {
  const { index, emoticonStore, emoticon } = props;
  const onClickHandeler = () => {
    emoticonStore.setIndex(index);
  };
  const isSelected = emoticonStore.tabIndex === index;
  const theme = useTheme();
  const { configStore } = useStore();
  return (
    <Wrapper
      theme={theme}
      onClick={onClickHandeler}
      isSelected={isSelected}
      selectedColor={configStore.MainColor}
    >
      <IconWrapper theme={theme} isSelected={isSelected}>
        {isSelected ? <>{emoticon.activeIcon}</> : <>{emoticon.inactiveIcon}</>}
      </IconWrapper>
    </Wrapper>
  );
});

export default EmoticonTab;
