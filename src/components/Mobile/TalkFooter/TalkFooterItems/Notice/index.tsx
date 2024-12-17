import React from 'react';

import { Icon, useTheme } from '@wapl/ui';
import { observer } from 'mobx-react-lite';

import TalkFooterItem from '@/components/Desktop/TalkFooter/DefaultFooter/TalkFooterItem';
import { useStore } from '@/stores';

const Notice = observer(() => {
  const { Color } = useTheme();
  const { uiStore } = useStore();

  const handleClick = () => {
    uiStore.setNoticeDialogMode('list');
    uiStore.openDialog('notice');
  };

  return (
    <TalkFooterItem
      icon={<Icon.NoticeLine width={24} height={24} color={Color.Gray[900]} />}
      onClick={handleClick}
    />
  );
});

export default Notice;
