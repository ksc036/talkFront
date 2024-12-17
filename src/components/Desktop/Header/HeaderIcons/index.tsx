import { Tooltip, useTheme } from '@wapl/ui';
import { observer } from 'mobx-react-lite';

import { useStore } from '@/stores';

import * as S from './styled';

type HeaderIconProps = {
  icon: JSX.Element;
  name: string;
  onClick?: () => void;
};

const HeaderIcon = observer(({ icon, name, onClick }: HeaderIconProps) => {
  const { Color } = useTheme();
  const { configStore } = useStore();

  return (
    <Tooltip
      title={name}
      sx={{
        '.MuiTooltip-tooltip': {
          visibility: configStore.ShowHeaderItemName ? 'hidden' : 'visible',
          color: Color.Background[0],
          backgroundColor: Color.Gray[900],
        },
      }}
    >
      <S.IconWrapper onClick={onClick} hasText={configStore.ShowHeaderItemName}>
        {icon}
        {configStore.ShowHeaderItemName && name}
      </S.IconWrapper>
    </Tooltip>
  );
});

export default HeaderIcon;
