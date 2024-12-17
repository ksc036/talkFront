import { Icon, Squircle, useTheme } from '@wapl/ui';
import { observer } from 'mobx-react-lite';

import useSuperOS from '@/hooks/useSuperOS';

import * as S from '../Styled';

const Camera = observer(() => {
  const theme = useTheme();

  const { startCamera } = useSuperOS();

  const handleCameraClick = () => {
    startCamera();
  };

  return (
    <S.ItemWrapper onClick={handleCameraClick}>
      <Squircle
        size={52}
        color="rgba(133, 130, 246, 0.2)"
        icon={
          <Icon.CameraFill
            width={22}
            height={22}
            color="rgba(133, 130, 246, 1)"
          />
        }
      />
      <S.Title theme={theme}>카메라</S.Title>
    </S.ItemWrapper>
  );
});

export default Camera;
