import React, { useEffect, useCallback, useState } from 'react';

import { useDocsStore } from '@tmaxoffice/docs';
import { Icon, Checkbox, Radio, RadioGroup } from '@wapl/ui';
import { observer } from 'mobx-react';

import { VoteItemModel } from '@/models/VoteModel';
import { useStore } from '@/stores';

import * as S from './Styled';

interface VoteListItemProps {
  voteItems: VoteItemModel[];
  isMultiple: boolean;
  isAnonymous: boolean;
  isVoted: boolean;
  isRevote: boolean;
  isClosed: boolean;
  handleVotedUser: () => void;
}

interface VoteItemProps {
  isMultiple: boolean;
  isAnonymous: boolean;
  id: number;
  checked: boolean;
  content: React.ReactNode;
  count: number;
  imageId?: number;
  handleVotedUser: () => void;
}

interface VotedItemProps {
  id: number;
  content: React.ReactNode;
  count: number;
  imageId?: number;
  isVoted: boolean;
  isAnonymous: boolean;
  isFirstRank: boolean;
  handleVotedUser: () => void;
  firstRank: number[];
}

const VoteItem = observer((props: VoteItemProps) => {
  const {
    isMultiple,
    isAnonymous,
    id,
    checked,
    content,
    count,
    imageId,
    handleVotedUser,
  } = props;

  const { configStore, fileStore, uiStore } = useStore();
  const docsStore = useDocsStore();
  const driveStore = docsStore.getDriveStore();

  const [imgSrc, setImgSrc] = useState<string>('');

  const handleImageClick = async (imageId: number) => {
    const res = await driveStore.requestDownload(imageId);
    const file = res as File;
    if (res) {
      fileStore.setMediaPreviewMeta({
        documentId: imageId,
        title: file.name,
        extension: res.type.split('/')[1],
        size: res?.size,
      });
      fileStore.setMediaPreviewData({
        file: res,
        source: URL.createObjectURL(res),
      });
      uiStore.setOpenMediaPreview(true);
    }
  };

  useEffect(() => {
    if (imageId) {
      (async () => {
        const res = await driveStore.requestThumbnailData(imageId);
        setImgSrc(URL.createObjectURL(res));
      })();
    }
  }, []);

  return (
    <S.CheckboxWrap
      checked={checked}
      checkedColor={configStore.config.MainColor}
      value={id}
      control={isMultiple ? <Checkbox /> : <Radio />}
      label={
        <S.VoteItemContentWrapper>
          <S.VoteItemContent>{content}</S.VoteItemContent>
          <S.VoteItemSubContentWrapper>
            {imgSrc && (
              <S.Thumbnail onClick={() => handleImageClick(imageId as number)}>
                <img src={imgSrc} width={32} height={32} />
              </S.Thumbnail>
            )}
            <S.VoteItemCount
              isAnonymous={isAnonymous}
              onClick={handleVotedUser}
              color={configStore.config.MainColor}
            >
              <Icon.UserLine width={16} height={16} />
              <span>{count}</span>
            </S.VoteItemCount>
          </S.VoteItemSubContentWrapper>
        </S.VoteItemContentWrapper>
      }
    />
  );
});

const VotedItem = observer((props: VotedItemProps) => {
  const {
    id,
    content,
    count,
    imageId,
    isVoted,
    isAnonymous,
    isFirstRank,
    handleVotedUser,
    firstRank,
  } = props;

  const { configStore, fileStore, uiStore } = useStore();
  const docsStore = useDocsStore();
  const driveStore = docsStore.getDriveStore();

  const [imgSrc, setImgSrc] = useState<string>('');

  const handleImageClick = async (imageId: number) => {
    const res = await driveStore.requestDownload(imageId);
    const file = res as File;
    if (res) {
      fileStore.setMediaPreviewMeta({
        documentId: imageId,
        title: file.name,
        extension: res.type.split('/')[1],
        size: res?.size,
      });
      fileStore.setMediaPreviewData({
        file: res,
        source: URL.createObjectURL(res),
      });
      uiStore.setOpenMediaPreview(true);
    }
  };

  useEffect(() => {
    if (imageId) {
      (async () => {
        const res = await driveStore.requestThumbnailData(imageId);
        setImgSrc(URL.createObjectURL(res));
      })();
    }
  }, []);

  return (
    <S.ListWrap isFirstRank={isFirstRank}>
      <S.VoteItemContentWrapper>
        {firstRank.includes(id) && (
          <S.VoteFirstChip
            style={{ backgroundColor: `${configStore.FirstRankColor}` }}
          >
            {firstRank.length > 1 ? '공동 1위' : '1위'}
          </S.VoteFirstChip>
        )}
        {isVoted && (
          <S.VoteCheckedIcon>
            <Icon.CheckLine
              width={20}
              height={20}
              color={configStore.config.CheckColor}
            />
          </S.VoteCheckedIcon>
        )}
        <S.VoteItemContent>{content}</S.VoteItemContent>
        <S.VoteItemSubContentWrapper>
          {imgSrc && (
            <S.Thumbnail onClick={() => handleImageClick(imageId as number)}>
              <img src={imgSrc} width={32} height={32} />
            </S.Thumbnail>
          )}
          <S.VoteItemCount
            isAnonymous={isAnonymous}
            onClick={handleVotedUser}
            color={configStore.config.MainColor}
          >
            <Icon.UserLine width={16} height={16} />
            <span>{count}</span>
          </S.VoteItemCount>
        </S.VoteItemSubContentWrapper>
      </S.VoteItemContentWrapper>
    </S.ListWrap>
  );
});

export const VoteListItem = observer((props: VoteListItemProps) => {
  const {
    voteItems,
    isMultiple,
    isRevote,
    isClosed,
    isAnonymous,
    handleVotedUser,
  } = props;
  const { voteStore } = useStore();
  const voteTargets = voteStore.voteTargets;
  const setVoteTarget = voteStore.setVoteTarget;
  const firstRank = voteStore.getFirstRank(voteItems);
  const handleCheckChange = useCallback(
    (event: React.ChangeEvent<HTMLDivElement>) => {
      const target = event.target as HTMLInputElement;
      const voteItemId = parseInt(target.value);
      if (target.checked) {
        if (isMultiple) {
          setVoteTarget([...voteTargets, voteItemId]);
        } else {
          setVoteTarget([voteItemId]);
        }
      } else {
        setVoteTarget(voteTargets.filter((bId) => bId !== voteItemId));
      }
    },
    [voteItems, setVoteTarget, voteTargets],
  );

  const votingTargets: number[] = voteItems.reduce(
    (accum: number[], { voteItemId, isVoted }) => {
      if (isVoted) {
        accum.push(voteItemId);
      }
      return accum;
    },
    [],
  );

  useEffect(() => {
    setVoteTarget(votingTargets);
  }, [isRevote, voteItems, voteTargets, setVoteTarget]);

  return (
    <>
      <S.VoteListItemWrapper onChange={handleCheckChange}>
        {isRevote || isClosed ? (
          <>
            {voteItems.map(
              ({ voteItemId, itemContent, voteCount, imageId, isVoted }) => {
                return (
                  <VotedItem
                    firstRank={firstRank}
                    key={voteItemId}
                    id={voteItemId}
                    content={itemContent}
                    count={voteCount}
                    imageId={imageId}
                    isVoted={isVoted}
                    isFirstRank={firstRank.includes(voteItemId)}
                    handleVotedUser={handleVotedUser}
                    isAnonymous={isAnonymous}
                  />
                );
              },
            )}
          </>
        ) : (
          <RadioGroup>
            {voteItems.map(
              ({ voteItemId, itemContent, voteCount, imageId }) => {
                const isChecked = voteTargets.includes(voteItemId);
                return (
                  <VoteItem
                    isMultiple={isMultiple}
                    isAnonymous={isAnonymous}
                    key={voteItemId}
                    id={voteItemId}
                    checked={isChecked}
                    content={itemContent}
                    count={voteCount}
                    imageId={imageId}
                    handleVotedUser={handleVotedUser}
                  />
                );
              },
            )}
          </RadioGroup>
        )}
      </S.VoteListItemWrapper>
    </>
  );
});
