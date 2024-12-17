import React, { useCallback, useState } from 'react';

import { useCoreStore } from '@wapl/core';
import { Icon, useTheme } from '@wapl/ui';
import { observer } from 'mobx-react';

import { useStore } from '@/stores';
import * as T from '@types';

import ReactionDialog from './ReactionDialog';
import * as S from './styled';

interface ReactionChipProps {
  messageId: T.MessageId;
  isMyMsg: boolean;
}

const ReactionChip = observer((props: ReactionChipProps) => {
  const { messageId, isMyMsg } = props;
  const { reactionStore, configStore } = useStore();
  const { roomStore, userStore } = useCoreStore();
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [position, setPosition] = useState<DOMRect | null>(null);
  const myId = userStore.selectedPersona?.id as number;
  const reactionList = reactionStore.getAllReactions(messageId);

  const isMyReaction = (reactionName: string) => {
    return reactionStore.hasMyReaction(myId, messageId, reactionName);
  };

  const handleClickButton = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setPosition(event.currentTarget.getBoundingClientRect());
  };
  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);
  const handleReactionClick = (reactionName: string) => async () => {
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

  if (reactionList.length === 0) return null;
  return (
    <S.Wrapper isMine={isMyMsg}>
      <S.ReactionList isMine={isMyMsg}>
        {reactionList.map((reaction, index) => (
          <React.Fragment key={reaction.reactionName}>
            {isMyMsg && reactionList.length > 5 && index === 5 && (
              <div style={{ flexBasis: '100%', height: 0 }}></div>
            )}
            {isMyMsg &&
              ((reactionList.length <= 5 && index === 0) ||
                (reactionList.length > 5 && index === 5)) && (
                <S.ReactionListButton onClick={handleClickButton}>
                  <Icon.UserLine
                    height={16}
                    width={16}
                    color={theme.Color.Gray[600]}
                  />
                </S.ReactionListButton>
              )}
            <S.ReactionWrapper
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
        {!isMyMsg && reactionList.length > 0 && (
          <S.ReactionListButton onClick={handleClickButton}>
            <Icon.UserLine
              height={16}
              width={16}
              color={theme.Color.Gray[600]}
            />
          </S.ReactionListButton>
        )}
        <ReactionDialog
          messageId={messageId}
          anchorEl={anchorEl}
          onClose={handleClose}
          position={position}
        />
      </S.ReactionList>
    </S.Wrapper>
  );
});

export default ReactionChip;
