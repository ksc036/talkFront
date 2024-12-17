import { useState, useEffect, MouseEvent, useCallback } from 'react';

import { PersonaModel, RoomModel, useCoreStore } from '@wapl/core';
import { useTheme, Avatar, Icon } from '@wapl/ui';
import { observer } from 'mobx-react';

import { VoteStateType } from '@/@types';
import { NoticeCreateDto } from '@/@types/DTO';
import { ConfirmDialog } from '@/components/Common/Dialog/ConfirmDialog';
import CommonDialogHeader from '@/components/Common/Dialog/DialogHeader';
import MobileVotedUserModal from '@/components/Mobile/VoteDialog/Vote/VotedUserModal';
import { VoteModel } from '@/models/VoteModel';
import { useStore } from '@/stores';
import { activateActions, getAuthority } from '@/utils';

import * as S from './Styled';
import VotedUserModal from './VotedUserModal';
import { VoteFooter } from './VoteFooter';
import { VoteListItem } from './VoteListItem';
import VoteMenuModal from './VoteMenuModal.tsx';

interface VoteProps {
  onClose: () => void;
  BackButton: () => void;
  onClickEdit: () => void;
}

const Vote = observer(({ onClose, BackButton, onClickEdit }: VoteProps) => {
  const { voteStore, noticeStore, talkStore, uiStore, configStore } =
    useStore();
  const { roomStore, userStore, personaStore } = useCoreStore();

  const voteTargets = voteStore.voteTargets;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRevote, setIsRevote] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openVotedUser, setOpenVotedUser] = useState<boolean>(false);
  const [openNotiConfirm, setOpenNotiConfirm] = useState<boolean>(false);
  const [currentVoteCreator, setCurrentVoteCreator] =
    useState<PersonaModel | null>(null);
  const currentRoom = roomStore.getRoomById(
    roomStore.currentRoomId as number,
  ) as RoomModel;
  const currentVote = voteStore.currentVote as VoteModel;

  const authority = getAuthority(
    voteStore.currentVote,
    currentRoom,
    userStore.selectedPersona,
  );

  const myId = userStore.selectedPersona?.id as number;
  const nick = userStore.selectedPersona?.nick ?? '';
  const voteDTO = {
    nick: nick,
    roomName: currentRoom.name,
  };

  const activateDelete = activateActions(
    'delete',
    configStore.CanDeleteEditContents.Delete,
    authority,
  );

  const activateEdit =
    activateActions(
      'edit',
      configStore.CanDeleteEditContents.Edit,
      authority,
    ) &&
    currentVote.numberUsers === 0 &&
    !currentVote.isClosed;

  const fetchCurrentVote = async () => {
    const voteId = voteStore.currentVoteId;
    await voteStore.getVote({ voteId });
    setIsLoading(false);
    voteStore.setVoteTarget([]);
    setIsRevote(voteStore.currentVote?.isVoted ?? false);
  };

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleVotedUserClick = useCallback(() => {
    setOpenVotedUser(true);
  }, [voteStore, voteStore.currentVote, openVotedUser]);

  const handleDeleteVoteOpen = useCallback(() => {
    uiStore.openDialog('confirmVoteDelete');
    setAnchorEl(null);
  }, [uiStore]);

  const handleDeleteVote = useCallback(async () => {
    await voteStore.deleteVote({
      voteId: voteStore.currentVoteId,
      nick:
        personaStore.getPersona(userStore.selectedPersona?.id as number)
          ?.nick ?? '',
      voteDTO,
    });
    uiStore.closeDialog('confirmVoteDelete');
    BackButton();
    uiStore.openToast('투표가 삭제되었습니다.');
  }, [voteStore, noticeStore, uiStore]);

  const handleRoomNotice = useCallback(() => {
    const roomId = roomStore.currentRoomId as number;
    const voteItems =
      voteStore.currentVote?.voteItems.map((voteItem) => ({
        itemContent: voteItem.itemContent,
        voteCount: voteItem.voteCount,
      })) ?? [];
    const voteBody = {
      title: voteStore.currentVote?.title ?? '',
      voteItems,
    };
    const noticeBody = {
      voteBody,
      voteId: voteStore.currentVoteId,
      voteStateType: 'CREATE' as VoteStateType,
    } as NoticeCreateDto;
    noticeStore.createNotice({
      noticeBody,
      isActive: true,
      roomId,
      roomName: currentRoom.name,
      nick,
      isVote: true,
    });
  }, [noticeStore, voteStore.currentVote]);

  const handleVote = useCallback(async () => {
    if (isRevote) {
      setIsRevote(false);
    } else {
      const voteItemIds = voteTargets.map((id) => id);
      const voteItems =
        voteStore.currentVote?.voteItems.map((voteItem) => ({
          voteItemId: voteItem.voteItemId,
          itemContent: voteItem.itemContent,
        })) ?? [];
      const voteRequestDTO = {
        voteTitle: voteStore.currentVote?.title ?? '',
        deadline: voteStore.currentVote?.deadline ?? null,
        voteItemIds: voteItemIds,
        voteType: voteStore.currentVote?.voteType,
        voteItems: voteItems,
      };
      await voteStore.vote({
        voteId: voteStore.currentVoteId,
        voteRequestDTO,
      });
    }
    fetchCurrentVote();
  }, [voteStore.currentVoteId, voteStore, voteTargets, isRevote]);

  const handleCloseVote = useCallback(async () => {
    await voteStore.closeVote({
      voteId: voteStore.currentVoteId,
      nick:
        personaStore.getPersona(userStore.selectedPersona?.id as number)
          ?.nick ?? '',
      voteDTO,
    });
    BackButton();
  }, [voteStore.currentVoteId, voteStore]);

  useEffect(() => {
    fetchCurrentVote();
  }, []);

  useEffect(() => {
    if (voteStore.currentVote?.isDeleted) {
      uiStore.setVoteDialogMode('allVote');
    } else {
      const fetchPersonas = async () => {
        if (voteStore.currentVote?.personaId) {
          const persona = personaStore.getPersona(
            voteStore.currentVote.personaId,
          ) as PersonaModel;
          if (!persona) {
            await personaStore.fetchPersona({
              personaId: voteStore.currentVote.personaId,
            });
            const fetchedPersona =
              personaStore.getPersona(voteStore.currentVote.personaId) ?? null;

            setCurrentVoteCreator(fetchedPersona);
          } else {
            setCurrentVoteCreator(persona);
          }
        }
      };
      fetchPersonas();
    }
  }, [voteStore.currentVote, personaStore]);

  if (isLoading) return null;

  const { Color } = useTheme();

  return (
    <>
      <CommonDialogHeader
        iconType="back"
        title="투표"
        onIconClick={BackButton}
        onClose={onClose}
      />
      {voteStore.currentVote && (
        <>
          <S.CreateUserInfoWrapper>
            <Avatar
              imgSrc={
                currentVoteCreator
                  ? personaStore.getPersona(currentVoteCreator.id)
                      ?.profileImage ??
                    personaStore.getPersona(currentVoteCreator.id)?.color ??
                    ''
                  : ''
              }
              outLineColor="transparent"
              size={36}
            />
            <S.CreateContentWrapper>
              <S.CreateUser>{currentVoteCreator?.nick}</S.CreateUser>
              <S.CreateDate>
                {voteStore.currentVote.formattedCreateAt}
              </S.CreateDate>
            </S.CreateContentWrapper>
            <S.MenuButton onClick={handleClick} focused={!!anchorEl}>
              <Icon.MoreLine width={20} height={20} color={Color.Gray[900]} />
            </S.MenuButton>
          </S.CreateUserInfoWrapper>
          <S.InfoWrapper>
            <S.VoteHeader>
              <S.VoteTitle>{voteStore.currentVote.title}</S.VoteTitle>
              <S.DescWrapper>
                {voteStore.currentVote.isAnonymous && <span>익명 투표</span>}
                {voteStore.currentVote.formattedDeadline && (
                  <span>{voteStore.currentVote.formattedDeadline}</span>
                )}
                {voteStore.currentVote.isMultiple && <span>복수 선택</span>}
              </S.DescWrapper>
            </S.VoteHeader>
            <VoteListItem
              isAnonymous={voteStore.currentVote.isAnonymous}
              isMultiple={voteStore.currentVote.isMultiple}
              isVoted={voteStore.currentVote.isVoted}
              isRevote={isRevote}
              isClosed={voteStore.currentVote.isClosed}
              voteItems={voteStore.currentVote.voteItems}
              handleVotedUser={handleVotedUserClick}
            />
            <span>{voteStore.currentVote.numberUsers}명 참여</span>
            {!voteStore.currentVote.isClosed && (
              <VoteFooter
                handleVote={handleVote}
                handleCloseVote={handleCloseVote}
                isRevote={isRevote}
                setIsRevote={setIsRevote}
                isMine={voteStore.currentVote.personaId === myId}
              />
            )}
          </S.InfoWrapper>
        </>
      )}
      {voteStore.currentVote && (
        <VoteMenuModal
          anchorEl={anchorEl}
          setAnchorEl={setAnchorEl}
          handleDeleteVote={handleDeleteVoteOpen}
          handleRoomNotice={() => {
            setOpenNotiConfirm(true);
            setAnchorEl(null);
          }}
          handleEditMode={onClickEdit}
          activateEdit={activateEdit}
          activateDelete={activateDelete}
        />
      )}
      {talkStore.isMini ? (
        <MobileVotedUserModal
          open={openVotedUser}
          onClose={() => setOpenVotedUser(false)}
        />
      ) : (
        <VotedUserModal
          open={openVotedUser}
          onClose={() => setOpenVotedUser(false)}
        />
      )}
      <ConfirmDialog
        open={uiStore.confirmVoteDelete}
        title="투표 삭제"
        description={'공지로 등록하였을 경우,\n공지에서도 글이 삭제됩니다.'}
        okText="삭제"
        onClickOk={handleDeleteVote}
        isOkNegative={true}
        onClickCancel={() => uiStore.closeDialog('confirmVoteDelete')}
      />
      <ConfirmDialog
        open={uiStore.confirmDeletedVote}
        description={'삭제된 투표입니다.'}
        okText="확인"
        onClickOk={() => {
          uiStore.closeDialog('confirmDeletedVote');
          onClose();
        }}
      />
      <ConfirmDialog
        open={uiStore.confirmUpdatedVote}
        description={'수정된 투표입니다. 다시 투표해주세요'}
        okText="확인"
        onClickOk={() => {
          uiStore.closeDialog('confirmUpdatedVote');
          fetchCurrentVote();
        }}
      />
      <ConfirmDialog
        open={uiStore.confirmClosedVote}
        description={'마감된 투표입니다.'}
        okText="확인"
        onClickOk={() => {
          uiStore.closeDialog('confirmClosedVote');
          onClose();
        }}
      />
      <ConfirmDialog
        open={openNotiConfirm}
        description={`${configStore.FeatureNameType.Room} 공지는 1건만 노출됩니다.`}
        title="공지 등록"
        okText="등록"
        onClickOk={() => {
          setOpenNotiConfirm(false);
          handleRoomNotice();
        }}
        onClickCancel={() => setOpenNotiConfirm(false)}
      />
    </>
  );
});

export default Vote;
