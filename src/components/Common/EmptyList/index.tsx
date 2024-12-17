import { ReactComponent as Empty } from '@/assets/icons/Empty.svg';

import * as S from './styled';

interface EmptyListProps {
  icon?: boolean;
  title: string;
  description?: string;
}

const EmptyList = (props: EmptyListProps) => {
  const { icon = true, title, description } = props;
  return (
    <S.EmptyWrapper>
      {icon && <Empty />}
      <S.EmptyTitle>{title}</S.EmptyTitle>
      <S.EmptyDescription>{description}</S.EmptyDescription>
    </S.EmptyWrapper>
  );
};

export default EmptyList;
