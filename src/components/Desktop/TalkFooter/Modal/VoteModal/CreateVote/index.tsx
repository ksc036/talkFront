import { useState, useCallback, useEffect } from 'react';

import { useDocsStore } from '@tmaxoffice/docs';
import { RoomModel, useCoreStore } from '@wapl/core';
import { useTheme, Checkbox } from '@wapl/ui';
import { DateTime } from 'luxon';
import { observer } from 'mobx-react';

import CommonButton from '@/components/Common/Button';
import { ConfirmDialog } from '@/components/Common/Dialog/ConfirmDialog';
import CommonDialogHeader from '@/components/Common/Dialog/DialogHeader';
import { MAX_VOTEITEM_LENGTH, VoteModel } from '@/models/VoteModel';
import { useStore } from '@/stores';
import { recoverHiddenRoom } from '@/utils';

import EventDateItem from './EventDateItem';
import * as S from './Styled';
import VoteCategoryItem from './VoteCategoryItem';

export const VOTE_MAX_TITLE_LENGTH = 20;
interface CreateVoteProps {
  onClose: () => void;
  BackButton: () => void;
  onComplete: () => void;
  editMode?: boolean;
}

const CreateVote = observer((props: CreateVoteProps) => {
  const docsStore = useDocsStore();
  const docsUploadFunction = docsStore.getDriveStore().requestUploadDocument;
  const { voteStore, uiStore, configStore } = useStore();
  const { roomStore, userStore } = useCoreStore();
  const { onClose, BackButton, onComplete, editMode } = props;
  const currentRoom = roomStore.getRoomById(
    roomStore.currentRoomId as number,
  ) as RoomModel;
  const nick = userStore.selectedPersona?.nick ?? '';
  const [voteInfo, setVoteInfo] = useState(new VoteModel());
  const [deadLine, setDeadLine] = useState(
    DateTime.now().plus({ days: 2, hours: 1 }).setZone(),
  );
  const isTimeInvalid = deadLine.diffNow().as('minutes') < 90;
  const { Color } = useTheme();
  const [hasTitleChange, setHasTitleChange] = useState(false);
  const [hasItemChange, setHasItemChange] = useState(false);
  const [isback, setIsBack] = useState(true);

  useEffect(() => {
    (async () => {
      if (editMode) {
        const targetVote = voteStore.currentVote as VoteModel;
        if (targetVote.deadline !== undefined) {
          setDeadLine(DateTime.fromISO(targetVote.deadline));
        }
        setVoteInfo(new VoteModel(voteStore.currentVote as VoteModel));
      }
    })();
  }, [editMode, voteStore]);

  const handleAddItem = useCallback(() => {
    voteInfo.addItem({
      voteItemId: 0,
      itemContent: '',
      voteCount: 0,
      personaIds: [],
      hasFile: false,
      isVoted: false,
    });
  }, [voteInfo]);

  const handleDeleteItem = useCallback(
    (idx: number) => {
      voteInfo.deleteItem(idx);
    },
    [voteInfo],
  );

  const handleTitleChange = useCallback(
    (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const { selectionStart }: HTMLInputElement = e.target;
      if (e.target.value.length <= VOTE_MAX_TITLE_LENGTH) {
        voteInfo.update({ [key]: e.target.value });
      } else {
        queueMicrotask(() => {
          if (selectionStart) {
            e.target.setSelectionRange(selectionStart - 1, selectionStart - 1);
          }
        });
      }

      if (e.target.value.length > 0) {
        setHasTitleChange(true);
      } else setHasTitleChange(false);
    },
    [voteInfo],
  );

  const handleItemChange = useCallback(
    (key: 'itemContent') =>
      (idx: number) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const { selectionStart }: HTMLInputElement = e.target;
        if (e.target.value.length <= 20) {
          voteInfo.updateItem(idx, { [key]: e.target.value });
        } else {
          queueMicrotask(() => {
            if (selectionStart) {
              e.target.setSelectionRange(
                selectionStart - 1,
                selectionStart - 1,
              );
            }
          });
        }

        if (e.target.value.length > 0) {
          setHasItemChange(true);
        } else {
          setHasItemChange(false);
        }
      },
    [voteInfo],
  );

  const handleDeadLineSelect = useCallback(
    (date: DateTime) => {
      voteInfo.update({
        deadline: date.toUTC().setZone().toISO(),
      });
      setDeadLine(date);
    },
    [deadLine, setDeadLine, voteInfo],
  );

  const handleDeadLineChange = useCallback(() => {
    const value = voteInfo.isDeadLine
      ? undefined
      : deadLine.toUTC().setZone().toISO();
    voteInfo.update({
      deadline: value,
    });
  }, [voteInfo, deadLine]);

  const handleAnonymousChange = useCallback(() => {
    const value = voteInfo.voteType ^ 1;
    voteInfo.update({ voteType: value });
  }, [voteInfo]);

  const handleMultipleChange = useCallback(() => {
    const value = voteInfo.voteType ^ 2;
    voteInfo.update({ voteType: value });
  }, [voteInfo]);

  const createVoteValid = () => {
    const hasValidTitle = voteInfo.title.trim() !== '';
    const hasEnoughValidItems =
      voteInfo.voteItems.filter((item) => item.itemContent?.trim() !== '')
        .length >= 2;

    return hasValidTitle && hasEnoughValidItems && !isTimeInvalid;
  };

  const upLoadImageToDocs = async () => {
    await Promise.all(
      voteStore.uploadImageList.map(async ({ orderNum, imageId }) => {
        const res = await docsUploadFunction(imageId, currentRoom.id);
        if (res.documentItem?.documentId) {
          voteInfo.updateImage(orderNum, res.documentItem?.documentId);
        }
      }),
    );
  };

  const unLoadImageToDocs = () => {
    voteStore.unloadImageList.map(({ orderNum }) =>
      voteInfo.deleteImage(orderNum),
    );
  };

  const handleCreateVote = useCallback(async () => {
    unLoadImageToDocs();
    await upLoadImageToDocs();
    await recoverHiddenRoom(currentRoom.id);

    const filteredVoteItems = voteInfo.voteItems.filter(
      (item) => item.itemContent.length > 0,
    );
    const voteDTO = {
      voteType: voteInfo.voteType,
      title: voteInfo.title,
      deadline: voteInfo.deadline,
      voteItems: filteredVoteItems,
      nick,
      roomName: currentRoom.name,
    };
    const res = await voteStore.createVote({ voteDTO });
    if (res) {
      onComplete();
    }
  }, [voteStore, voteInfo]);

  const handleEditVote = useCallback(async () => {
    unLoadImageToDocs();
    await upLoadImageToDocs();
    const filteredVoteItems = voteInfo.voteItems.filter(
      (item) => item.itemContent.length > 0,
    );
    const voteDTO = {
      voteType: voteInfo.voteType,
      title: voteInfo.title,
      deadline: voteInfo.deadline,
      voteItems: filteredVoteItems,
      nick,
      roomName: currentRoom.name,
    };
    voteStore
      .editVote({
        voteId: voteStore.currentVoteId,
        voteDTO,
      })
      .then((result) => {
        if (result) {
          onClose();
        }
      });
  }, [voteStore, voteInfo]);

  const handleCancelVote = useCallback(
    (isback: boolean) => {
      if (
        hasTitleChange ||
        hasItemChange ||
        voteInfo.isMultiple ||
        voteInfo.isAnonymous ||
        voteInfo.isDeadLine ||
        voteStore.uploadImageList.length > 0
      ) {
        uiStore.openDialog('cancelVote');
      } else {
        isback ? BackButton() : onClose();
      }
    },
    [hasTitleChange, hasItemChange, voteInfo],
  );

  const handleCancelVoteBackButton = useCallback(() => {
    uiStore.closeDialog('cancelVote');
  }, [uiStore]);

  return (
    <>
      <CommonDialogHeader
        iconType="back"
        title={editMode ? '투표 수정' : '투표 생성'}
        onIconClick={() => {
          handleCancelVote(true);
          setIsBack(true);
        }}
        onClose={() => {
          handleCancelVote(false);
          setIsBack(false);
        }}
      />
      <S.ScrollWrapper>
        <S.ContentWrapper>
          <S.TitleArea>
            <S.TitleTextField
              type="text"
              variant="filled"
              placeholder="제목을 입력해 주세요"
              visibleClear
              value={voteInfo.title}
              onChange={handleTitleChange('title')}
              onClear={() => {
                voteInfo.title = '';
                setHasTitleChange(false);
              }}
              helperText={`${
                voteInfo.title?.length ?? 0
              }/${VOTE_MAX_TITLE_LENGTH}`}
              autoFocus={!editMode}
              limit={VOTE_MAX_TITLE_LENGTH}
              InputProps={{
                disableUnderline: true,
              }}
            />
          </S.TitleArea>

          <S.VoteCategoryList>
            {voteInfo.voteItems.map((voteItem, idx) => (
              <VoteCategoryItem
                itemsLength={voteInfo.voteItems.length}
                item={voteItem}
                id={idx}
                key={idx}
                handleDeleteItem={handleDeleteItem}
                handleItemChange={handleItemChange('itemContent')(idx)}
              />
            ))}
            {voteInfo.voteItems.length < MAX_VOTEITEM_LENGTH && (
              <S.VoteCategoryAddButtonWrapper>
                <CommonButton
                  variant="secondary"
                  size="large"
                  onClick={handleAddItem}
                >
                  + 항목 추가
                </CommonButton>
              </S.VoteCategoryAddButtonWrapper>
            )}
          </S.VoteCategoryList>
          <S.StyledList>
            <S.StyledListItem>
              <S.StyledFormControl
                control={
                  <Checkbox
                    style={{ backgroundColor: Color.Background[0] }}
                    checked={voteInfo.isDeadLine}
                    onChange={handleDeadLineChange}
                  />
                }
                checkedColor={configStore.config.MainColor}
                label={'종료일 선택'}
              />
              <S.DeadLineWrapper>
                <EventDateItem
                  pickerCheck={voteInfo.isDeadLine}
                  date={deadLine}
                  onChange={handleDeadLineSelect}
                  isTimeInvalid={isTimeInvalid}
                />
              </S.DeadLineWrapper>
            </S.StyledListItem>
            <S.StyledListItem>
              <S.StyledFormControl
                control={
                  <Checkbox
                    style={{ backgroundColor: Color.Background[0] }}
                    checked={voteInfo.isMultiple}
                    onChange={handleMultipleChange}
                  />
                }
                checkedColor={configStore.config.MainColor}
                label={'복수 투표 가능'}
              />
            </S.StyledListItem>
            <S.StyledListItem>
              <S.StyledFormControl
                control={
                  <Checkbox
                    style={{ backgroundColor: Color.Background[0] }}
                    checked={voteInfo.isAnonymous}
                    onChange={handleAnonymousChange}
                  />
                }
                checkedColor={configStore.config.MainColor}
                label={'익명 투표'}
              />
            </S.StyledListItem>
          </S.StyledList>
        </S.ContentWrapper>
      </S.ScrollWrapper>
      <S.ButtonWrapper>
        <CommonButton
          size="large"
          onClick={editMode ? handleEditVote : handleCreateVote}
          disabled={!createVoteValid()}
        >
          {editMode ? '수정' : '생성'}
        </CommonButton>
      </S.ButtonWrapper>
      <ConfirmDialog
        open={uiStore.cancelVote}
        content="변경 사항을 저장하지 않고 나가시겠습니까?"
        okText="나가기"
        onClickOk={() => {
          isback ? BackButton() : onClose();
          uiStore.closeDialog('cancelVote');
        }}
        onClickCancel={handleCancelVoteBackButton}
        isOkNegative={true}
      />
    </>
  );
});

export default CreateVote;
