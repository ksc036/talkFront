import { Icon, Squircle, useTheme } from '@wapl/ui';
import { observer } from 'mobx-react-lite';

import * as S from '../Styled';

const Contact = observer(() => {
  const theme = useTheme();

  const handleContactClick = () => {
    // 연락처 연동
  };

  return (
    <S.ItemWrapper onClick={handleContactClick}>
      <Squircle
        size={52}
        color="rgba(255, 121, 0, 0.2)"
        icon={
          <Icon.ContactFill
            width={24}
            height={24}
            color="rgba(255, 121, 0, 1)"
          />
        }
      />
      <S.Title theme={theme}>연락처</S.Title>
    </S.ItemWrapper>
  );
});

export default Contact;
