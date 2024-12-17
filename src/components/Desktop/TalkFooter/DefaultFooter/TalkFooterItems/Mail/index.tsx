import React from 'react';

import { Icon, useTheme } from '@wapl/ui';

import TalkFooterItem from '@/components/Desktop/TalkFooter/DefaultFooter/TalkFooterItem';
import { useStore } from '@/stores';

const Mail = () => {
  const { Color } = useTheme();
  const { uiStore } = useStore();

  const handleClick = () => {
    uiStore.setMailDialogMode('writeNew');
    uiStore.openDialog('mail');
  };

  return (
    <TalkFooterItem
      title="메일"
      icon={<Icon.MailLine width={24} height={24} color={Color.Gray[900]} />}
      onClick={handleClick}
    />
  );
};

export default Mail;
