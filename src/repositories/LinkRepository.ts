import { WsAPI } from '@wapl/core';

import { servicePath } from './API';

export class LinkRepository {
  getLinks = async ({
    targetId,
    msgId,
    downSize,
    keyword,
    roomEnterTime,
    roomId,
  }: {
    targetId?: number;
    msgId?: number;
    downSize?: number;
    keyword?: string;
    roomEnterTime?: string;
    roomId: number;
  }) => {
    // let path = `${urlPath()}/rooms/${roomId}/messages-link`;
    // if (targetId && msgId) path += `?targetId=${targetId}&msgId=${msgId}`;
    // if (downSize) {
    //   if (msgId) path += `&downSize=${downSize}`;
    //   else path += `?downSize=${downSize}`;
    // }
    // if (keyword) {
    //   if (msgId || downSize) path += `&keyword=${keyword}`;
    //   else path += `?keyword=${keyword}`;
    // }
    // if (roomEnterTime) {
    //   if (msgId || downSize || keyword)
    //     path += `&roomEnterTime=${roomEnterTime}`;
    //   else path += `?roomEnterTime=${roomEnterTime}`;
    // }
    // const res = await API.get(path);
    // return res;

    const serviceName = servicePath('link', 'GetLinks');
    const requestBody = {
      roomId,
      roomEnterTime,
      downSize,
      keyword,
      targetId,
      msgId,
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

  deleteLinks = async ({
    appId,
    roomId,
    linkIds,
  }: {
    appId: string;
    roomId: number;
    linkIds: number[];
  }) => {
    // const admin = isAdmin ? '/admin' : '';
    // const path = `${urlPath()}${admin}/rooms/${roomId}/messages-link/${msgId}/links/${linkId}`;
    // const res = await API.delete(path);
    // return res;
    const serviceName = servicePath('link', 'DeleteLinks');
    const requestBody = {
      appId,
      roomId,
      linkIds,
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

export const LinkRepoImpl = new LinkRepository();
