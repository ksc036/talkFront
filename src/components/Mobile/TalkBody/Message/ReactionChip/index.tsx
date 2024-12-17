import React, { MouseEvent, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { useCoreStore } from '@wapl/core';
import { observer } from 'mobx-react';
import { LongPressEvent, useLongPress } from 'use-long-press';

import { useStore } from '@/stores';
import * as T from '@types';

import * as S from './styled';

interface ReactionChipProps {
  messageId: T.MessageId;
  isMyMsg: boolean;
}

const ReactionChip = observer((props: ReactionChipProps) => {
  const { messageId, isMyMsg } = props;
  const { reactionStore, configStore } = useStore();
  const { roomStore, userStore } = useCoreStore();
  const navigate = useNavigate();

  const myId = userStore.selectedPersona?.id as number;

  const isMyReaction = (reactionName: string) => {
    return reactionStore.hasMyReaction(myId, messageId, reactionName);
  };

  const reactionList = reactionStore.getAllReactions(messageId);

  const handleReactionClick =
    (reactionName: string) => async (event: MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      const roomId = roomStore.currentRoomId as number;
      if (isMyReaction(reactionName)) {
        const reactionId = reactionStore.getReactionId(
          myId,
          messageId,
          reactionName,
        );
        if (reactionId) {
          await reactionStore.deleteReaction({ reactionId, roomId });
        }
      } else {
        await reactionStore.createReaction({
          roomId,
          targetType: 'message',
          targetId: messageId,
          reactionName,
        });
      }
    };

  const handleReactionLongPress = useCallback(
    (event: LongPressEvent<Element>) => {
      event.stopPropagation();
      reactionStore.setTargetMessageId(messageId);
      navigate('#reaction-dialog');
    },
    [],
  );

  const bind = useLongPress(handleReactionLongPress, {
    threshold: 500,
    captureEvent: true,
    cancelOnMovement: true,
  });

  if (reactionList.length === 0) return null;
  return (
    <S.Wrapper isMine={isMyMsg}>
      <S.ReactionList isMine={isMyMsg}>
        {reactionList.map((reaction, index) => (
          <React.Fragment key={reaction.reactionName}>
            {isMyMsg && reactionList.length > 5 && index === 5 && (
              <>
                <div style={{ flexBasis: '100%', height: 0 }}></div>
              </>
            )}
            <S.ReactionWrapper
              {...bind()}
              isMine={isMyReaction(reaction.reactionName)}
              onClick={handleReactionClick(reaction.reactionName)}
              borderColor={configStore.ReactionChipStyle.BorderColor}
              backgroundColor={configStore.ReactionChipStyle.BackgroundColor}
            >
              <img
                src={
                  reactionStore.reactions.emoticonMap.get(reaction.reactionName)
                    ?.image
                }
                width={16}
                height={16}
              />
              <S.ReactionCount color={configStore.MainColor}>
                {reaction.count}
              </S.ReactionCount>
            </S.ReactionWrapper>
          </React.Fragment>
        ))}
      </S.ReactionList>
    </S.Wrapper>
  );
});

export default ReactionChip;
