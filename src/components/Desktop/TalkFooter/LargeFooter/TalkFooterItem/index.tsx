import { Tooltip, Mui, useTheme } from '@wapl/ui';

import * as S from './styled';
interface TalkFooterItemProps extends Mui.ButtonProps {
  icon?: React.ReactNode; // 임시로 ReactNode
}

const TalkFooterItem = (props: TalkFooterItemProps) => {
  const theme = useTheme();

  const { icon, title = '', ...rest } = props;
  return (
    <Tooltip
      title={title || ''}
      sx={{
        '.MuiTooltip-tooltip': {
          color: theme.Color.Background[0],
          backgroundColor: theme.Color.Gray[900],
        },
      }}
    >
      <S.StyledButton {...rest}>{icon}</S.StyledButton>
    </Tooltip>
  );
};

export default TalkFooterItem;
