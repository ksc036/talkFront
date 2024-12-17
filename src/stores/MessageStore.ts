import uuid from 'react-uuid';
import { VirtuosoHandle } from 'react-virtuoso';

import { RoomModel } from '@wapl/core';
import { idbController as controller } from '@wapl/pl-idb';
import axios, { CancelTokenSource } from 'axios';
import { makeAutoObservable, transaction } from 'mobx';
import moment from 'moment-timezone';

import * as T from '@/@types';
import { RoomInfo } from '@/@types/DTO';
import { MESSAGE_SIZE } from '@/constants';
import { CreateMessageDto, DeleteFileDto } from '@/dto';
import {
  AttachmentItemModel,
  MessageModel,
  TotalSearchMessageModel,
} from '@/models';
import {
  MessageRepoImpl,
  MessageRepo,
  FileRepository,
  FileRepoImpl,
} from '@/repositories';
import {
  setMessageOrderInfo,
  parseContentRoomMessage,
  isMobile,
  timeStampFormat,
  getRoomType,
  unescapeHtml,
} from '@/utils';

import { RootStore } from './RootStore';

const INITIAL_FIRST_ITEM_INDEX = 10000000;

export class MessageStore {
  rootStore: RootStore;
  repo: MessageRepo = MessageRepoImpl;
  fileRepo: FileRepository = FileRepoImpl;
  _messages: MessageModel[] = [];
  newMessageId: number | undefined = undefined;
  newIncomingMessage: MessageModel | null = null;
  upHasMore = false;
  downHasMore = false;
  firstItemIndex = INITIAL_FIRST_ITEM_INDEX;
  replyMessage: MessageModel | null = null;
  replyMessageId = -1;
  parentMessageId = -1;
  hoveredMessageId = -1;
  hoveredMessage: MessageModel | null = null;
  gotoReplyOriginTargetId = -1;
  virtuosoRef: VirtuosoHandle | undefined | null = null;
  isScrollBottom = false;
  isScrolling = false;
  _myLastReadMsgId: T.MessageId = -1;
  lastReadMessageIdMap: Map<number, T.DTO.LastReadMessageId[]> = new Map();
  lastLoadedMessageIndex = 0;
  prevUnreadCount: number | undefined = undefined;
  roomMetadataMap: Map<
    T.RoomId,
    {
      lastMessageDate: Date;
      lastMessage: string;
      lastMessageId: T.MessageId;
      count: number;
    }
  > = new Map(null);
  roomMetaVersion = 1;
  roomMetaStoreName = 'room_meta';
  state: T.MessageFetchStateType = 'init';
  isComplete = 'init';
  targetId = -1;
  _scrollTargetIndex = 0;
  _userList: T.UserInfo[] = [];
  personaId = -1;
  /**
   * upload status data
   ** key: message temp id
   ** cancel: axios CancelTokenSource
   ** status: message upload status
   */
  uploadMessageInfo: {
    [tempId: string]: {
      source: CancelTokenSource;
      status: string;
      msg: CreateMessageDto;
      retryAttach?: AttachmentItemModel;
    };
  } = {};
  // searh 관련
  searchKeyword = '';
  searchResultIds: number[] = [];
  searchMessageList: MessageModel[] = [];
  searchIndex = 0;
  totalSearchKeyword = '';
  totalSearchMessage: TotalSearchMessageModel = {
    hasMore: false,
    totalCnt: 0,
    messages: [],
  };
  // 메시지 삭제 관련
  deleteMessageIdList: T.MessageId[] = [];
  deleteMessageDocumentIdsList: T.MessageDocumentsIds[] = [];
  // docs의 driveStore.requestUploadDocument이 완료되기 전 tempFileMessage 배열
  tempFileMessages: MessageModel[] = [];
  // 내가 포커스하고있는 방. 다른 세션의 포커스도 담는다.
  isFocus = true;
  messageTargetDay: number | undefined = undefined;
  serverTimeZone: string | undefined = undefined;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  initialize() {
    this.rootStore.talkStore?.addHandler('ADD_COUNT', (jsonMessage) => {
      this.handleAddNewMessage(jsonMessage as T.SocketMessage);
    });
    // 임시 추가
    this.rootStore.talkStore?.addHandler('CREATE_MESSAGE', (jsonMessage) => {
      this.handleAddNewMessage(jsonMessage as T.SocketMessage);
    });
    this.rootStore.talkStore?.addHandler('DELETE_MESSAGE', (jsonMessage) => {
      this.handleDeleteMessage(
        jsonMessage as T.SocketMessage,
        jsonMessage.roomId,
      );
    });
    this.rootStore.talkStore?.addHandler('BLIND_MESSAGE', (jsonMessage) => {
      this.handleBlindMessage(
        jsonMessage as T.SocketMessage,
        jsonMessage.roomId,
      );
    });
    this.rootStore.talkStore?.addHandler('UPDATE_MESSAGE', (jsonMessage) => {
      this.handleUpdateMessage(jsonMessage as T.SocketMessage);
    });
    this.rootStore.talkStore?.addHandler('READ_MESSAGE', (jsonMessage) => {
      this.handleReadMessage(jsonMessage as T.SocketMessage);
    });
    this.rootStore.talkStore?.addHandler('UPDATE_ADMIN', (jsonMessage) => {
      this.rootStore.coreStore?.roomStore.fetchRoomDetail({
        roomId: jsonMessage.roomId,
        appId: window.APP_ID,
      });
    });
    this.rootStore.talkStore?.addHandler('DELETE_LINK', (jsonMessage) => {
      this.handleDeleteLink(jsonMessage as T.SocketMessage);
    });
    this.rootStore.talkStore?.addHandler('TALK_UPDATE_DAY', (jsonMessage) => {
      this.handleUpdateMessageTargetDay(jsonMessage as T.SocketMessage);
    });

    controller
      .createObjectStore({
        indexes: [],
        storeName: this.roomMetaStoreName,
        keyPath: 'room_id',
        autoIncrement: false,
        version: this.roomMetaVersion,
      })
      .then((res: any) => {
        if (res.result) {
          controller
            .getAll({ storeName: this.roomMetaStoreName })
            .then((getAllres: any) => {
              if (getAllres.result) {
                getAllres.result.forEach(
                  ({
                    room_id,
                    room_meta,
                  }: {
                    room_id: number;
                    room_meta: any;
                  }) => {
                    this.roomMetadataMap.set(room_id, room_meta);
                  },
                );
              }
            });
        }
      });
  }

  get messages() {
    return this._messages;
  }

  getRoomMeta(roomId: number) {
    return this.roomMetadataMap.get(roomId);
  }

  setIsFocus(isFocus: boolean) {
    this.isFocus = isFocus;
  }

  setMessage(messages: MessageModel[]) {
    this._messages = messages;
  }

  spliceMessage(index: number, length: number, message?: MessageModel): void {
    if (message) this._messages.splice(index, length, message);
    else this._messages.splice(index, length);
  }

  setHoveredMessageId(messageId: number) {
    this.hoveredMessageId = messageId;
  }

  setNewIncomingMessage(message: MessageModel | null) {
    this.newIncomingMessage = message;
  }

  setGotoReplyOriginTargetId(targetId: number): void {
    this.gotoReplyOriginTargetId = targetId;
  }

  setDeleteMessageIdList(deleteMessageIdList: T.MessageId[]): void {
    this.deleteMessageIdList = deleteMessageIdList;
  }
  setDeleteMessageDocumentIdsList(
    deleteMessageDocumentIdsList: T.MessageDocumentsIds[],
  ): void {
    this.deleteMessageDocumentIdsList = deleteMessageDocumentIdsList;
  }
  clearDeleteMessageIdList() {
    this.setDeleteMessageIdList([]);
  }
  clearDeleteMessageDocumentIdsList() {
    this.setDeleteMessageDocumentIdsList([]);
  }
  checkDeleteMessage(messageId: T.MessageId): void {
    this.setDeleteMessageIdList(this.deleteMessageIdList.concat([messageId]));
  }
  checkDeleteMessageDocuments(messageDocumentIds: T.MessageDocumentsIds): void {
    this.setDeleteMessageDocumentIdsList(
      this.deleteMessageDocumentIdsList.concat(messageDocumentIds),
    );
  }
  uncheckDeleteMessage(messageId: T.MessageId): void {
    const filtered = this.deleteMessageIdList.filter(
      (item) => item !== messageId,
    );
    this.setDeleteMessageIdList(filtered);
  }
  uncheckDeleteMessageDocuments(msgId: number): void {
    const filtered = this.deleteMessageDocumentIdsList.filter(
      (item) => item.msgId !== msgId,
    );
    this.setDeleteMessageDocumentIdsList(filtered);
  }

  get scrollTargetIndex() {
    return this._scrollTargetIndex;
  }

  setScrollTargetIndex(index: number) {
    this._scrollTargetIndex = index;
  }

  get userList() {
    return this._userList;
  }

  get myId() {
    return this.userList.find((item) => item.isMyId)?.id;
  }

  setUserList(userIdList: T.PersonaId[], myId: T.PersonaId) {
    this._userList = userIdList.map((id) => {
      return { id: id, isMyId: myId === id };
    });
  }

  deleteLastReadMessageInfo(roomId: number) {
    this.lastReadMessageIdMap.delete(roomId);
  }

  // m.roomId 가 현재룸 id 와 같은지 확인
  // A 룸에서 메세지 보내고 B 룸으로 이동했는데 B룸으로 이동후에 메세지 늦게 생성되면 B룸에 메세지 보여지는 현상 방지
  checkValidMessage() {
    this.setMessage(
      this.messages.filter(
        (m) => m.roomId === this.rootStore.coreStore?.roomStore.currentRoomId,
      ),
    );
  }

  get unReadMsgCount() {
    let sum = 0;
    const visibleRoomList = this.rootStore.coreStore?.roomStore.roomList.filter(
      (room) => room.isVisible,
    );
    visibleRoomList?.forEach((room) => {
      const roomMeta = this.roomMetadataMap.get(room.id);
      if (roomMeta) sum += roomMeta.count;
    });
    return sum;
  }

  async handleAddNewMessage(jsonMessage: T.SocketMessage) {
    const coreStore = this.rootStore.coreStore;
    const message = new MessageModel(jsonMessage);
    // 룸 메타 데이타 업데이트 (보고있지 않은방)
    // 추후에 sessionId 보고 updateRoomMetadata 할지말지 구분해줘야함.
    if (!message.isAutoMessage) {
      const lastMessageDate = timeStampFormat(
        message.createdAt,
        'YYYY-MM-DD HH:mm:ss',
      );
      let count = this.roomMetadataMap.get(message.roomId)?.count ?? 0;

      if (
        message.roomId !== coreStore?.roomStore.currentRoomId ||
        !this.isFocus
      ) {
        count++;
      }
      // SAS 작업 필요: isBlocked를 PersonaModel이 아닌, 연락처를 통해 확인
      // const isBlockedMessage = coreStore.personaStore.getPersona(
      //   jsonMessage.personaId,
      // )?.isBlocked;
      if (!this.serverTimeZone) {
        this.setServerTimeZone(message.createdAt);
      }

      const content = await parseContentRoomMessage(
        message.msgBody,
        Number(jsonMessage.msgType),
        Boolean(message.isDeleted) ? 1 : 0,
        // SAS 작업 필요: isBlocked를 PersonaModel이 아닌, 연락처를 통해 확인
        // isBlockedMessage,
      );
      const roomMetadata = {
        lastMessageDate: new Date(lastMessageDate),
        lastMessage: content,
        lastMessageId: message.msgId,
        count: count,
      };
      this.roomMetadataMap.set(message.roomId, roomMetadata);
      if (this.roomMetadataMap.has(message.roomId))
        controller.put({
          storeName: this.roomMetaStoreName,
          keyOptions: message.roomId,
          value: { room_meta: roomMetadata },
        });
      else
        controller.add({
          storeName: this.roomMetaStoreName,
          value: { room_id: message.roomId, room_meta: roomMetadata },
          version: this.roomMetaVersion,
        });
      if (coreStore?.roomStore.roomMap.has(message.roomId)) {
        coreStore?.roomStore.updateLastNotification({
          roomId: message.roomId,
          newLastNotification: {
            date: new Date(roomMetadata.lastMessageDate),
            count: roomMetadata.count,
          },
        });
        coreStore?.roomStore.updateSubText({
          roomId: message.roomId,
          newSubText: unescapeHtml(roomMetadata.lastMessage),
        });
      }
    }

    // Todo: room에 대한 처리(roomMap 조작)이기 때문에 룸쪽에서 처리하는 것으로 추후 변경 예정. (요청 드림)
    if (message.isAutoMessage) {
      // 내가 보고 있지 않은 룸에 대해 나에 대한 강퇴 메시지이면 roomMap에서 삭제 (다른 디바이스로 보고 있는 경우 고려)
      if (
        message.roomId !== coreStore?.roomStore.currentRoomId &&
        (message.msgBody.autoMsgType === 'member-out' ||
          message.msgBody.autoMsgType === 'member-kick') &&
        message.msgBody.memberList?.includes(
          coreStore?.userStore.selectedPersona?.id as number,
        )
      ) {
        coreStore?.roomStore.roomMap.delete(message.roomId);
        this.deleteLastReadMessageInfo(message.roomId);
      }
    }

    const myLastReadMsgId = this.getMyLastReadMsgId(
      coreStore?.roomStore.currentRoomId as number,
    );
    if (
      this.isFocus &&
      !message.isAutoMessage &&
      message.roomId === coreStore?.roomStore.currentRoomId &&
      (myLastReadMsgId === undefined || myLastReadMsgId < message.msgId)
    )
      this.updateLastReadMessageId({
        roomId: coreStore?.roomStore.currentRoomId,
        msgId: message.msgId,
      });

    // 링크 첨부함에 실시간 반영
    if (
      message.msgType.includes('url') &&
      message.roomId === coreStore?.roomStore.currentRoomId
    )
      this.rootStore.linkStore.handleLinkWebsocket(message);

    const lastReadMessageIdList = this.lastReadMessageIdMap.get(message.roomId);
    if (!lastReadMessageIdList) return;
    if (this.messages.some((item) => item.msgId === message.msgId)) return;
    if (this.messages.every((item) => item.tempId !== message.tempId))
      message.setTempId('');

    if (message.msgType.includes('autoMsg')) {
      switch (message.msgBody.autoMsgType) {
        case 'member-in-Private':
        case 'member-in-Open':
          message.msgBody.memberList?.forEach((id) => {
            lastReadMessageIdList.push({
              lastReadMsgId: message.msgId, // 소수?
              roomId: message.roomId,
              personaId: Number(id),
            });
          });
          break;
        case 'member-out-Open':
        case 'member-out-Private':
        case 'member-out':
          // memberList에 requestId가 포함되면 스스로 나간 경우, 포함 되지 않으면 퇴장 당한 경우
          if (
            message.msgBody.requestId &&
            message.msgBody.memberList?.includes(message.msgBody.requestId)
          ) {
            if (
              message.msgBody.memberList?.includes(
                coreStore?.userStore.selectedPersona?.id as number,
              )
            ) {
              if (!isMobile()) {
                this.rootStore.uiStore.setSelectedLNBTab('home');
                coreStore?.roomStore.setCurrentRoomId(0);
              }
              // Todo: room에 대한 처리(roomMap 조작)이기 때문에 룸쪽에서 처리하는 것으로 추후 변경 예정. (요청 드림)
              coreStore?.roomStore.roomMap.delete(
                coreStore?.roomStore.currentRoomId as number,
              );
            } else {
              message.msgBody.memberList?.forEach((id) => {
                const targetIndex = lastReadMessageIdList.findIndex(
                  (item) => item.personaId === id,
                );
                const target = lastReadMessageIdList[targetIndex];
                const startIndex = this.messages.findIndex(
                  (ele) => ele.msgId >= target.lastReadMsgId,
                );
                // 나간 사람의 lastReadMessageId가 Infinity 인경우 아래 for문 돌지않도록
                if (startIndex !== -1)
                  for (let i = startIndex + 1; i < this.messages.length; i++)
                    this.messages[i].unReadCount -= 1;
                lastReadMessageIdList.splice(targetIndex, 1);
              });
            }
          }
          break;
        case 'member-kick':
          if (
            message.msgBody.memberList?.includes(
              coreStore?.userStore.selectedPersona?.id as number,
            )
          ) {
            if (isMobile()) {
              this.rootStore.openRoomStore.setRoomDeleted(true);
            } else {
              this.rootStore.uiStore.setSelectedLNBTab('home');
              coreStore?.roomStore.setCurrentRoomId(0);
              this.rootStore.uiStore.setRoomKickedout(true);
            }
            // Todo: room에 대한 처리(roomMap 조작)이기 때문에 룸쪽에서 처리하는 것으로 추후 변경 예정. (요청 드림)
            coreStore?.roomStore.roomMap.delete(
              coreStore?.roomStore.currentRoomId as number,
            );
          } else {
            message.msgBody.memberList?.forEach((id) => {
              const targetIndex = lastReadMessageIdList.findIndex(
                (item) => item.personaId === id,
              );
              const target = lastReadMessageIdList[targetIndex];
              const startIndex = this.messages.findIndex(
                (ele) => ele.msgId >= target.lastReadMsgId,
              );
              // 나간 사람의 lastReadMessageId가 Infinity 인경우 아래 for문 돌지않도록
              if (startIndex !== -1)
                for (let i = startIndex + 1; i < this.messages.length; i++)
                  this.messages[i].unReadCount -= 1;
              lastReadMessageIdList.splice(targetIndex, 1);
            });
          }
          break;
        default:
          break;
      }
    }

    if (message.roomId !== coreStore?.roomStore.currentRoomId) return;

    //새로 받은 메시지 저장
    if (!message.isAutoMessage) {
      this.setNewIncomingMessage(message);
    }

    // 온 메세지에 unreadCount 세팅
    this.calculateUnReadCount({ lastReadMessageIdList, message });

    // 메세지 순서 보장하려고 하는듯
    if (message.tempId) {
      const tempMsgIndex = this.messages.findIndex(
        (ele) => ele.tempId === message.tempId,
      );

      if (tempMsgIndex !== -1) this.spliceMessage(tempMsgIndex, 1);
    }
    const index = this.messages.findIndex((ele) => ele.msgId > message.msgId);
    message.setTempId('');
    setMessageOrderInfo(
      this.messages,
      [message],
      index === -1 ? this.messages.length : index,
    );
    if (!this.upHasMore && this.messages[0]) {
      this.messages[0]?.setFirst(true);
      this.messages[0]?.setHead(true);
    }
    if (index === -1 && this.downHasMore) return;
    else if (index === -1) this.setMessage(this.messages.concat([message]));
    else this.spliceMessage(index, 1, message);

    this.checkValidMessage();
  }

  handleUpdateMessage(jsonMessage: T.SocketMessage) {
    if (
      jsonMessage.roomId !== this.rootStore.coreStore?.roomStore.currentRoomId
    )
      return;
    const message = new MessageModel(jsonMessage);
    const messageId = message.msgId;
    const target = this.messages.find((message) => message.msgId === messageId);
    if (target) {
      target.setOgInfo(
        message.msgBody.ogDescription ?? '',
        message.msgBody.ogImageUrl ?? '',
        message.msgBody.ogTitle ?? '',
        message.msgBody.linkId,
      );
      if (this.isScrollBottom) {
        setTimeout(() => {
          this.scrollToBottom('auto');
        }, 1);
      }
    }

    if (message.msgType.includes('url'))
      this.rootStore.linkStore.handleUpdateLink(message);
  }

  // 내가 현재세션/ 다른 세션에서 룸 입장시 현재세션의 lnb영역 업데이트
  updateRoomMeta(jsonMessage: T.SocketMessage) {
    const coreStore = this.rootStore.coreStore;
    if (jsonMessage.personaId === coreStore?.userStore.selectedPersona?.id) {
      let roomMetadata = this.roomMetadataMap.get(jsonMessage.roomId);
      if (roomMetadata) {
        roomMetadata.count = 0;
      } else {
        roomMetadata = {
          count: 0,
          lastMessage: '',
          lastMessageDate: new Date(),
          lastMessageId: 0,
        };
        this.roomMetadataMap.set(jsonMessage.roomId, roomMetadata);
      }
      if (coreStore?.roomStore.roomMap.has(jsonMessage.roomId)) {
        coreStore?.roomStore.updateLastNotification({
          roomId: jsonMessage.roomId,
          newLastNotification: {
            date: roomMetadata.lastMessageDate,
            count: roomMetadata.count,
          },
        });
        coreStore?.roomStore.updateSubText({
          roomId: jsonMessage.roomId,
          newSubText: unescapeHtml(roomMetadata.lastMessage),
        });
      }
    }
  }

  // 가지고 있는 언리드 테이블 업데이트
  handleReadMessage(jsonMessage: T.SocketMessage) {
    this.updateRoomMeta(jsonMessage);

    const lastReadMessageIdList = this.lastReadMessageIdMap.get(
      jsonMessage.roomId,
    );
    if (!lastReadMessageIdList) return;

    const msgId = jsonMessage.lastReadMsgId;
    const target = lastReadMessageIdList.find(
      (item) => item.personaId === jsonMessage.personaId,
    );

    if (!target) return;

    if (target.lastReadMsgId >= msgId) return;

    // 내가 보고있는 방아니면 unreadCount는 계산할 필요x 테이블 업데이트만 하고 리턴.
    if (
      jsonMessage.roomId !==
        this.rootStore.coreStore?.roomStore.currentRoomId &&
      target
    ) {
      target.lastReadMsgId = msgId;
      return;
    }

    // readMessage 안에서 테이블 정렬이뤄진다.
    this.readMessage(msgId, jsonMessage.personaId, lastReadMessageIdList);
  }

  handleDeleteMessage(jsonMessage: T.SocketMessage, roomId: T.RoomId) {
    const coreStore = this.rootStore.coreStore;
    const { msgIds, childMsgIds } = jsonMessage;
    // 원본 메시지 삭제된 경우
    const deletedMessages = this.messages.filter((message) =>
      msgIds.includes(message.msgId),
    );
    deletedMessages.forEach((deletedMessage) => {
      deletedMessage.setDeleted(1);
    });
    msgIds.forEach((msgId: T.MessageId) => {
      const roomMetadata = this.roomMetadataMap.get(roomId);
      if (roomMetadata && roomMetadata.lastMessageId === msgId) {
        roomMetadata.lastMessage = '삭제된 메시지입니다.';
        if (coreStore?.roomStore.roomMap.has(roomId)) {
          coreStore?.roomStore.updateLastNotification({
            roomId: roomId,
            newLastNotification: {
              date: roomMetadata.lastMessageDate,
              count: roomMetadata.count,
            },
          });
          coreStore?.roomStore.updateSubText({
            roomId: roomId,
            newSubText: roomMetadata.lastMessage,
          });
        }
      }
    });
    // 부모 메시지 삭제 된 경우
    if (childMsgIds) {
      this.messages.forEach((message) => {
        if (childMsgIds.includes(message.msgId)) {
          message.setParentDeleted(1);
        }
      });
    }
    this.handleDeleteLinkMsg(jsonMessage);
  }

  handleBlindMessage(jsonMessage: T.SocketMessage, roomId: T.RoomId) {
    const coreStore = this.rootStore.coreStore;
    const { msgIds } = jsonMessage;
    const blindedMessages = this.messages.filter((message) =>
      msgIds.includes(message.msgId),
    );
    blindedMessages.forEach((blindedMessage) => {
      blindedMessage.setDeleted(jsonMessage.deletedFrom);
      const roomMetadata = this.roomMetadataMap.get(roomId);
      if (roomMetadata && roomMetadata.lastMessageId === blindedMessage.msgId) {
        roomMetadata.lastMessage =
          jsonMessage.deletedFrom === 2
            ? '방장이 블라인드 처리한 메시지입니다.'
            : '신고에 의해 블라인드 처리된 메시지입니다.';
        if (coreStore?.roomStore.roomMap.has(roomId)) {
          coreStore?.roomStore.updateLastNotification({
            roomId: roomId,
            newLastNotification: {
              date: roomMetadata.lastMessageDate,
              count: roomMetadata.count,
            },
          });
          coreStore?.roomStore.updateSubText({
            roomId: roomId,
            newSubText: roomMetadata.lastMessage,
          });
        }
      }
    });
  }

  setReplyMessage(messageId: T.MessageId): void {
    const replyMessage = this.messages.find(
      (message) => message.msgId === messageId,
    );
    if (replyMessage) {
      this.replyMessage = replyMessage;
    }
  }

  setReplyMessageId(messageId: T.MessageId): void {
    this.replyMessageId = messageId;
  }

  setParentMessageId(messageId: T.MessageId): void {
    this.parentMessageId = messageId;
  }

  setHoveredMessage(message: MessageModel): void {
    this.hoveredMessage = message;
  }

  setState(state: T.MessageFetchStateType): void {
    this.state = state;
  }

  setIsComplete(state: string): void {
    this.isComplete = state;
  }

  setServerTimeZone(createdAt: string): void {
    this.serverTimeZone = createdAt?.match(/\[(.*)\]/)?.[1] ?? 'Asia/Seoul';
  }

  clear(): void {
    this.setState('init');
    this.setIsComplete('init');
    this.clearMessage();
    this.newMessageId = undefined;
    this.clearReplyMessage();
    this.clearSticker();
    this.setFirstItemIndex(INITIAL_FIRST_ITEM_INDEX);
    this.upHasMore = false;
    this.downHasMore = false;
    this.lastLoadedMessageIndex = 0;
    this.setScrollTargetIndex(0);
    this.prevUnreadCount = undefined;
    this.setSearchResultIds([]);
    this.setGotoReplyOriginTargetId(-1);
  }

  clearSticker(): void {
    this.rootStore.uiStore.setStickerPreview(false);
    this.rootStore.emoticonStore.setSelectedSticker('');
  }

  clearReplyMessage(): void {
    this.replyMessage = null;
    this.rootStore.uiStore.setReplyVisible(false);
  }

  clearMessage(): void {
    this.setMessage([]);
  }

  getMyLastReadMsgId = (roomId: number) => {
    const myLastReadMsgId = this.lastReadMessageIdMap
      .get(roomId)
      ?.find(
        (item) =>
          item.personaId ===
          this.rootStore.coreStore?.userStore.selectedPersona?.id,
      )?.lastReadMsgId;
    return myLastReadMsgId;
  };

  getMyLastReadMsgIndex = (isFirstRender: boolean) => {
    if (!isFirstRender && this.targetId === -1) return this.scrollTargetIndex;
    const myLastReadMsgId =
      this.targetId !== -1
        ? this.targetId
        : this.getMyLastReadMsgId(
            this.rootStore.coreStore?.roomStore.currentRoomId as number,
          );
    const index =
      myLastReadMsgId && myLastReadMsgId !== Infinity
        ? this.messages.findIndex((ele) => ele.msgId === myLastReadMsgId)
        : this.messages.length - 1;
    return index;
  };

  getMessages = async ({
    targetId,
    upSize,
    downSize,
    roomEnterTime,
    isFirstLoad = false,
    source,
  }: {
    targetId?: number;
    upSize?: number;
    downSize?: number;
    roomEnterTime?: string;
    isFirstLoad?: boolean;
    source?: CancelTokenSource;
  }) => {
    const coreStore = this.rootStore.coreStore;
    try {
      const currentRoomId = coreStore?.roomStore.currentRoomId as number;
      const myLastReadMsgId = this.getMyLastReadMsgId(currentRoomId);
      const currentRoom = coreStore?.roomStore.getRoomById(currentRoomId);
      const isDm = currentRoom ? getRoomType(currentRoom).isDm : false;

      if (isFirstLoad) this.setState('init');
      else if (this.state === 'done') this.setState('loading');

      const { status, data } = await this.repo.getMessages({
        roomId: coreStore?.roomStore.currentRoomId as number,
        targetId: isFirstLoad
          ? this.targetId !== -1
            ? this.targetId
            : myLastReadMsgId === 0
            ? undefined
            : myLastReadMsgId
          : targetId,
        upSize,
        downSize,
        ...((isDm
          ? this.rootStore.configStore.DmRoomEnter
          : this.rootStore.configStore.RoomEnter) && { roomEnterTime }),
        source,
      });
      if (status === 'OK' && data) {
        if (!data.messages || data.messages.length === 0) {
          this.setState('done');
          this.setIsComplete('done');
          return;
        }

        if (!this.serverTimeZone && data.messages) {
          this.setServerTimeZone(data.messages?.[0]?.createdAt);
        }

        let lastMsgFindFlag = false;
        let scrollTargetMsgFindFlag = false;
        const userIdSet = new Set<number>();
        const messages =
          data.messages?.map(
            (
              message: MessageModel,
              index: number,
              messages: MessageModel[],
            ) => {
              this.rootStore.reactionStore.setReactionMap(
                message.msgId,
                message.reactions ?? [],
              );
              if (
                targetId &&
                message.msgId === targetId &&
                !scrollTargetMsgFindFlag
              ) {
                this.setScrollTargetIndex(index);
                scrollTargetMsgFindFlag = true;
              }
              const count =
                this.roomMetadataMap.get(message.roomId)?.count ?? 0;
              if (count > 0 && myLastReadMsgId && !lastMsgFindFlag) {
                if (
                  message.msgId === myLastReadMsgId &&
                  index + 1 < messages.length &&
                  messages[index + 1]
                ) {
                  this.newMessageId = messages[index + 1].msgId;
                  lastMsgFindFlag = true;
                }
              }
              if (!coreStore?.personaStore.getPersona(message.personaId)) {
                userIdSet.add(message.personaId);
              }
              const messageModel = new MessageModel(message);
              return messageModel;
            },
          ) ?? [];
        if (userIdSet.size > 0) {
          const userIdList = Array.from(userIdSet);
          coreStore?.personaStore.fetchPersonaList({
            personaIdList: userIdList,
          });
        }
        if (targetId === undefined || !scrollTargetMsgFindFlag)
          this.setScrollTargetIndex(messages.length - 1);

        setMessageOrderInfo(
          this.messages,
          messages,
          upSize ? 0 : this.messages.length,
        );
        if (!data.upHasMore) {
          messages[0]?.setFirst(true);
          messages[0]?.setHead(true);
        }
        if (!data.downHasMore) {
          messages[messages.length - 1]?.setTail(true);
        }
        const prevMessageLength = this.messages.length;
        const prevFirstItemIndex = this.firstItemIndex;
        transaction(() => {
          if (downSize && upSize) {
            // 검색할 때 / initial 메시지 get할 때
            this.upHasMore = data.upHasMore;
            this.downHasMore = data.downHasMore;
            this.setMessage(messages);
          } else if (!downSize && upSize) {
            // 현재 위치에서 위로 스크롤 시
            this.upHasMore = data.upHasMore;
            if (messages[messages.length - 1]?.msgId === this.messages[0].msgId)
              this.spliceMessage(0, 1);
            this.setMessage(messages.concat(this.messages));
          } else if (downSize && !upSize) {
            // 현재 위치에서 아래로 스크롤 시
            this.downHasMore = data.downHasMore;
            if (
              messages[0]?.msgId ===
              this.messages[this.messages.length - 1].msgId
            )
              messages.splice(0, 1);
            this.setMessage(this.messages.concat(messages));
          }
          if (upSize && !downSize) {
            this.setFirstItemIndex(
              prevFirstItemIndex - (this.messages.length - prevMessageLength),
            );
          } else if (upSize && downSize) {
            this.setFirstItemIndex(INITIAL_FIRST_ITEM_INDEX);
          }
          if (!data.downHasMore) {
            const msgArr: MessageModel[] = [];
            for (const key in this.uploadMessageInfo) {
              const tmpMsg = this.uploadMessageInfo[key].msg;
              if (tmpMsg.targetRoomId === coreStore?.roomStore.currentRoomId) {
                const tempId = tmpMsg.tempId || uuid();
                const tempData = {
                  msgBody: tmpMsg.msgBody,
                  msgId: 0,
                  roomId: coreStore?.roomStore.currentRoomId,
                  personaId: this.myId as number,
                  tempId: tempId,
                  isDeleted: 0,
                  createdAt: moment().format(),
                  msgType: tmpMsg.msgType,
                  rawContent: tmpMsg.rawContent ?? '',
                };
                const tempMessage = new MessageModel(tempData);
                msgArr.push(tempMessage);
              }
            }
            this.setMessage(this.messages.concat(msgArr));
          }
        });

        await this.setPartialUnreadUserCount({ isFirstLoad, downSize, upSize });

        // 룸 이동했는데 아직 전송완료 안된 tempFileMessages가 이동한 룸에 남아있다면 그려준다
        // if (isFirstLoad && !this.downHasMore) {
        //   this.setMessage([
        //     ...this.messages,
        //     ...this.tempFileMessages.filter(
        //       (m) =>
        //         m.msgId === 0 && m.roomId === coreStore.roomStore.currentRoomId,
        //     ),
        //   ]);
        // }

        this.setState('done');
        this.setIsComplete('done');
      }
    } catch (error) {
      console.log(error);
    }
  };

  getDateMessageIds = async ({
    roomId,
    year,
    month,
    roomEnterTime,
  }: {
    roomId: number;
    year: string;
    month: string;
    roomEnterTime: string;
  }) => {
    try {
      const { status, data } = await this.repo.getDateMessageIds({
        roomId,
        year,
        month,
        roomEnterTime,
      });
      if (status === 'OK') {
        return data;
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  readMessage(
    msgId: number,
    userId: number,
    lastReadMessageIdList: T.DTO.LastReadMessageId[],
  ) {
    const target = lastReadMessageIdList?.find(
      (item) => item.personaId === userId,
    );
    if (
      target
      // && target.lastReadMsgId !== msgId
    ) {
      const prevMsgId = target.lastReadMsgId;
      const prevMsgIndex = this.messages.findIndex(
        (item) => item.msgId === prevMsgId,
      );
      target.lastReadMsgId = msgId;
      // 정렬
      lastReadMessageIdList?.sort(
        ({ lastReadMsgId: a }, { lastReadMsgId: b }) => b - a,
      );

      if (this.prevUnreadCount && this.messages[0]?.msgId > prevMsgId)
        this.prevUnreadCount -= 1;

      for (
        let i = prevMsgIndex === -1 ? 0 : prevMsgIndex + 1;
        i <= this.messages.length - 1;
        i += 1
      ) {
        // read 로직이 도는 와중에 새로운 메세지가 온경우, 새로운 메세지를 계산에서 제외시켜야함
        if (this.messages[i].msgId > msgId) return;
        const targetMessage = this.messages[i];

        targetMessage.setUnReadCount(targetMessage.unReadCount - 1);
      }
    }
  }

  createTempMessage = (msg: CreateMessageDto) => {
    const coreStore = this.rootStore.coreStore;
    const tempId = uuid();
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    const tempData = {
      msgBody: msg.msgBody,
      msgId: 0,
      roomId: coreStore?.roomStore.currentRoomId as number,
      personaId: coreStore?.userStore.selectedPersona?.id as number,
      tempId: tempId,
      isDeleted: 0,
      createdAt: moment().format(),
      msgType: msg.msgType,
      rawContent: msg.rawContent ?? '',
    };
    const tempMessage = new MessageModel(tempData);
    tempMessage.setTempId(tempId);
    msg.tempId = tempId;
    this.uploadMessageInfo[tempId] = {
      source: source,
      status: 'loading',
      msg,
    };

    setMessageOrderInfo(this.messages, [tempMessage], this.messages.length);
    this.setMessage(this.messages.concat([tempMessage]));
    this.tempFileMessages = [...this.tempFileMessages, tempMessage];

    return { tempId: tempId };
  };

  deleteTempMessage = ({ messageId }: { messageId: string }) => {
    try {
      delete this.uploadMessageInfo[messageId];
    } catch (e) {}
    this.tempFileMessages = this.tempFileMessages.filter(
      (msg) => msg.tempId !== messageId,
    );
    const filtered = this.messages.filter((msg) => msg.tempId !== messageId);
    this.setMessage(filtered);
    return false;
  };

  createMessage = async (msg: CreateMessageDto, isRetry?: boolean) => {
    const coreStore = this.rootStore.coreStore;
    const retry = isRetry;
    const tempId = msg.tempId || uuid();
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    const tempData = {
      msgBody: msg.msgBody,
      msgId: 0,
      roomId: coreStore?.roomStore.currentRoomId as number,
      personaId: coreStore?.userStore.selectedPersona?.id as number,
      tempId: tempId,
      isDeleted: 0,
      createdAt: moment().format(),
      msgType: msg.msgType,
      rawContent: msg.rawContent ?? '',
    };

    if (retry) {
      this.uploadMessageInfo[tempId].status = 'loading';
    } else {
      if (msg.targetRoomId === coreStore?.roomStore.currentRoomId) {
        const tempMessage = new MessageModel(tempData);
        tempMessage.setTempId(tempId);
        msg.tempId = tempId;
        this.uploadMessageInfo[tempId] = {
          source: source,
          status: 'loading',
          msg,
        };
        setMessageOrderInfo(this.messages, [tempMessage], this.messages.length);
        if (!this.downHasMore)
          this.setMessage(this.messages.concat([tempMessage]));
      }
    }

    try {
      const { status, data } = await this.repo.createMessage(
        msg.targetRoomId,
        msg,
        source.token,
      );
      if (status === 'OK' && data) {
        if (msg.targetRoomId !== coreStore?.roomStore.currentRoomId) return;

        // 소켓으로 이미 받은경우?
        if (this.messages.some((item) => item.msgId === data.msgId)) {
          delete this.uploadMessageInfo[tempId];
          return 'done';
        }

        const message = new MessageModel(data as MessageModel);
        const lastReadMessageIdList = this.lastReadMessageIdMap.get(
          message.roomId,
        );

        // 소켓 받지않아도 내 메세지 언리드 잘계산 되게
        if (message.personaId === this.myId) {
          const target = lastReadMessageIdList?.find(
            (item) => item.personaId === message.personaId,
          );
          if (target && target.lastReadMsgId < message.msgId) {
            if (target) target.lastReadMsgId = message.msgId;
            lastReadMessageIdList?.sort(
              ({ lastReadMsgId: a }, { lastReadMsgId: b }) => b - a,
            );
            this.updateLastReadMessageId({
              roomId: coreStore?.roomStore.currentRoomId,
              msgId: message.msgId,
            });
          }
        }

        this.calculateUnReadCount({ lastReadMessageIdList, message });

        const tempMsgIndex = this.messages.findIndex(
          (ele) => ele.tempId === tempData.tempId,
        );
        if (tempMsgIndex !== -1) this.spliceMessage(tempMsgIndex, 1);

        const index = this.messages.findIndex(
          (ele) => ele.msgId > message.msgId,
        );
        setMessageOrderInfo(
          this.messages,
          [message],
          index === -1 ? this.messages.length : index,
        );

        if (index === -1 && !this.downHasMore) {
          message.setTail(true);
          this.setMessage(this.messages.concat([message]));
        } else {
          this.spliceMessage(index, 1, message);
        }
        message.setTempId('');
        delete this.uploadMessageInfo[tempId];

        return 'success';
      }
      this.uploadMessageInfo[tempId].status = 'fail';
      return false;
    } catch (err) {
      this.uploadMessageInfo[tempId].status = 'fail';
      return false;
    }
  };

  deliverMessage = async (roomId: number, msg: CreateMessageDto) => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    const { status } = await this.repo.createMessage(roomId, msg, source.token);
    if (status === 'OK') {
      return true;
    }
    return false;
  };

  deleteMessage = async ({
    messageIds,
  }: {
    messageIds: number[];
    isMyRoom: boolean;
    personaId: string;
  }) => {
    try {
      const coreStore = this.rootStore.coreStore;
      const roomId = coreStore?.roomStore.currentRoomId as number;
      const { status, data } = await this.repo.deleteMessage({
        messageIds,
        roomId,
        appId: this.rootStore.talkStore.appId,
      });
      if (status === 'OK') {
        data.msgIds.forEach((msgId: number) => {
          const target = this.messages.find(
            (message) => message.msgId === msgId,
          );
          if (target) {
            target.setDeleted(1);
            const roomMetadata = this.roomMetadataMap.get(roomId);
            if (roomMetadata && roomMetadata.lastMessageId === target.msgId) {
              roomMetadata.lastMessage = '삭제된 메시지입니다.';
              if (coreStore?.roomStore.roomMap.has(roomId)) {
                coreStore?.roomStore.updateLastNotification({
                  roomId: roomId,
                  newLastNotification: {
                    date: roomMetadata.lastMessageDate,
                    count: roomMetadata.count,
                  },
                });
                coreStore?.roomStore.updateSubText({
                  roomId: roomId,
                  newSubText: roomMetadata.lastMessage,
                });
              }
            }
            if (target.msgType.includes('file')) {
              const objectList = target.msgBody.files?.map((file) => ({
                objectId: file.id as number,
                objectName: file.name,
                objectExtension: file.extension,
                objectType: 0,
              }));
              const dto: DeleteFileDto = {
                deleted: 1,
                objectList: objectList ?? [],
                roomId: roomId,
              };
            }
          }
        });

        return true;
      }
    } catch (error) {
      return false;
    }
  };

  setSearchKeyword = (keyword: string) => {
    this.searchKeyword = keyword;
  };

  setTotalSearchKeyword = (keyword: string) => {
    this.totalSearchKeyword = keyword;
  };

  getSearchKeyword = () => this.searchKeyword;

  /**
   * 현재 룸의 유저별 마지막으로 읽은 메시지 아이디 가져오는 함수
   */
  getUserLastReadMessageIds = async (
    source?: CancelTokenSource,
  ): Promise<void> => {
    const coreStore = this.rootStore.coreStore;
    let lastReadMessageIdList =
      this.lastReadMessageIdMap.get(
        coreStore?.roomStore.currentRoomId as number,
      ) ?? [];
    if (!lastReadMessageIdList.length) {
      const { status, data } = await this.repo.getLastReadMessageIdList(
        coreStore?.roomStore.currentRoomId as number,
        source,
      );

      if (status !== 'OK') return;

      if (data.length !== this.userList.length) {
        const tempLastReadMessageIdList = this.userList.map((userInfo) => {
          const lastReadMsgId = data.find(
            (item: T.DTO.LastReadMessageId) => item.personaId === userInfo.id,
          )?.lastReadMsgId;
          return {
            roomId: coreStore?.roomStore.currentRoomId,
            personaId: userInfo.id,
            lastReadMsgId: lastReadMsgId ?? 0,
          };
        });
        lastReadMessageIdList = this.lastReadMessageIdMap
          .set(
            coreStore?.roomStore.currentRoomId as number,
            tempLastReadMessageIdList as T.DTO.LastReadMessageId[],
          )
          .get(
            coreStore?.roomStore.currentRoomId as number,
          ) as T.DTO.LastReadMessageId[];
      } else {
        this.lastReadMessageIdMap.set(
          coreStore?.roomStore.currentRoomId as number,
          data,
        );
        lastReadMessageIdList = data;
      }

      // 정렬
      lastReadMessageIdList?.sort(
        ({ lastReadMsgId: a }, { lastReadMsgId: b }) => b - a,
      );
    }
  };

  setPartialUnreadUserCount = async ({
    isFirstLoad,
    downSize,
    upSize,
  }: {
    isFirstLoad: boolean;
    downSize?: number;
    upSize?: number;
  }): Promise<void> => {
    const coreStore = this.rootStore.coreStore;
    // lastReadMessageIdList 없으면 서비스를 통해 불러오고 내림차순 정렬
    const lastReadMessageIdList =
      this.lastReadMessageIdMap.get(
        coreStore?.roomStore.currentRoomId as number,
      ) ?? [];
    if (!this.messages.length) return;

    if (isFirstLoad)
      lastReadMessageIdList?.sort(
        ({ lastReadMsgId: a }, { lastReadMsgId: b }) => b - a,
      );

    // Unread count 를 계산해야할 메시지 리스트 정보
    // 스크롤 시 새롭게 불러온 메시지 리스트만 계산
    let msgInfoList: MessageModel[] = [];
    // 처음 방진입 || 검색 결과로 이동
    if (this.lastLoadedMessageIndex === 0 || (upSize && downSize)) {
      msgInfoList = this.messages;
      this.prevUnreadCount = undefined; //
    } else if (upSize) {
      msgInfoList = this.messages.slice(0, -this.lastLoadedMessageIndex + 1);
    } else if (downSize) {
      msgInfoList = this.messages.slice(
        this.lastLoadedMessageIndex,
        this.messages.length,
      );
      this.prevUnreadCount = undefined;
    }

    // 룸 재진입 시 unread count 다시 계산을 위한 값 초기화 - ???
    if (msgInfoList.length === 0) {
      msgInfoList = this.messages;
      this.prevUnreadCount = undefined;
    }

    this.lastLoadedMessageIndex = this.messages.length;

    if (this.prevUnreadCount === undefined) {
      const readNum = lastReadMessageIdList?.findIndex(
        ({ lastReadMsgId }) =>
          msgInfoList[msgInfoList.length - 1].msgId > lastReadMsgId,
      ) as number;
      this.prevUnreadCount =
        readNum === -1
          ? 0
          : (lastReadMessageIdList?.length as number) - readNum;
    }

    for (let i = msgInfoList.length - 1; i >= 0; i -= 1) {
      const msgInfo = msgInfoList[i];
      const targetMsgId = msgInfo.msgId;
      if (this.prevUnreadCount !== 0) {
        for (
          ;
          lastReadMessageIdList[
            lastReadMessageIdList.length - this.prevUnreadCount
          ].lastReadMsgId >= targetMsgId;
          this.prevUnreadCount--
        ) {
          if (this.prevUnreadCount === 1) {
            this.prevUnreadCount = 0;
            break;
          }
        }
        msgInfo.setUnReadCount(this.prevUnreadCount);
      }
    }
  };

  updateLastReadMessageId = async ({
    roomId,
    msgId,
  }: {
    roomId: number;
    msgId: number;
  }) => {
    const { data } = await this.repo.updateLastReadMessageId({
      roomId,
      msgId,
      appId: this.rootStore.talkStore.appId,
    });
    return data;
  };

  /**
   * keyword로 검색된 메시지들의 Id 리스트를 가져오는 함수
   * @param {number} roomId 현재 룸 아이디
   * @param {string} keyword 검색하고자 하는 string
   * @returns {number[]} msgId list 반환
   */
  getSearchMessagesIds = async ({
    roomId,
    keyword,
  }: {
    roomId: number;
    keyword: string;
  }) => {
    const currentRoom = this.rootStore.coreStore?.roomStore.getRoomById(
      roomId,
    ) as RoomModel;

    const useRoomEnter = getRoomType(currentRoom).isDm
      ? this.rootStore.configStore.DmRoomEnter
      : this.rootStore.configStore.RoomEnter;

    const { status, data } = await this.repo.getSearchMessageIds({
      roomId,
      keyword,
      ...(useRoomEnter && { roomEnterTime: currentRoom?.myInfo?.joinDate }),
    });

    if (status === 'OK') {
      return data.msgIds;
    }
  };

  get isInit(): boolean {
    return this.state === 'init';
  }

  setSearchResultIds(result: number[]) {
    this.searchResultIds = result;
  }

  setSearchIndex(index: number) {
    this.searchIndex = index;
  }

  increaseSearchIndex() {
    if (this.searchIndex === this.searchResultIds.length - 1) {
      this.setSearchIndex(0);
    } else {
      const prevIndex = this.searchIndex;
      this.setSearchIndex(prevIndex + 1);
    }
  }

  decreaseSearchIndex() {
    if (this.searchIndex === 0) {
      this.setSearchIndex(this.searchResultIds.length - 1);
    } else {
      const prevIndex = this.searchIndex;
      this.setSearchIndex(prevIndex - 1);
    }
  }

  setFirstItemIndex(firstItemIndex: number): void {
    this.firstItemIndex = firstItemIndex;
  }

  setVirtuosoRef(virtuosoRef: VirtuosoHandle | null): void {
    if (virtuosoRef) {
      this.virtuosoRef = virtuosoRef;
    }
  }

  setIsScrollBottom(isScrollBottom: boolean): void {
    this.isScrollBottom = isScrollBottom;
  }

  setIsScrolling(isScrolling: boolean): void {
    this.isScrolling = isScrolling;
  }

  scrollToBottom = async (behavior: 'smooth' | 'auto') => {
    if (this.downHasMore) {
      this.prevUnreadCount = undefined;
      await this.getMessages({
        isFirstLoad: true,
        upSize: MESSAGE_SIZE,
        downSize: MESSAGE_SIZE,
      });
      // await
      // SAS 작업 필요: 백엔드 요청으로 서비스 호출 임시 주석 처리
      // this.updateLastReadMessageId({
      //   roomId: coreStore.roomStore.currentRoomId as number,
      //   readMsgType: 'focus-in',
      // });
    } else {
      await new Promise((resolve) =>
        setTimeout(() => {
          if (this.virtuosoRef) {
            this.virtuosoRef.scrollToIndex({
              index: 'LAST',
              align: 'end',
              behavior,
            });
          }
          resolve(true);
        }, 100),
      );
    }
  };

  setTargetId(id: number) {
    this.targetId = id;
  }

  scrollToIndex(
    index: number,
    behavior: 'smooth' | 'auto',
    align: 'start' | 'center' | 'end' = 'center',
  ): void {
    if (this.virtuosoRef) {
      this.virtuosoRef.scrollToIndex({ index, align, behavior });
    }
  }

  scrollToTargetMessageId = async (
    targetMsgId: T.MessageId,
    align: 'start' | 'center' | 'end' = 'center',
    roomEnterTime?: string,
  ) => {
    let targetMsgIndex = -1;
    let upperCnt = 0;
    let lowerCnt = 0;
    this.messages.map((message, index) => {
      if (message.msgId === targetMsgId) targetMsgIndex = index;
      if (message.msgId > targetMsgId) lowerCnt++;
      else if (message.msgId < targetMsgId) upperCnt++;
    });
    if (targetMsgIndex !== -1) {
      if (
        (upperCnt >= 10 && lowerCnt >= 10) ||
        (this.downHasMore === false && lowerCnt < 10) ||
        (this.upHasMore === false && upperCnt < 10) ||
        (this.downHasMore === false && this.upHasMore === false)
      ) {
        setTimeout(() => {
          this.scrollToIndex(targetMsgIndex, 'auto', align);
        }, 100);
      } else if (this.downHasMore === true && lowerCnt < 10) {
        const targetId = this.messages[this.messages.length - 1].msgId;
        await this.getMessages({
          targetId,
          downSize: 20,
          roomEnterTime,
        });
        this.scrollToTargetMessageId(targetMsgId, align, roomEnterTime);
        return;
      } else if (this.upHasMore === true && upperCnt < 10) {
        const targetId = this.messages[0].msgId;
        await this.getMessages({
          targetId,
          upSize: 20,
          roomEnterTime,
        });
        this.scrollToTargetMessageId(targetMsgId, align, roomEnterTime);
        return;
      }
    } else {
      // 로컬에 찾고자 하는 메시지가 없거나 있더라도 위 아래로 10개 이상의 메시지가 없을 경우
      this.setState('init');
      await this.getMessages({
        targetId: targetMsgId,
        upSize: MESSAGE_SIZE,
        downSize: MESSAGE_SIZE,
        roomEnterTime,
      });
    }
  };

  /**
   * 모든 채팅룸 마지막 메세지, 안 읽은 수 조회
   *
   * @param roomIdList number[]
   * @returns roomStore의 룸리스트 정보 업데이트
   *
   */
  fetchLastMessage = async ({
    roomInfos,
    activePaging,
    page,
    size,
  }: {
    roomInfos: RoomInfo[];
    activePaging?: boolean;
    page?: number;
    size?: number;
  }) => {
    const coreStore = this.rootStore.coreStore;
    const { status, data } = await this.repo.fetchLastMessage({
      roomInfos,
      activePaging,
      page,
      size,
    });
    const { roomInfos: withRoomUnread } = data;
    if (status === 'OK') {
      // 자동메세지 필터링
      const filtered = withRoomUnread.filter(
        (item: T.DTO.RoomLastMessage) =>
          item.personaId || Number(item.msgType) === 512,
      );
      // const idList = filtered.map(
      //   (item: T.DTO.RoomLastMessage) => item.personaId,
      // );
      // await coreStore.personaStore.fetchPersonaList({ personaIdList: idList });
      filtered.map(async (item: T.DTO.RoomLastMessage) => {
        // SAS 작업 필요: isBlocked를 PersonaModel이 아닌, 연락처를 통해 확인
        // const isBlockedMessage = coreStore.personaStore.getPersona(
        //   item.userId,
        // )?.isBlocked;
        const content = await parseContentRoomMessage(
          item.msgBody,
          item.msgType,
          item.isDeleted,
          // SAS 작업 필요: isBlocked를 PersonaModel이 아닌, 연락처를 통해 확인
          // isBlockedMessage,
        );

        const lastMessageDate = timeStampFormat(
          item.createdAt,
          'YYYY-MM-DD HH:mm:ss',
        );
        const roomMetadata = {
          lastMessage: content,
          lastMessageDate: new Date(lastMessageDate),
          lastMessageId: item.msgId,
          count: item.count ? item.count : 0,
        };
        controller
          .get({ storeName: this.roomMetaStoreName, keyOptions: item.roomId })
          .then((getRes: any) => {
            if (getRes.result) {
              if (getRes.result.room_meta.lastMessageId == item.msgId)
                controller.put({
                  storeName: this.roomMetaStoreName,
                  keyOptions: item.roomId,
                  value: { room_meta: roomMetadata },
                });
            } else
              controller.add({
                storeName: this.roomMetaStoreName,
                value: { room_id: item.roomId, room_meta: roomMetadata },
                version: this.roomMetaVersion,
              });
          });

        this.roomMetadataMap.set(item.roomId, roomMetadata);
        if (coreStore?.roomStore.roomMap.has(item.roomId)) {
          coreStore?.roomStore.updateLastNotification({
            roomId: item.roomId,
            newLastNotification: {
              date: new Date(roomMetadata.lastMessageDate),
              count: roomMetadata.count,
            },
          });
          coreStore?.roomStore.updateSubText({
            roomId: item.roomId,
            newSubText: unescapeHtml(roomMetadata.lastMessage),
          });
        }
      });
      return withRoomUnread;
    }
  };

  searchTotalMessages = async ({
    keyword,
    size,
    lastRoomId,
    lastMsgId,
    roomInfos,
    startedAt,
    endAt,
  }: {
    keyword: string;
    size: number;
    lastRoomId?: number;
    lastMsgId?: number;
    roomInfos: RoomInfo[];
    startedAt?: string;
    endAt?: string;
  }) => {
    try {
      const { status, data } = await this.repo.searchTotalMessages({
        keyword,
        size,
        lastRoomId,
        lastMsgId,
        roomInfos,
        startedAt,
        endAt,
      });
      if (status === 'OK') {
        const hasMore = data.hasMore as boolean;
        const messageList = data.messages.map(
          (message: MessageModel) => new MessageModel(message),
        ) as MessageModel[];
        return { hasMore, messageList };
      }
    } catch (error) {
      console.log(error);
    }
  };

  searchRoomName = async ({ keyword }: { keyword: string }) => {
    try {
      const { status, data } = await this.repo.searchRoomName({
        keyword,
      });
      if (status === 'OK') {
        const { generalRoomInfoList } = data;
        return { generalRoomInfoList };
      }
    } catch (error) {
      console.log(error);
    }
    return null;
  };

  getMessageTargetDay = async () => {
    const { status, data } = await this.repo.getMessageTargetDay();

    if (status === 'OK') {
      this.messageTargetDay = data?.targetDay;
    }
  };

  handleUpdateMessageTargetDay = (jsonMessage: T.SocketMessage) => {
    this.messageTargetDay = jsonMessage.targetDay;
  };

  clearUploadMessageInfo = (roomId: number) => {
    for (const [key, value] of Object.entries(this.uploadMessageInfo)) {
      try {
        if (value.msg.targetRoomId === roomId)
          delete this.uploadMessageInfo[key];
      } catch (e) {}
    }
  };

  deleteRoomMeta = (roomId: number) => {
    this.roomMetadataMap.delete(roomId);
  };

  handleDeleteLink = (jsonMessage: T.SocketMessage) => {
    this.rootStore.linkStore.handleDeleteLink(jsonMessage);
  };

  handleDeleteLinkMsg = (jsonMessage: T.SocketMessage) => {
    this.rootStore.linkStore.handleDeleteLinkMsg(jsonMessage);
  };

  calculateUnReadCount = ({
    lastReadMessageIdList,
    message,
  }: {
    lastReadMessageIdList: T.DTO.LastReadMessageId[] | undefined;
    message: MessageModel;
  }) => {
    const readNum = lastReadMessageIdList?.findIndex(
      ({ lastReadMsgId }) => message.msgId > lastReadMsgId,
    ) as number;
    const unReadCount =
      readNum === -1 ? 0 : (lastReadMessageIdList?.length as number) - readNum;
    message.setUnReadCount(unReadCount);
  };

  getUnReadAllExcept({ excepts }: { excepts: T.RoomId[] }) {
    let sum = 0;
    const visibleRoomList = this.rootStore.coreStore?.roomStore.roomList
      .filter((room) => room.isVisible)
      .filter((room) => !excepts.includes(room.id));
    visibleRoomList?.forEach((room) => {
      const roomMeta = this.roomMetadataMap.get(room.id);
      if (roomMeta) sum += roomMeta.count;
    });
    return sum;
  }
}
