import { Dispatch, SetStateAction } from 'react';

import { observer } from 'mobx-react';

import CommonButton from '@/components/Common/Button';
import { useStore } from '@/stores';

import * as S from './Styled';

interface VoteFooterProps {
  handleVote: () => void;
  handleCloseVote: () => void;
  isRevote: boolean;
  setIsRevote: Dispatch<SetStateAction<boolean>>;
  isMine: boolean;
}

export const VoteFooter = observer((props: VoteFooterProps) => {
  const { handleVote, handleCloseVote, isRevote, setIsRevote, isMine } = props;
  const { voteStore } = useStore();

  return (
    <S.ButtonWrapper>
      {isRevote ? (
        <>
          {isMine && (
            <CommonButton
              size="large"
              onClick={handleCloseVote}
              variant="secondary"
            >
              투표 종료
            </CommonButton>
          )}
          <CommonButton size="large" onClick={() => setIsRevote(false)}>
            다시 투표하기
          </CommonButton>
        </>
      ) : (
        <CommonButton
          onClick={() => {
            handleVote();
            setIsRevote(true);
          }}
          disabled={voteStore.voteTargets.length === 0}
          size="large"
        >
          투표하기
        </CommonButton>
      )}
    </S.ButtonWrapper>
  );
});
