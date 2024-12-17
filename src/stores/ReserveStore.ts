import { makeAutoObservable } from 'mobx';

import { DTO } from '@/@types';
import { ReserveInterface, ReserveModel } from '@/models/ReserveModel';
import {
  ReserveRepoImpl,
  ReserveRepository,
} from '@/repositories/ReserveRepository';

import { RootStore } from './RootStore';

export class ReserveStore {
  __entryPoint: 'LNB' | 'Footer' = 'LNB';
  __currentReserveId = -1;
  __currentReserve: ReserveModel | null = null;
  repo: ReserveRepository = ReserveRepoImpl;
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

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
    msgBody: DTO.ReserveCreateDto;
    reservedAt: string;
    msgType: number;
    rawContent: string;
    appId: string;
    personaId: number;
    alarmedAt: string | null;
  }) => {
    const { status, data } = await this.repo.createReserve({
      roomId,
      msgBody,
      reservedAt,
      msgType,
      rawContent,
      appId,
      personaId,
      alarmedAt,
    });
    if (status === 'OK') {
      this.setCurrentReserveId(data.reservationId);
      return true;
    }
    this.setCurrentReserveId(-1);
    return false;
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
    msgBody: DTO.ReserveCreateDto;
    reservedAt: string;
    msgType: number;
    rawContent: string;
    appId: string;
    reservationId: number;
    alarmedAt: string | null;
  }) => {
    const { status, data } = await this.repo.updateReserve({
      roomId,
      msgBody,
      reservedAt,
      msgType,
      rawContent,
      appId,
      reservationId,
      alarmedAt,
    });
    if (status === 'OK') {
      this.setCurrentReserveId(data.reservationId);
      return true;
    }
    this.setCurrentReserveId(-1);
    return false;
  };

  getReserve = async ({ reservationId }: { reservationId: number }) => {
    const { status, data } = await this.repo.getReserve(reservationId);
    if (status === 'OK') {
      this.setCurrentReserve(new ReserveModel(data as ReserveInterface));
      return true;
    }
    this.setCurrentReserve(null);
    return false;
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
    const { status, data } = await this.repo.getReserves({
      reserveStatus,
      size,
      offset,
    });
    if (status === 'OK') {
      return data;
    }
    return null;
  };

  deleteReserve = async ({ reservationId }: { reservationId: number }) => {
    const { status, data } = await this.repo.deleteReserve(reservationId);
    if (status === 'OK') {
      this.setCurrentReserve(null);
      return true;
    }
    return false;
  };

  get currentReserveId(): number {
    return this.__currentReserveId;
  }

  setCurrentReserveId(id: number) {
    this.__currentReserveId = id;
  }

  get currentReserve(): ReserveModel | null {
    return this.__currentReserve;
  }

  setCurrentReserve(reserve: ReserveModel | null) {
    this.__currentReserve = reserve;
  }

  get entryPoint(): 'LNB' | 'Footer' {
    return this.__entryPoint;
  }

  setEntryPoint(entry: 'LNB' | 'Footer') {
    this.__entryPoint = entry;
  }
}
