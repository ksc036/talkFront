import { useState, useEffect, useCallback } from 'react';

import { PersonaModel, RoomModel, useCoreStore } from '@wapl/core';
import { useTheme, Avatar, Icon, AppBarCloseButton } from '@wapl/ui';
import { observer } from 'mobx-react';

import { VoteStateType } from '@/@types';
import { NoticeCreateDto } from '@/@types/DTO';
import { VoteRequestDTO } from '@/@types/VoteDTO';
import ConfirmDialog from '@/components/Mobile/Dialogs/ConfirmDialog';
import { VoteModel } from '@/models/VoteModel';
import { useStore } from '@/stores';
import { activateActions, getAuthority } from '@/utils';

import * as S from './Styled';
import VotedUserModal from './VotedUserModal';
import { VoteFooter } from './VoteFooter';
import { VoteListItem } from './VoteListItem';
import VoteContextMenu from './VoteMenuModal.tsx';

interface VoteProps {
  onClose: () => void;
  onClickEdit: () => void;
  backButton: () => void;
}

const Vote = observer(({ onClose, onClickEdit, backButton }: VoteProps) => {
  const { voteStore, noticeStore, uiStore, configStore } = useStore();
  const { roomStore, userStore, personaStore } = useCoreStore();
  const { Color } = useTheme();

  const voteTargets = voteStore.voteTargets;
  const currentVote = voteStore.currentVote as VoteModel;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRevote, setIsRevote] = useState<boolean>(true);
  const [openVotedUser, setOpenVotedUser] = useState<boolean>(false);
  const [openNotiConfirm, setOpenNotiConfirm] = useState<boolean>(false);
  const [openVoteContextMenu, setOpenVoteContextMenu] =
    useState<boolean>(false);
  const [currentVoteCreator, setCurrentVoteCreator] =
    useState<PersonaModel | null>(null);
  const room = roomStore.getRoomById(
    roomStore.currentRoomId as number,
  ) as RoomModel;

  const authority = getAuthority(
    currentVote,
    roomStore.getRoomById(roomStore.currentRoomId as number) as RoomModel,
    userStore.selectedPersona,
  );

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

  const myId = userStore.selectedPersona?.id as number;
  const nick = userStore.selectedPersona?.nick ?? '';
  const voteDTO = {
    nick: nick,
    roomName: room.name,
  };

  const fetchCurrentVote = async () => {
    const voteId = voteStore.currentVoteId;
    await voteStore.getVote({ voteId });
    setIsLoading(false);
    voteStore.setVoteTarget([]);
    setIsRevote(voteStore.currentVote?.isVoted ?? false);
  };

  const handleContextMenuClick = useCallback(() => {
    setOpenVoteContextMenu(true);
  }, [voteStore, voteStore.currentVote, openVoteContextMenu]);

  const handleVotedUserClick = useCallback(() => {
    setOpenVotedUser(true);
  }, [voteStore, voteStore.currentVote, openVotedUser]);

  const handleDeleteVoteOpen = useCallback(() => {
    uiStore.openDialog('confirmVoteDelete');
    setOpenVoteContextMenu(false);
  }, [uiStore]);

  const handleDeleteVote = useCallback(() => {
    voteStore.deleteVote({
      voteId: voteStore.currentVoteId,
      nick:
        personaStore.getPersona(userStore.selectedPersona?.id as number)
          ?.nick ?? '',
      voteDTO,
    });
    uiStore.closeDialog('confirmVoteDelete');
    onClose();
    uiStore.openToast('투표가 삭제되었습니다.');
  }, [voteStore]);

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
      roomName: room.name,
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
      const voteRequestDTO: VoteRequestDTO = {
        voteTitle: voteStore.currentVote?.title,
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
    onClose();
  }, [voteStore.currentVoteId, voteStore]);

  useEffect(() => {
    fetchCurrentVote();
  }, []);

  useEffect(() => {
    const fetchPersonas = async () => {
      const persona = personaStore.getPersona(
        currentVote.personaId,
      ) as PersonaModel;
      if (!persona) {
        await personaStore.fetchPersona({
          personaId: currentVote.personaId,
        });
        const fetchedPersona =
          personaStore.getPersona(currentVote.personaId) ?? null;

        setCurrentVoteCreator(fetchedPersona);
      } else {
        setCurrentVoteCreator(persona);
      }
    };
    if (currentVote) fetchPersonas();
  }, [voteStore.currentVote, personaStore]);

  if (isLoading) return null;

  return (
    <S.Wrapper id="modal">
      <span>
        <S.StyledHeader
          leftSide={<AppBarCloseButton onClick={onClose} />}
          title="투표"
        />
        <S.CreateUserInfoWrapper>
          <Avatar
            imgSrc={currentVoteCreator?.profileImage ?? ''}
            outLineColor="transparent"
            size={36}
          />
          <S.CreateContentWrapper>
            <S.CreateUser>{currentVoteCreator?.nick}</S.CreateUser>
            <S.CreateDate>{currentVote?.formattedCreateAt}</S.CreateDate>
          </S.CreateContentWrapper>
          <S.MenuButton onClick={handleContextMenuClick}>
            <Icon.MoreLine width={20} height={20} color={Color.Gray[900]} />
          </S.MenuButton>
        </S.CreateUserInfoWrapper>
        <S.InfoWrapper>
          <S.VoteHeader>
            <S.VoteTitle>{currentVote?.title}</S.VoteTitle>
            <S.DescWrapper>
              {currentVote?.isAnonymous && <span>익명 투표</span>}
              {currentVote?.formattedDeadline && (
                <span>{currentVote?.formattedDeadline}</span>
              )}
              {currentVote?.isMultiple && <span>복수 선택</span>}
            </S.DescWrapper>
          </S.VoteHeader>
          <VoteListItem
            isAnonymous={currentVote?.isAnonymous}
            isMultiple={currentVote?.isMultiple}
            isVoted={currentVote?.isVoted}
            isRevote={isRevote}
            isClosed={currentVote?.isClosed}
            voteItems={currentVote?.voteItems}
            handleVotedUser={handleVotedUserClick}
          />
          <span>{currentVote?.numberUsers}명 참여</span>
        </S.InfoWrapper>
      </span>
      {!currentVote?.isClosed && (
        <VoteFooter
          handleVote={handleVote}
          handleCloseVote={handleCloseVote}
          isRevote={isRevote}
          setIsRevote={setIsRevote}
          isMine={currentVote?.personaId === myId}
        />
      )}

      {currentVote && (
        <VoteContextMenu
          open={openVoteContextMenu}
          onClose={() => setOpenVoteContextMenu(false)}
          handleDeleteVote={handleDeleteVoteOpen}
          handleRoomNotice={() => {
            setOpenNotiConfirm(true);
            setOpenVoteContextMenu(false);
          }}
          handleEditMode={onClickEdit}
          activateEdit={activateEdit}
          activateDelete={activateDelete}
        />
      )}
      <VotedUserModal
        open={openVotedUser}
        onClose={() => setOpenVotedUser(false)}
      ></VotedUserModal>
      <ConfirmDialog
        open={uiStore.confirmVoteDelete}
        title="투표 삭제"
        description={'공지로 등록하였을 경우,\n공지에서도 글이 삭제됩니다.'}
        okText="삭제"
        onClickOk={handleDeleteVote}
        onClickCancel={() => {
          uiStore.closeDialog('confirmVoteDelete');
        }}
        isOkNegative={true}
      />
      <ConfirmDialog
        open={uiStore.confirmDeletedVote}
        description={'삭제된 투표입니다.'}
        okText="확인"
        onClickOk={() => {
          uiStore.closeDialog('confirmDeletedVote');
          backButton();
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
    </S.Wrapper>
  );
});

export default Vote;
