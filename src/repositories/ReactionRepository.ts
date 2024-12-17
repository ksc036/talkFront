import { WsAPI } from '@wapl/core';

import { servicePath } from './API';

export class ReactionRepository {
  createReaction = async ({
    roomId,
    targetType,
    targetId,
    reactionName,
    appId,
  }: {
    roomId: number;
    targetType: string;
    targetId: number;
    reactionName: string;
    appId: string;
  }) => {
    // const requestBody = {
    //   targetType,
    //   targetId,
    //   reactionName,
    // };
    // try {
    //   const res = await API.post(
    //     `${urlPath()}/rooms/${roomId}/reactions`,
    //     requestBody,
    //   );
    //   return res;
    // } catch (error) {
    //   console.log(error);
    //   throw error;
    // }

    const serviceName = servicePath('reaction', 'CreateReaction');
    const requestBody = {
      roomId,
      targetType,
      targetId,
      reactionName,
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

  deleteReaction = async ({
    roomId,
    reactionId,
    appId,
  }: {
    roomId: number;
    reactionId: number;
    appId: string;
  }) => {
    // try {
    //   const res = await API.delete(
    //     `${urlPath()}/rooms/${roomId}/reactions/${reactionId}`,
    //   );
    //   return res;
    // } catch (error) {
    //   console.log(error);
    //   throw error;
    // }

    const serviceName = servicePath('reaction', 'DeleteReaction');
    const requestBody = {
      roomId,
      reactionId,
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
}

export const ReactionRepoImpl = new ReactionRepository();
