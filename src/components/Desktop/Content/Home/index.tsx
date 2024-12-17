import { useStore } from '@/stores';

import * as S from './styled';

const Home = () => {
  const { configStore } = useStore();
  return (
    <S.Wrapper color={configStore.homeType.homeBackgroundColor}>
      <S.StyledImg src={configStore.homeType.homeLogo} />
    </S.Wrapper>
  );
};

export default Home;
