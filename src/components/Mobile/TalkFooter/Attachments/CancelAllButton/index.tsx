import { useTheme, Icon } from '@wapl/ui';
import { observer } from 'mobx-react-lite';

import { Wrapper } from '@desktop/TalkFooter/Attachments/CancelAllButton/Styled';

const CancelAllButton = observer(
  ({ handleClick }: { handleClick: () => void }) => {
    const theme = useTheme();
    return (
      <Wrapper onClick={handleClick} theme={theme}>
        <Icon.CloseLine color={theme.Color.Gray[900]} />
      </Wrapper>
    );
  },
);

export default CancelAllButton;
