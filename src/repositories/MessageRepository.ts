import { WsAPI } from '@wapl/core';
import { CancelToken, CancelTokenSource } from 'axios';

import { RoomInfo } from '@/@types/DTO';
import {
  CreateMessageDto,
  SearchRoomNameReqDto,
  SearchRoomNameResDto,
} from '@/dto';

import { roomServicePath, servicePath } from './API';

export class MessageRepo {
  /**
   * 메시지 리스트 조회 및 메시지 검색 시 사용되는 함수.
   * @param {number} lastMessageId 현재 가지고 있는 메시지 id 중 가장 위에 값 (가장 작은 값)
   * @param {number} size 가지고 올 메시지 개수
   * @param {number} topId 검색하고자 하는 타겟 id 값 (검색 시 사용)
   * @param {number} sizeForTopId topId 위로 몇 개의 메시지를 더 가져올 지 선택하는 값 (검색 시(topId 사용시) 함께 사용 가능)
   * @param {number} roomId 현재 room Id
   * @returns {} status, data 반환
   */
  getMessages = async ({
    roomId,
    targetId,
    upSize,
    downSize,
    roomEnterTime,
    source,
  }: {
    roomId: number;
    targetId?: number;
    upSize?: number;
    downSize?: number;
    roomEnterTime?: string;
    source?: CancelTokenSource;
  }) => {
    const serviceName = servicePath('message', 'GetMessages');
    const requestBody = {
      upSize: upSize,
      downSize: downSize,
      roomId: roomId,
      targetId: targetId,
      roomEnterTime,
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

  getDateMessageIds = async ({
    roomId,
    year,
    month,
    roomEnterTime,
  }: {
    roomId: number;
    year: string;
    month: string;
    roomEnterTime?: string;
  }) => {
    const serviceName = servicePath('message', 'GetDateSelectMessages');
    const requestBody = {
      roomId: roomId,
      year: year,
      month: month,
      roomEnterTime: roomEnterTime,
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

  createMessage = async (
    roomId: number,
    dto: CreateMessageDto,
    cancelToken: CancelToken,
  ) => {
    // try {
    //   const res = await API.post(`${urlPath()}/rooms/${roomId}/messages`, dto, {
    //     cancelToken: cancelToken,
    //   });
    //   return res;
    // } catch (error) {
    //   console.log(error);
    //   throw error;
    // }

    const serviceName = servicePath('message', 'CreateMessage');
    const requestBody = {
      roomId: roomId,
      ...dto,
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

  deleteMessage = async ({
    messageIds,
    roomId,
    appId,
  }: {
    messageIds: number[];
    roomId: number;
    appId: string;
  }) => {
    // try {
    //   const res = await API.delete(`${urlPath()}/rooms/${roomId}/messages`, {
    //     data: {
    //       msgIds: messageIds,
    //     },
    //   });
    //   return res;
    // } catch (error) {
    //   console.log(error);
    //   throw error;
    // }

    const serviceName = servicePath('message', 'DeleteMessage');
    const requestBody = {
      roomId: roomId,
      msgIds: messageIds,
      appId: appId,
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

  getLastReadMessageIdList = async (
    roomId: number,
    source?: CancelTokenSource,
  ) => {
    const serviceName = servicePath('message', 'GetLastReadMessageInRoom');
    const requestBody = {
      roomId: roomId,
    };

    try {
      const res = await WsAPI.send(serviceName, requestBody);
      return {
        status: res?.header.statusCode,
        data: res?.body.items,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  updateLastReadMessageId = async ({
    roomId,
    msgId,
    appId,
  }: {
    roomId: number;
    msgId: number;
    appId: string;
  }) => {
    const serviceName = servicePath('message', 'ReadMessage');
    const requestBody = {
      roomId: roomId,
      msgId: msgId,
      appId: appId,
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

  getSearchMessageIds = async ({
    roomId,
    keyword,
    roomEnterTime,
  }: {
    roomId: number;
    keyword: string;
    roomEnterTime?: string;
  }) => {
    const serviceName = servicePath('message', 'SearchMessage');
    const res = await WsAPI.send(serviceName, {
      roomId,
      keyword,
      roomEnterTime,
    });
    return { status: res?.header.statusCode, data: res?.body };
  };

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
    const requestBody = {
      roomInfos: roomInfos,
      activePaging: activePaging,
      page: page,
      size: size,
    };
    const serviceName = servicePath('message', 'GetLastMessagesAllRoom');
    const res = await WsAPI.send(serviceName, requestBody);
    return { status: res?.header.statusCode, data: res?.body };
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
    const requestBody = {
      keyword: keyword,
      size: size,
      lastRoomId: lastRoomId,
      lastMsgId: lastMsgId,
      roomInfos: roomInfos,
      startedAt: startedAt,
      endAt: endAt,
    };
    const serviceName = servicePath('message', 'SearchMessagesInAllRoom');
    const res = await WsAPI.send(serviceName, requestBody);
    return {
      status: res.header.statusCode,
      data: res.body,
    };
  };

  searchRoomName = async (req: SearchRoomNameReqDto) => {
    const serviceName = roomServicePath('room', 'RoomNameSearchService');
    const res = await WsAPI.send<SearchRoomNameResDto>(serviceName, req);
    return {
      status: res.header.statusCode,
      data: res.body,
    };
  };

  getMessageTargetDay = async () => {
    const serviceName = servicePath('message', 'GetPersonalTalkTargetDay');
    const res = await WsAPI.send(serviceName, {});
    return {
      status: res.header.statusCode,
      data: res.body,
    };
  };
}

export const MessageRepoImpl = new MessageRepo();
