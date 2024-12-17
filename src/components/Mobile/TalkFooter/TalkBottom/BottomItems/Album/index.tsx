import { Icon, Squircle, useTheme } from '@wapl/ui';
import { observer } from 'mobx-react-lite';

import * as S from '@/components/Mobile/TalkFooter/TalkBottom/BottomItems/Styled';
import useSuperOS from '@/hooks/useSuperOS';

const Album = observer(() => {
  const theme = useTheme();

  const { startAlbumView } = useSuperOS();

  const handleAlbumClick = () => {
    startAlbumView();
  };

  return (
    <S.ItemWrapper onClick={handleAlbumClick}>
      <Squircle
        size={52}
        color="rgba(249, 181, 80, 0.2)"
        icon={
          <S.AlbumIconwrapper>
            <Icon.ImageColor width={24} height={24} />
          </S.AlbumIconwrapper>
        }
      />
      <S.Title theme={theme}>앨범</S.Title>
    </S.ItemWrapper>
  );
});
export default Album;
