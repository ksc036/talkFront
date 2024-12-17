import { HtmlHTMLAttributes } from 'react';

import { useTheme, Icon } from '@wapl/ui';

import { AttachmentItemModel } from '@/models';

import { Wrapper } from './Styled';

interface CancelButtonProps extends HtmlHTMLAttributes<HTMLButtonElement> {
  item: AttachmentItemModel;
}

const CancelButton = (props: CancelButtonProps) => {
  const { ...rest } = props;
  const theme = useTheme();
  return (
    <Wrapper {...rest}>
      <Icon.DeleteFill width={24} height={24} color={theme.Color.Black[40]} />
    </Wrapper>
  );
};

export default CancelButton;
