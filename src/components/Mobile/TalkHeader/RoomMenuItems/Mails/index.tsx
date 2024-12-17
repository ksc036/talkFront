import React from 'react';

import { Icon, Mui } from '@wapl/ui';
import { transaction } from 'mobx';

import { RoomMenuItem } from '../../RoomMenuItem';

interface MailProps extends Mui.MenuItemProps {
  closeMenu: () => void;
}

export const Mails = (props: MailProps) => {
  const { closeMenu } = props;

  const handleOnClick = () => {
    transaction(() => {
      // 메일 컴포넌트 연결 필요
      closeMenu();
    });
  };

  return (
    <RoomMenuItem
      onClick={handleOnClick}
      icon={<Icon.MailLine width={20} height={20} />}
      text="메일"
      rightButton={<Icon.ArrowFrontLine width={16} height={16} />}
      rightButtonStyle={{ marginLeft: 'auto' }}
    />
  );
};
