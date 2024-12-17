import { useTheme, Icon } from '@wapl/ui';
import { observer } from 'mobx-react';

import { VoteModel } from '@/models/VoteModel';
import { useStore } from '@/stores';

import * as S from './Styled';

interface VotingInfoItemProps {
  voteItem: VoteModel;
  onClick?: () => void;
  isClosedVote: boolean;
}

const VotingInfoItem = observer((props: VotingInfoItemProps) => {
  const { voteItem, onClick, isClosedVote } = props;
  const { configStore } = useStore();
  const { Color } = useTheme();

  const borderColorConverter = () => {
    if (voteItem.isVoted) {
      return '#F8F9FA';
    } else {
      if (voteItem.isClosed) {
        return Color.Gray[300];
      } else {
        return configStore.MainColor;
      }
    }
  };

  return (
    <S.Wrapper mainColor={borderColorConverter()} isVoted={voteItem.isVoted}>
      <S.ContentWrapper onClick={onClick} isClosedVote={isClosedVote}>
        <S.VoteTitle>{voteItem.title}</S.VoteTitle>
        <S.DescWrapper isClosedVote={isClosedVote}>
          <S.ParticipantListBadge>
            {voteItem.numberUsers}명 투표
          </S.ParticipantListBadge>
          <S.VotingRegistrationDate>
            {voteItem?.formattedDeadline}
          </S.VotingRegistrationDate>
        </S.DescWrapper>
      </S.ContentWrapper>
      {voteItem.isVoted && (
        <S.VotingCheckedIcon>
          <Icon.CheckLine width={20} height={20} color={Color.Gray[400]} />
        </S.VotingCheckedIcon>
      )}
    </S.Wrapper>
  );
});

export default VotingInfoItem;
