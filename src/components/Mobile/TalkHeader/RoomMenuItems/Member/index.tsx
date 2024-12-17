import { useCoreStore } from '@wapl/core';
import { Icon } from '@wapl/ui';
import { observer } from 'mobx-react-lite';

import { useStore } from '@/stores';
import * as S from '@desktop/Header/RoomMenuItems/Member/style';

interface MemberProps {
  icon: React.ReactNode;
  userName: string;
  personaId: number;
  onClick?: () => void;
}

export const Member = observer((props: MemberProps) => {
  const { icon, userName, personaId, onClick } = props;
  const { configStore } = useStore();
  const { userStore } = useCoreStore();
  return (
    <>
      <S.MemberItemWrapper onClick={onClick}>
        <S.MemberIcon>{icon}</S.MemberIcon>
        <S.RoomMenuText>
          {(userStore.selectedPersona?.id as number) === personaId && (
            <S.IconWrapper>
              <Icon.MeFill
                width={16}
                height={16}
                color={configStore.MefillColor}
              />
            </S.IconWrapper>
          )}
          {userName}
        </S.RoomMenuText>
      </S.MemberItemWrapper>
    </>
  );
});
