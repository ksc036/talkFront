import React, { useEffect, useState } from 'react';

import { getDefaultImageURL, useCoreStore } from '@wapl/core';
import { Avatar } from '@wapl/ui';
import { observer } from 'mobx-react';

import { useStore } from '@/stores';
import * as T from '@types';

import * as S from './styled';

interface ReactionDialogProps {
  messageId: T.MessageId;
  anchorEl: HTMLButtonElement | null;
  onClose: () => void;
  position: DOMRect | null;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <S.ReactionPanel
      role="tabpanel"
      hidden={value !== index}
      id={`lnb-tabpanel-${index}`}
      aria-labelledby={`lnb-tab-${index}`}
      style={{ maxHeight: '340px', overflowY: 'auto' }}
      {...other}
    >
      {value === index && <>{children}</>}
    </S.ReactionPanel>
  );
};

const ReactionListRow = observer(
  ({
    personaId,
    reactionName,
  }: {
    personaId: T.PersonaId;
    reactionName: string;
  }) => {
    const { reactionStore } = useStore();
    const { roomStore, personaStore } = useCoreStore();

    const roomMember = roomStore
      .getRoomById(roomStore.currentRoomId as number)
      ?.getMemberById(personaId);

    const persona = personaStore.getPersona(personaId);

    const imageSrc = roomMember?.profileImageFilepath
      ? roomMember.profileImageFilepath
      : persona?.profileImageUrl ?? '';

    const defaultImage = getDefaultImageURL({
      type: 'PROFILE',
      personaId: personaId as number,
    });

    useEffect(() => {
      if (!persona) {
        personaStore.fetchPersona({ personaId });
      }
    }, []);

    return (
      <S.ReactionRow>
        <Avatar size={36} imgSrc={imageSrc !== '' ? imageSrc : defaultImage} />
        <S.ReactionNameText>
          {roomMember ? roomMember.personaNick : persona ? persona.nick : ''}
        </S.ReactionNameText>
        <img
          src={reactionStore.reactions.emoticonMap.get(reactionName)?.image}
          width={20}
          height={20}
        />
      </S.ReactionRow>
    );
  },
);

const ReactionDialog = observer((props: ReactionDialogProps) => {
  const { messageId, anchorEl, onClose, position } = props;
  const { reactionStore, configStore } = useStore();

  const [tabValue, setTabValue] = useState(0);
  const [totalReactionLength, setTotalReactionLength] = useState(0);

  useEffect(() => {
    setTotalReactionLength(reactionStore.getAllReactions(messageId).length);
  }, [reactionStore.getAllReactions(messageId)]);

  const open = Boolean(anchorEl);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <S.ReactionPopover
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={{
        top: position?.bottom ? position?.bottom + 8 : 0,
        left: position?.left ? position?.left : 0,
      }}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
    >
      <S.Header>공감한 인원</S.Header>
      <S.ReactionTabs
        value={tabValue}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        color={configStore.config.MainColor}
      >
        {totalReactionLength > 1 && (
          <S.ReactionTab
            label={
              '전체 ' +
              (totalReactionLength < 10000
                ? totalReactionLength
                : Math.floor(totalReactionLength / 1000) * 0.1 + '만')
            }
            color={configStore.config.MainColor}
          />
        )}
        {reactionStore
          .getAllReactions(messageId)
          .map(({ reactionName, targets }) => (
            <S.ReactionTab
              key={reactionName}
              color={configStore.config.MainColor}
              label={
                <S.ReactionTabLabelWrapper>
                  <img
                    src={
                      reactionStore.reactions.emoticonMap.get(reactionName)
                        ?.image
                    }
                    width={20}
                    height={20}
                  />
                  <S.ReactionTabLabelText>
                    {targets.length < 10000
                      ? targets.length
                      : Math.floor(targets.length / 1000) * 0.1 + '만'}
                  </S.ReactionTabLabelText>
                </S.ReactionTabLabelWrapper>
              }
            />
          ))}
      </S.ReactionTabs>
      <TabPanel value={tabValue} index={0}>
        {reactionStore
          .getAllReactions(messageId)
          .map(({ reactionName, targets }) =>
            targets.map(({ reactionId, personaId }) => (
              <ReactionListRow
                key={`${reactionId}-${personaId}`}
                personaId={personaId}
                reactionName={reactionName}
              />
            )),
          )}
      </TabPanel>
      {reactionStore
        .getAllReactions(messageId)
        .map(({ reactionName, targets }, index) => (
          <TabPanel key={reactionName} value={tabValue} index={index + 1}>
            {targets.map(({ reactionId, personaId }) => (
              <ReactionListRow
                key={`${reactionId}-${personaId}`}
                personaId={personaId}
                reactionName={reactionName}
              />
            ))}
          </TabPanel>
        ))}
    </S.ReactionPopover>
  );
});

export default ReactionDialog;
