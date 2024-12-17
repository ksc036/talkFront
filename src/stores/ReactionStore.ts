import { makeAutoObservable, values } from 'mobx';

import { Reaction } from '@/assets/emoticons';
import { ReactionRepository, ReactionRepoImpl } from '@/repositories';
import * as T from '@types';

import { ReactionInterface, ReactionModel } from './../models/ReactionModel';
import { RootStore } from './RootStore';

type EmojiMap = Map<T.EmoticonKey, ReactionModel>;

/*
  reactionMap = Map<MessageId, Map<EmoticonKey, {reactionName, targets:[{userId, reactionId}]}>>
*/
/* 
  reactionMap = Map<MessageId, Map<EmojiKey, Map<UserId, reactionId>>>
*/

export class ReactionStore {
  reactionMap: Map<T.MessageId, EmojiMap> = new Map();
  reactions = Reaction;
  repo: ReactionRepository = ReactionRepoImpl;
  rootStore: RootStore;
  _targetMessageId: T.MessageId = -1;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  initialize() {
    this.rootStore.talkStore?.addHandler('CREATE_REACTION', (jsonMessage) => {
      this.addReaction(jsonMessage as T.ReactionMessage);
    });
    this.rootStore.talkStore?.addHandler('DELETE_REACTION', (jsonMessage) => {
      this.removeReaction(jsonMessage as T.ReactionMessage);
    });
  }

  get targetMessageId() {
    return this._targetMessageId;
  }
  setTargetMessageId(targetMessageId: T.MessageId) {
    this._targetMessageId = targetMessageId;
  }

  setReactionMap = (
    messageId: T.MessageId,
    reactions: ReactionInterface[],
  ): void => {
    reactions.forEach(({ reactionName, targets }) => {
      if (!this.reactionMap.has(messageId)) {
        this.reactionMap.set(messageId, new Map());
      }
      const emojiMap = this.reactionMap.get(messageId);
      if (emojiMap && !emojiMap.has(reactionName)) {
        emojiMap.set(
          reactionName,
          new ReactionModel({ reactionName, targets }),
        );
      }
    });
  };

  clear = () => {
    this.reactionMap.clear();
  };

  getAllReactions = (messgeId: T.MessageId) => {
    if (this.reactionMap.has(messgeId)) {
      return values(this.reactionMap.get(messgeId)) as ReactionModel[];
    }
    return [];
  };

  hasMyReaction = (
    myId: T.PersonaId,
    messageId: T.MessageId,
    emojiKey: T.EmoticonKey,
  ) => {
    const emojiMap = this.reactionMap.get(messageId);
    if (emojiMap?.get(emojiKey)?.hasPersonaId(myId)) {
      return true;
    }
    return false;
  };

  getReactionId = (
    myId: T.PersonaId,
    messageId: T.MessageId,
    emojiKey: T.EmoticonKey,
  ) => {
    const emojiMap = this.reactionMap.get(messageId);
    return emojiMap?.get(emojiKey)?.getReactionId(myId);
  };

  addReaction = (jsonMessage: T.ReactionMessage) => {
    if (
      jsonMessage.roomId !== this.rootStore.coreStore?.roomStore.currentRoomId
    )
      return;
    if (jsonMessage.targetType !== 'message') return;
    if (!this.reactionMap.has(jsonMessage.targetId)) {
      this.reactionMap.set(jsonMessage.targetId, new Map());
    }
    if (this.rootStore.messageStore.isScrollBottom) {
      this.rootStore.messageStore.scrollToBottom('auto');
    }
    const emojiMap = this.reactionMap.get(jsonMessage.targetId);
    if (emojiMap) {
      if (emojiMap.has(jsonMessage.reactionName)) {
        const reactionModel = emojiMap.get(jsonMessage.reactionName);
        if (
          reactionModel?.targets.find(
            (target) => target.reactionId === jsonMessage.reactionId,
          )
        )
          return;
        reactionModel?.addPersonaId(
          jsonMessage.personaId,
          jsonMessage.reactionId,
        );
      } else {
        emojiMap.set(
          jsonMessage.reactionName,
          new ReactionModel({
            reactionName: jsonMessage.reactionName,
            targets: [
              {
                personaId: jsonMessage.personaId,
                reactionId: jsonMessage.reactionId,
              },
            ],
          }),
        );
      }
    }
  };
  removeReaction = (jsonMessage: T.ReactionMessage) => {
    if (
      jsonMessage.roomId !== this.rootStore.coreStore?.roomStore.currentRoomId
    )
      return;
    const emojiMap = this.reactionMap.get(jsonMessage.targetId);
    if (emojiMap) {
      if (emojiMap.has(jsonMessage.reactionName)) {
        const reactionModel = emojiMap.get(jsonMessage.reactionName);
        reactionModel?.removePersonaId(jsonMessage.personaId);
        if (reactionModel?.count === 0) {
          emojiMap.delete(jsonMessage.reactionName);
        }
      }
    }
  };

  createReaction = async ({
    targetType,
    targetId,
    reactionName,
    roomId,
  }: {
    targetType: string;
    targetId: number;
    reactionName: string;
    roomId: number;
  }) => {
    const {
      status,
      // data
    } = await this.repo.createReaction({
      roomId,
      targetType,
      targetId,
      reactionName,
      appId: this.rootStore.talkStore.appId,
    });
    if (status === 'OK') {
      return true;
    }
    return false;
  };

  deleteReaction = async ({
    reactionId,
    roomId,
  }: {
    reactionId: number;
    roomId: number;
  }) => {
    const {
      status,
      // data
    } = await this.repo.deleteReaction({
      roomId,
      reactionId,
      appId: this.rootStore.talkStore.appId,
    });
    if (status === 'OK') {
      return true;
    }
    return false;
  };
}
