import { useNavigate } from 'react-router-dom';

import { useCoreStore } from '@wapl/core';
import { Icon, useTheme } from '@wapl/ui';
import { observer } from 'mobx-react-lite';

import { useStore } from '@/stores';
import TalkFooterItem from '@mobile/TalkFooter/TalkFooterItem';

const Open = observer(() => {
  const { Color } = useTheme();
  const { uiStore } = useStore();
  const { roomStore } = useCoreStore();

  const navigate = useNavigate();
  const isOpen = location.pathname.includes('bottomItems');

  const handleClick = () => {
    if (isOpen) {
      navigate(-1);
      uiStore.setEmoticonModalVisible(false);
    } else {
      uiStore.setEmoticonModalVisible(false);
      navigate(`/talk/${roomStore.currentRoomId}/bottomItems`);
    }
  };

  return (
    <TalkFooterItem
      icon={
        <Icon.Add2Line
          width={24}
          height={24}
          color={isOpen ? Color.Gray[900] : Color.Gray[400]}
          className={isOpen ? 'rotate-45' : ''}
        />
      }
      onClick={handleClick}
    />
  );
});

export default Open;
