import { useTheme, Icon } from '@wapl/ui';

import { Wrapper } from '@desktop/TalkFooter/Attachments/CancelAllButton/Styled';

const CancelAllButton = ({ handleClick }: { handleClick: () => void }) => {
  const theme = useTheme();
  return (
    <Wrapper onClick={handleClick} theme={theme}>
      <Icon.CloseLine color={theme.Color.Gray[900]} />
    </Wrapper>
  );
};

export default CancelAllButton;
