import { NavigateFunction, useNavigate } from 'react-router-dom';

import { useCoreStore } from '@wapl/core';
import { Icon } from '@wapl/ui';
import { observer } from 'mobx-react-lite';

import { VoteStateType } from '@/@types';
import { MessageModel } from '@/models';
import { useStore } from '@/stores';
import { isMobile } from '@/utils';

import MetaTagMessage from '../MetaTagMessage';
import PlainMessage from '../PlainMessage';

import * as S from './styled';
interface VoteMessageProps {
  msgBody: MessageModel['msgBody'];
  msgId: number;
  isReply?: boolean;
}

interface VoteCommonMessageProps {
  msgType: VoteStateType;
  voteId: number;
  msgId: number;
  title: string;
  isReply?: boolean;
  firstRank?: string[];
}

const VoteCommonMessage = observer((props: VoteCommonMessageProps) => {
  const { msgType, voteId, msgId, title, isReply, firstRank } = props;
  const { voteStore, uiStore, configStore } = useStore();
  const { roomStore } = useCoreStore();

  let navigate: NavigateFunction | null = null;

  if (isMobile()) {
    navigate = useNavigate();
  }

  const handleClickVote = async () => {
    if (isReply) return;
    try {
      const fetchedVote = await voteStore.getVote({
        voteId: voteId,
      });
      if (!fetchedVote?.isDeleted) {
        if (isMobile() && navigate) {
          navigate(`/talk/${roomStore.currentRoomId}/allvote#vote`);
        } else {
          uiStore.setVoteDialogMode('vote');
          uiStore.openDialog('vote');
        }
      } else uiStore.openDialog('deletedVote');
    } catch {
      uiStore.openDialog('deletedVote');
    }
  };

  const notiText = () => {
    switch (msgType) {
      case 'CREATE':
        return '투표가 등록되었습니다.';
      case 'END':
        return '투표가 종료되었습니다.';
      case 'ENDING':
        return '투표 종료 1시간 전입니다.';
      default:
        return '';
    }
  };

  const content = msgType === 'END' && firstRank && firstRank.length > 0 && (
    <S.FirstRankWrapper>
      <S.FirstRankText
        style={{ backgroundColor: `${configStore.FirstRankColor}` }}
      >
        {firstRank.length > 1 ? '공동 1위' : '1위'}
      </S.FirstRankText>
      <S.FirstRankContent isLong={firstRank.length > 1}>
        <PlainMessage
          content={firstRank[0]}
          msgId={msgId}
          getShort={true}
          getLink={false}
          getMention={false}
          allowKeywordSearch={isReply ? false : true}
        />
        {firstRank.length > 1 && (
          <S.OtherFirstRankText>
            외 {firstRank.length - 1}개
          </S.OtherFirstRankText>
        )}
      </S.FirstRankContent>
    </S.FirstRankWrapper>
  );

  return (
    <MetaTagMessage
      notiText={notiText()}
      onClick={handleClickVote}
      isReply={isReply}
      title={title}
      titleLimit={1}
      msgId={msgId}
      content={content}
      hasBottom={true}
      bottomText={msgType === 'END' ? '투표 결과 보기' : '투표하기'}
      bottomIcon={<Icon.VoteLine width={16} height={16} />}
    />
  );
});

const VoteMessage = (props: VoteMessageProps) => {
  const { msgBody, msgId, isReply } = props;

  const voteResult: string[] = [];
  let maxCount = 0;
  msgBody.voteBody?.voteItems.forEach((voteItem) => {
    if (maxCount > 0 && voteItem.voteCount === maxCount) {
      voteResult.push(voteItem.itemContent);
    } else if (voteItem.voteCount > maxCount) {
      voteResult.splice(0, voteResult.length, voteItem.itemContent);
      maxCount = voteItem.voteCount;
    }
  });

  if (!msgBody.voteBody || !msgBody.voteId) return null;

  return (
    <>
      {msgBody.voteStateType === 'DELETE' ? (
        <MetaTagMessage
          notiText={'투표가 삭제되었습니다.'}
          isReply={isReply}
          title={msgBody.voteBody.title}
          titleLimit={1}
          msgId={msgId}
          hasBottom={false}
        />
      ) : (
        <VoteCommonMessage
          msgType={msgBody.voteStateType as VoteStateType}
          voteId={msgBody.voteId}
          msgId={msgId}
          title={msgBody.voteBody.title}
          isReply={isReply}
          firstRank={voteResult}
        />
      )}
    </>
  );
};

export default VoteMessage;
