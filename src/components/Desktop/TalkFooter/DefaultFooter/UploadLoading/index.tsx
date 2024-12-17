import { Icon } from '@wapl/ui';

import * as S from './Styled';

const UploadLoading = () => {
  return (
    <S.Wrapper>
      <Icon.LoadingMotion width={27} height={27} />
    </S.Wrapper>
  );
};

export default UploadLoading;
