import { Icon } from '@wapl/ui';
import { observer } from 'mobx-react-lite';

import { useStore } from '@/stores';

import * as S from './Styled';

const MessageLoadFail = observer(() => {
  const { talkStore, configStore } = useStore();
  const color = configStore.BodyColor;

  if (talkStore.isLoading)
    return (
      <S.Wrapper color={color}>
        <S.FailBox>
          <Icon.LoadingMotion width={24.75} height={24.75} />
          <S.FailMessage>내용을 불러오는 중입니다.</S.FailMessage>
        </S.FailBox>
      </S.Wrapper>
    );

  return (
    <S.Wrapper color={color}>
      <S.FailBox>
        <S.RetryButton
          onClick={() => {
            talkStore.getMessageRetry();
          }}
        >
          <Icon.RenewLine width={24.75} height={24.75} />
        </S.RetryButton>
        <S.FailMessage>
          내용 불러오기에 실패하였습니다. 다시 시도 버튼을 눌러주세요.
        </S.FailMessage>
      </S.FailBox>
    </S.Wrapper>
  );
});

export default MessageLoadFail;
