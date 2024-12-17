import { Icon, Squircle, useTheme } from '@wapl/ui';
import { observer } from 'mobx-react-lite';

import * as S from '@/components/Mobile/TalkFooter/TalkBottom/BottomItems/Styled';

const Mail = observer(() => {
  const theme = useTheme();

  const handleMailClick = () => {
    // 연락처 연동
  };

  return (
    <S.ItemWrapper onClick={handleMailClick}>
      <Squircle
        size={52}
        color="#00D08A26"
        icon={<Icon.MailFill width={20} height={20} color="#00D08A" />}
      />
      <S.Title theme={theme}>메일</S.Title>
    </S.ItemWrapper>
  );
});

export default Mail;
