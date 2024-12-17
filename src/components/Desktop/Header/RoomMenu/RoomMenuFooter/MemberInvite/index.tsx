import { useTheme, Icon, Squircle } from '@wapl/ui';
import { observer } from 'mobx-react-lite';

import { useStore } from '@/stores';

import * as S from './style';

export const MemberInvite = observer(() => {
  const { uiStore, configStore } = useStore();
  const { Color } = useTheme();

  const handleInviteDialogOpen = () => {
    uiStore.openDialog('invite');
  };

  return (
    <S.MemberItemWrapper onClick={handleInviteDialogOpen}>
      <Squircle
        size={36}
        color={Color.Gray[100]}
        icon={
          <Icon.Add2Line width={18} height={18} color={configStore.MainColor} />
        }
      />
      <S.RoomMenuText>
        {configStore.FeatureNameType.Room} 멤버 초대
      </S.RoomMenuText>
    </S.MemberItemWrapper>
  );
});
