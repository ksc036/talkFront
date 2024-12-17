import { WsAPI } from '@wapl/core';

import { VoteRequestDTO } from '@/@types/VoteDTO';
import { rootStore } from '@/stores';

import { servicePath } from './API';

export class VoteRepository {
  getVotes = async ({
    roomId,
    lastVoteId,
    size,
  }: {
    roomId: number;
    lastVoteId?: number;
    size: number;
  }) => {
    const serviceName = servicePath('vote', 'GetOpenVotesWithLimit');
    const requestBody = {
      roomId,
      isOpen: 'open',
      lastVoteId: lastVoteId,
      size: size,
    };

    try {
      const res = await WsAPI.send(serviceName, requestBody);
      return {
        status: res?.header.statusCode,
        data: res?.body,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  getClosedVotes = async ({
    roomId,
    lastVoteId,
    size,
  }: {
    roomId: number;
    lastVoteId?: number;
    size: number;
  }) => {
    const serviceName = servicePath('vote', 'GetClosedVotesWithLimit');
    const requestBody = {
      roomId,
      isOpen: 'closed',
      lastVoteId: lastVoteId,
      size: size,
    };

    try {
      const res = await WsAPI.send(serviceName, requestBody);
      return {
        status: res?.header.statusCode,
        data: res?.body,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  getVote = async ({ roomId, voteId }: { roomId: number; voteId: number }) => {
    const serviceName = servicePath('vote', 'GetVote');
    const requestBody = {
      roomId,
      voteId: voteId,
    };

    try {
      const res = await WsAPI.send(serviceName, requestBody);
      return {
        status: res?.header.statusCode,
        data: res?.body,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  createVote = async ({
    roomId,
    voteDTO,
    appId,
  }: {
    roomId: number;
    voteDTO: VoteRequestDTO;
    appId: string;
  }) => {
    const personaId = rootStore.coreStore?.userStore.user?.id;
    const serviceName = servicePath('vote', 'CreateVote');
    const requestBody = {
      ...{ roomId, personaId },
      ...voteDTO,
      appId,
    };

    try {
      const res = await WsAPI.send(serviceName, requestBody);
      return {
        status: res?.header.statusCode,
        data: res?.body,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  deleteVote = async ({
    roomId,
    voteId,
    appId,
    nick,
  }: {
    roomId: number;
    voteId: number;
    voteDTO: VoteRequestDTO;
    appId: string;
    nick: string;
  }) => {
    const serviceName = servicePath('vote', 'DeleteVote');
    const requestBody = {
      roomId,
      voteId,
      appId,
      nick: nick,
      roomName: rootStore.coreStore?.roomStore.getRoomById(roomId)?.name,
    };

    try {
      const res = await WsAPI.send(serviceName, requestBody);
      return {
        status: res?.header.statusCode,
        data: res?.body,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  editVote = async ({
    roomId,
    voteId,
    voteDTO,
    appId,
  }: {
    roomId: number;
    voteId: number;
    voteDTO: VoteRequestDTO;
    appId: string;
  }) => {
    const serviceName = servicePath('vote', 'UpdateVote');
    const requestBody = {
      ...{ roomId, voteId, appId },
      ...voteDTO,
    };

    try {
      const res = await WsAPI.send(serviceName, requestBody);
      return {
        status: res?.header.statusCode,
        data: res?.body,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  vote = async ({
    roomId,
    voteId,
    voteRequestDTO,
  }: {
    roomId: number;
    voteId: number;
    voteRequestDTO: VoteRequestDTO;
  }) => {
    const serviceName = servicePath('vote', 'DoVote');
    const requestBody = {
      roomId,
      voteId,
      ...voteRequestDTO,
    };

    try {
      const res = await WsAPI.send(serviceName, requestBody);
      return {
        status: res?.header.statusCode,
        data: res?.body,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  closeVote = async ({
    roomId,
    voteId,
    appId,
    nick,
  }: {
    roomId: number;
    voteId: number;
    voteDTO: VoteRequestDTO;
    appId: string;
    nick: string;
  }) => {
    const serviceName = servicePath('vote', 'EndVote');
    ('wapl-talk/service.vote.EndVote');
    const requestBody = {
      roomId,
      voteId,
      appId,
      nick: nick,
      roomName: rootStore.coreStore?.roomStore.getRoomById(roomId)?.name,
    };

    try {
      const res = await WsAPI.send(serviceName, requestBody);
      return {
        status: res?.header.statusCode,
        data: res?.body,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  getTotalVotesCount = async ({
    roomId,
    isOpen,
  }: {
    roomId: number;
    isOpen: string;
  }) => {
    const serviceName = servicePath(
      'vote',
      isOpen === 'open' ? 'GetTotalOpenVotesCount' : 'GetTotalClosedVotesCount',
    );
    const requestBody = {
      roomId,
      isOpen,
    };
    try {
      const res = await WsAPI.send(serviceName, requestBody);
      return {
        status: res?.header.statusCode,
        data: res?.body,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
}

export const VoteRepoImpl = new VoteRepository();
