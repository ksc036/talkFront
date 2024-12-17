import { Tooltip } from '@wapl/ui';

import { useStore } from '@/stores';

import * as S from './styled';

interface ToolbarButtonProps {
  icon?: React.ReactNode;
  title?: string;
  isActive?: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

const ToolbarButton = (props: ToolbarButtonProps) => {
  const { icon, title, onClick, isActive } = props;
  const { configStore } = useStore();

  return (
    <Tooltip placement={'top'} title={title || ''}>
      <S.ButtonWrapper
        onClick={onClick}
        isActive={!!isActive}
        color={configStore.MainColor}
      >
        {icon}
      </S.ButtonWrapper>
    </Tooltip>
  );
};

export default ToolbarButton;
