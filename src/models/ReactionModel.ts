import { action, computed, makeObservable, observable } from 'mobx';

import * as T from '@types';

export type TargetType = {
  personaId: T.PersonaId;
  reactionId: T.ReactionId;
};

export interface ReactionInterface {
  reactionName: string;
  targets: TargetType[];
}

export interface ReactionJsonInterface {
  reactionName: string;
  targetId: number;
  reactionId: number;
  targetType: string;
  personaId: number;
  roomId: number;
}

export class ReactionModel implements ReactionInterface {
  reactionName: string;
  targets: TargetType[];

  constructor(reaction: ReactionInterface) {
    this.reactionName = reaction.reactionName;
    this.targets = reaction.targets;

    makeObservable(this, {
      targets: observable,

      count: computed,

      addPersonaId: action.bound,
      removePersonaId: action.bound,
    });
  }

  hasPersonaId(personaId: T.PersonaId) {
    return this.targets.some((target) => target.personaId === personaId);
  }

  getReactionId(personaId: T.PersonaId) {
    return this.targets.find((target) => target.personaId === personaId)
      ?.reactionId;
  }

  addPersonaId(personaId: T.PersonaId, reactionId: T.ReactionId) {
    this.targets = this.targets.concat({ personaId, reactionId });
  }

  removePersonaId(personaId: T.PersonaId) {
    this.targets = this.targets.filter(
      (target) => target.personaId !== personaId,
    );
  }

  get count() {
    return this.targets.length;
  }
}
