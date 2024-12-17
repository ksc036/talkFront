import React from 'react';

import { Icon, useTheme } from '@wapl/ui';

import TalkFooterItem from '@/components/Desktop/TalkFooter/DefaultFooter/TalkFooterItem';
import { useStore } from '@/stores';

const Notice = () => {
  const { Color } = useTheme();
  const { uiStore } = useStore();

  const handleClick = () => {
    uiStore.setNoticeDialogMode('create');
    uiStore.openDialog('notice');
  };

  return (
    <TalkFooterItem
      title="공지"
      icon={<Icon.NoticeLine width={24} height={24} color={Color.Gray[900]} />}
      onClick={handleClick}
    />
  );
};

export default Notice;
