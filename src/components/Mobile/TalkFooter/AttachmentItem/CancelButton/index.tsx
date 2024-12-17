import { HtmlHTMLAttributes } from 'react';

import { useTheme, Icon } from '@wapl/ui';
import { observer } from 'mobx-react-lite';

import { AttachmentItemModel } from '@/models';

import { Wrapper } from './Styled';

interface CancelButtonProps extends HtmlHTMLAttributes<HTMLButtonElement> {
  item: AttachmentItemModel;
}

const CancelButton = observer((props: CancelButtonProps) => {
  const { ...rest } = props;
  const theme = useTheme();
  return (
    <Wrapper {...rest}>
      <Icon.DeleteFill color={theme.Color.Black[40]} />
    </Wrapper>
  );
});

export default CancelButton;
