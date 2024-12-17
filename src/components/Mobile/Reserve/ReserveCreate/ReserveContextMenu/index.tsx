import { observer } from 'mobx-react-lite';

import * as S from './styled';

interface ReserveContextMenuProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'reserveDate' | 'reserveTime' | 'alarm';
  state: number;
  action: (minutes: number) => void;
}

const ReserveContextMenu = observer(
  ({ isOpen, onClose, mode, state, action }: ReserveContextMenuProps) => {
    const title = () => {
      switch (mode) {
        case 'reserveDate':
          return '예약 메시지 발송일';
        case 'reserveTime':
          return '예약 메시지 발송 시간';
        case 'alarm':
          return '전송 전 예약 알림';
        default:
          return '';
      }
    };

    const alarmOptions = [
      { value: 0, label: '없음' },
      { value: 5, label: '5분 전' },
      { value: 10, label: '10분 전' },
      { value: 20, label: '20분 전' },
      { value: 30, label: '30분 전' },
    ];

    const handleItemClick = (value: number) => {
      action(value);
      onClose();
    };

    return (
      <S.BottomContextMenu
        anchor="bottom"
        open={isOpen}
        onClose={onClose}
        disablePortal
      >
        <S.DrawerTitle>{title()}</S.DrawerTitle>

        <S.DrawerList>
          {mode === 'alarm' &&
            alarmOptions.map((option) => (
              <S.DrawerListItem
                key={option.value}
                selected={state === option.value}
                onClick={() => handleItemClick(option.value)}
              >
                <S.DrawerListText primary={option.label} />
              </S.DrawerListItem>
            ))}
        </S.DrawerList>
      </S.BottomContextMenu>
    );
  },
);

export default ReserveContextMenu;
