import { Icon, Squircle, useTheme } from '@wapl/ui';
import { observer } from 'mobx-react-lite';

import * as S from '@/components/Mobile/TalkFooter/TalkBottom/BottomItems/Styled';
import { useStore } from '@/stores';

const File = observer(() => {
  const theme = useTheme();
  const { refStore } = useStore();
  const attachRef = refStore.refMap.get('attachRef');

  const handleFileClick = () => {
    attachRef?.current?.click();
  };

  return (
    <S.ItemWrapper onClick={handleFileClick}>
      <Squircle
        size={52}
        color="rgba(59, 193, 169, 0.2)"
        icon={
          <S.FileIconwrapper>
            <Icon.FileColor width={24} height={24} color="red" />
          </S.FileIconwrapper>
        }
      />
      <S.Title theme={theme}>파일</S.Title>
    </S.ItemWrapper>
  );
});

export default File;
