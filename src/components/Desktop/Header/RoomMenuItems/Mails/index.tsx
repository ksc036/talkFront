import React from 'react';

import { Icon, Mui } from '@wapl/ui';
import { transaction } from 'mobx';

import { useStore } from '@/stores';

import { RoomMenuItem } from '../../RoomMenu/RoomMenuItem';

interface MailProps extends Mui.MenuItemProps {
  closeMenu: () => void;
}

export const Mails = (props: MailProps) => {
  const { closeMenu } = props;
  const { uiStore } = useStore();
  const handleOnClick = () => {
    transaction(() => {
      uiStore.setMailDialogMode('writeNew');
      uiStore.openDialog('mail');
      closeMenu();
    });
  };

  return (
    <RoomMenuItem
      onClick={handleOnClick}
      icon={<Icon.MailLine width={20} height={20} />}
      text="메일"
      rightButton={<Icon.ArrowFrontLine width={16} height={16} />}
    />
  );
};
