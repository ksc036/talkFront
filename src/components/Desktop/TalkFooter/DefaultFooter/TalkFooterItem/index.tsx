import { Tooltip, useTheme } from '@wapl/ui';

import * as S from './styled';
interface TalkFooterItemProps {
  icon?: React.ReactNode; // 임시로 ReactNode
  title?: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

const TalkFooterItem = (props: TalkFooterItemProps) => {
  const { icon, title, onClick } = props;
  const theme = useTheme();
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
      <S.StyledButton onClick={onClick}>{icon}</S.StyledButton>
    </Tooltip>
  );
};

export default TalkFooterItem;
