import { Mui } from '@wapl/ui';

import * as S from './styled';
interface TalkFooterItemProps extends Mui.ButtonProps {
  icon?: React.ReactNode; // 임시로 ReactNode
}

const TalkFooterItem = (props: TalkFooterItemProps) => {
  const { icon, ...rest } = props;
  return <S.StyledButton {...rest}>{icon}</S.StyledButton>;
};

export default TalkFooterItem;
