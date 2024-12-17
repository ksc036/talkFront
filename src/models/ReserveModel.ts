import * as T from '@/@types';

export interface ReserveInterface {
  reservationId: number;
  roomId: number;
  reserveType: T.MessageType[];
  msgBody: {
    content: string;
  };
  rawContent: string;
  personaId: number;
  appId: string;
  status: string;
  reservedAt: string;
  createdAt: string;
  updatedAt: string;
  alarmedAt: string;
}

export class ReserveModel implements ReserveInterface {
  reservationId: number;
  roomId: number;
  reserveType: T.MessageType[];
  msgBody: { content: string };
  rawContent: string;
  personaId: number;
  appId: string;
  status: string;
  reservedAt: string;
  createdAt: string;
  updatedAt: string;
  alarmedAt: string;

  constructor(reserve: ReserveInterface) {
    this.reservationId = reserve.reservationId;
    this.roomId = reserve.roomId;
    this.reserveType = reserve.reserveType;
    this.msgBody = reserve.msgBody;
    this.rawContent = reserve.rawContent;
    this.personaId = reserve.personaId;
    this.appId = reserve.appId;
    this.status = reserve.status;
    this.reservedAt = reserve.reservedAt;
    this.createdAt = reserve.createdAt;
    this.updatedAt = reserve.updatedAt;
    this.alarmedAt = reserve.alarmedAt;

    for (const [key, value] of Object.entries(T.msgType)) {
      if (value & Number(reserve.reserveType))
        this.reserveType.push(key as T.MessageType);
    }
  }
}
