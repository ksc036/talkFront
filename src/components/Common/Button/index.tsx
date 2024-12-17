import { useStore } from '@/stores';

import * as S from './Styled';

interface CommonButtonPropsType {
  disabled?: boolean;
  size?: 'small' | 'large' | 'medium' | 'extra-large';
  variant?: 'secondary' | 'primary' | 'secondary-web' | 'third' | 'negative';
  onClick?: () => void;
  children: React.ReactNode;
}

const CommonButton = (props: CommonButtonPropsType) => {
  const { disabled = false, size, variant, onClick, children } = props;
  const { configStore } = useStore();

  const buttonColor = variant ? undefined : configStore.ButtonPrimaryColor;

  return (
    <S.StyledCommonButton
      variant={variant}
      disabled={disabled}
      size={size}
      color={buttonColor}
      onClick={onClick}
    >
      {children}
    </S.StyledCommonButton>
  );
};

export default CommonButton;
