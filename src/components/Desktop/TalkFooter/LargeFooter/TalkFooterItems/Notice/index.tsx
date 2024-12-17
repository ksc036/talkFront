import React from 'react';

import { Icon } from '@wapl/ui';

import TalkFooterItem from '@/components/Desktop/TalkFooter/LargeFooter/TalkFooterItem';
import { useStore } from '@/stores';

const Notice = () => {
  const { uiStore, configStore } = useStore();

  const handleClick = () => {
    uiStore.setNoticeDialogMode('list');
    uiStore.openDialog('notice');
  };

  return (
    <TalkFooterItem
      title="공지"
      icon={
        <Icon.NoticeLine width={24} height={24} color={configStore.IconColor} />
      }
      onClick={handleClick}
    />
  );
};

export default Notice;
