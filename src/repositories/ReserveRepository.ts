import { WsAPI } from '@wapl/core';

import { servicePath } from './API';

export class ReserveRepository {
  createReserve = async ({
    roomId,
    msgBody,
    reservedAt,
    msgType,
    rawContent,
    appId,
    personaId,
    alarmedAt,
  }: {
    roomId: number;
    msgBody: { content: string };
    reservedAt: string;
    msgType: number;
    rawContent: string;
    appId: string;
    personaId: number;
    alarmedAt: string | null;
  }) => {
    const serviceName = servicePath('reservation', 'CreateReservationMessage');
    const requestBody = {
      roomId,
      msgBody,
      reservedAt,
      msgType,
      rawContent,
      appId,
      personaId,
      alarmedAt,
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

  updateReserve = async ({
    roomId,
    msgBody,
    reservedAt,
    msgType,
    rawContent,
    appId,
    reservationId,
    alarmedAt,
  }: {
    roomId: number;
    msgBody: { content: string };
    reservedAt: string;
    msgType: number;
    rawContent: string;
    appId: string;
    reservationId: number;
    alarmedAt: string | null;
  }) => {
    const serviceName = servicePath('reservation', 'UpdateReservationMessage');
    const requestBody = {
      roomId,
      msgBody,
      reservedAt,
      msgType,
      rawContent,
      appId,
      reservationId,
      alarmedAt,
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

  getReserve = async (reservationId: number) => {
    const serviceName = servicePath('reservation', 'GetReservationMessage');
    const requestBody = {
      reservationId,
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

  getReserves = async ({
    reserveStatus,
    size,
    offset,
  }: {
    reserveStatus: string;
    size: number;
    offset: number;
  }) => {
    const serviceName = servicePath('reservation', 'GetReservationMessageList');
    const requestBody = {
      status: reserveStatus,
      size,
      offset,
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

  deleteReserve = async (reservationId: number) => {
    const serviceName = servicePath('reservation', 'DeleteReservationMessage');
    const requestBody = {
      reservationId,
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

export const ReserveRepoImpl = new ReserveRepository();
